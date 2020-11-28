import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/code')
  async executeCode(@Body() body): Promise<string> {
    const directory = path.resolve(
      __dirname,
      './../../files/jonrodsanz/node-test',
    );

    fs.writeFileSync(path.join(directory, 'index.js'), body.code, {
      encoding: 'utf8',
      flag: 'w',
    });

    const command = `docker run --rm -m 64M --memory-swap 64M -v ${directory}:/code -w /code -t node:15.3.0-alpine3.10 node index.js`;
    return await this.appService.dockerRunAndCleanup(command, 15000);
  }
}
