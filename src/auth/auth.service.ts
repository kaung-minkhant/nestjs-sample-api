import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon2 from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwt: JwtService, private config: ConfigService) { }

  async login(dto: AuthDto) {
    // find user with email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    })
    // throw error if not found
    if (!Boolean(user)) {
      throw new ForbiddenException('User is not registerred')
    }

    // compare password
    const doesPasswordMatch = await argon2.verify(user.hash, dto.password)
    // throw if not matched
    if (!doesPasswordMatch) {
      throw new ForbiddenException('Credentials not matched');
    }

    // delete user.hash

    // // return user
    // return user

    // return signed token
    return this.signToken(user.id, user.email);
  };
  async signup(dto: AuthDto) {
    // hash the password
    const hash = await argon2.hash(dto.password)

    // create user
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        }
      })

      // //return created user
      // return user;

      // return token
      return this.signToken(user.id, user.email);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('User with email exists');
        }
        throw new Error('Unknown error in User Creation')
      }
    }
  };

  async signToken(userId: string, email: string): Promise<{access_token: string}> {
    // create jwt payload
    const payload = {
      sub: userId,
      email
    }

    // sign the token and return the promise
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    })
    return {
      access_token: token,
    }
  }
}