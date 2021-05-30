import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/users.entity';

import { UsersService } from '../users/users.service';
import { jwtSecret } from './strategies/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    if (user && user.password === password) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verfiyToken(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token, {
      secret: jwtSecret.secret,
    });

    const user = this.usersService.getUserByEmail(decoded.email);

    if (!user) {
      throw new Error('Unable to get the user from decoded token.');
    }

    return user;
  }
}
