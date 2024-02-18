import { ForbiddenException, ImATeapotException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getAllBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: {
        userId
      }
    })
  }

  getBookmarkById(userId: string, bookmarkId: string) {
    return this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId
      }
    })
  }

  async createBookmark(userId: string, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId: userId,
        ...dto
      }
    })
    return bookmark
  }

  async editBookmarkById(userId: string, bookmarkId: string, dto: EditBookmarkDto) {
    // get bookmark
    let bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    })

    // check user and update
    if (!bookmark) throw new NotFoundException('Bookmark not found')  

    if (bookmark.userId !== userId) throw new ForbiddenException('Access denied')

    bookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId
      },
      data: {
        ...dto
      }
    })
    return bookmark
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    // get bookmark
    let bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    })
    // check if it exists
    if (!bookmark) throw new NotFoundException('Bookmark not found')  

    // check user owns it
    if (bookmark.userId !== userId) throw new ForbiddenException('Access denied')

    // delete
    bookmark = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId
      }
    })    
    return bookmark
  } 
}