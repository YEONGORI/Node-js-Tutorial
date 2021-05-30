import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @MaxLength(10)
  @MinLength(2)
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MaxLength(20)
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @IsNumber()
  @IsOptional()
  readonly createdAt: number;

  @IsNumber()
  @IsOptional()
  readonly updatedAt: number;
}
