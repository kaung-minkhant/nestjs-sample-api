import { Injectable } from "@nestjs/common";
import { EditUserDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      }
    })
    if (user) delete user.hash
    return user
  }
}