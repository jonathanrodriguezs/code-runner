import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/code')
  getCode() {
    const directory = path.resolve(
      __dirname,
      './../files/jonrodsanz/node-test',
    );
    const result = fs.readFileSync(path.join(directory, 'index.js'), 'utf8');
    return result;
  }

  @Post('/code')
  async executeCode(@Body() body): Promise<string> {
    try {
      const directory = path.resolve(
        __dirname,
        './../files/jonrodsanz/node-test',
      );
      fs.writeFileSync(path.join(directory, 'index.js'), body.code, {
        encoding: 'utf8',
        flag: 'w',
      });
      const command = `docker run --rm -m 64M --memory-swap 64M -v ${directory}:/code -w /code -t node:15.3.0-alpine3.10 node index.js`;
      const result = await this.appService.dockerRunAndCleanup(command, 5000);
      return result;
    } catch (error) {
      console.log('[ERROR] ' + error);
      return error;
    }
  }
}
