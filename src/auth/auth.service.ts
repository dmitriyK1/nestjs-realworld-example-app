import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/dto/current-user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  public async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user?.password) {
      return null;
    }

    if (!(await compare(password, user.password))) {
      return null;
    }

    return user;
  }

  public async getUserWithToken(user: User) {
    return UserDTO.map(
      user,
      this.jwtService.sign({
        username: user.name,
        sub: user.id,
      }),
    );
  }
}
