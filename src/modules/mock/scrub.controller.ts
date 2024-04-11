import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { NotFoundError } from 'rxjs';

@Controller('/scrub')
export class ScrubController {
  @Get('/contact/:id')
  contactPage(@Res() res, @Param('id') id: number) {
    res.setHeader('Content-Type', 'text/html');
    switch (id) {
      case 1:
        return res.send('<h1>Hello, World!</h1> mo@itsmrtech.com');
      case 2:
        return res.send('<h1>Hello, World!</h1> info@google.com');
      case 3:
        return res.send(
          '<h1>Hello, World!</h1> <a href="mailto:info@facebook.com">info@facebook.com</a>',
        );
      default:
        throw new HttpException('Contact page not found', HttpStatus.NOT_FOUND);
    }
  }
}
