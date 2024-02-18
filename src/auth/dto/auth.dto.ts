import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto { // normally interface, but to use class validators, a class is required
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}