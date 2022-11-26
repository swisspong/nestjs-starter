import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport"
import { User } from '@prisma/client';
import { Request } from 'express'
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
@Controller('users')
export class UserController {


    @UseGuards(JwtGuard)
    @Get('me')
    // @UseGuards(AuthGuard("jwt"))
    // getMe(@Req() req:Request) {
    //     return req.user
    // }
    getMe(@GetUser() user: User, @GetUser('email') email: string) {
        console.log(email)
        return user
    }
}
