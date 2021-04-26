import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/code')
  getCode() {
    const directory = path.resolve(__dirname, './../files/jonrodsanz/python');
    const result = fs.readFileSync(path.join(directory, 'main.py'), 'utf8');
    return result;
  }

  @Post('/code')
  async executeCode(@Body() body): Promise<string> {
    try {
      const directory = path.resolve(__dirname, './../files/jonrodsanz/python');
      fs.writeFileSync(path.join(directory, 'main.py'), body.code, {
        encoding: 'utf8',
        flag: 'w',
      });
      const command = `docker run  -t --rm -m 64M --memory-swap 64M -v ${directory}:/code -w /code python:3.7-alpine python3 -u main.py`;
      const result = await this.appService.dockerRunAndCleanup(command, 5000);
      return result;
    } catch (error) {
      console.log('[ERROR] ' + error);
      return error;
    }
  }
}
