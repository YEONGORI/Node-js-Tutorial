import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-users.dto';
import { User, UserDocument } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(CreateUserDto);
    return createdUser.save();
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }
}
