import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/code')
  async getHello(): Promise<string> {
    const directory = path.resolve(
      __dirname,
      './../../files/jonrodsanz/node-test',
    );

    const command = `docker run --rm -m 64M --memory-swap 64M -v ${directory}:/code -w /code node:15.3.0-alpine3.10 node index.js`;
    return await this.appService.dockerRunAndCleanup(command, 15000);
  }
}
