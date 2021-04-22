import { exec } from 'child_process';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async dockerRunAndCleanup(cmd: string, timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, { timeout, killSignal: 'SIGKILL' }, (error, stdout, stderr) => {
        if (stderr) {
          const isMemoryError = stderr.startsWith(
            'docker: Error response from daemon: OCI runtime',
          );
          if (isMemoryError) reject('Out of Memory 64MB');
          else reject(stderr);
        }
        if (error) {
          if (error.killed) {
            // exec(`docker rm ${id}`); // kill the container
            reject(stdout + `\nTimeout after ${timeout}ms`);
          } else {
            reject(stdout);
          }
        } else {
          console.log({ stdout });
          resolve(stdout);
        }
        reject('Cannot run command' + cmd);
      });
    });
  }
}
