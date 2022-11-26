import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from "argon2"
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'
@Injectable()
export class AuthService {
  constructor(private readonly prismaServie: PrismaService, private jwt: JwtService, private configService: ConfigService) { }
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password)
      const user = await this.prismaServie.user.create({
        data: {
          email: dto.email,
          hash
        }
      })
      return this.signToken(user.id, user.email)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException("Credentials taken")
      }
      throw error
    }
  }
  async signin(dto: AuthDto) {
    try {

      //find user by email
      const user = await this.prismaServie.user.findUnique({
        where: { email: dto.email }
      })
      //if user does not exist throw exception
      if (!user) throw new ForbiddenException('Credentials incorrect')

      //compare password
      const pwMatches = await argon.verify(user.hash, dto.password)

      //if password incorrect throw exception
      if (!pwMatches) throw new ForbiddenException("Credential incorrect")

      //send back the user
      return this.signToken(user.id, user.email)
    } catch (error) {
      throw error
    }
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{access_token:string}> {
    const payload = {
      sub: userId,
      email
    }
    const secret = this.configService.get("JWT_SECRET")
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret
    })

    return {access_token:token}
  }
}
