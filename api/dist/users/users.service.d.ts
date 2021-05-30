import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-users.dto';
import { User, UserDocument } from './entities/users.entity';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(CreateUserDto: CreateUserDto): Promise<User>;
    getUser(email: string): Promise<User | undefined>;
}
