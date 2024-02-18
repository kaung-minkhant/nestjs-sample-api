import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch()
  editUser(@Body() dto: EditUserDto, @GetUser('id') userId: string) {
    return this.userService.editUser(userId, dto)
  }

}