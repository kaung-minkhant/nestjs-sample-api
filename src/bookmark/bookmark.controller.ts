import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { BookmarkService } from "./bookmark.service";
import { GetUser } from "../auth/decorator";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getAllBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getAllBookmarks(userId)
  }

  @Get(':id')
  getBookmarkById(@GetUser('id') userId: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  createBookmark(@GetUser('id') userId: string, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto)
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  editBookmarkById(@GetUser('id') userId: string, @Param('id') bookmarkId: string, @Body() dto: EditBookmarkDto) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto)
  }

  @Delete(':id')
  deleteBookmarkById(@GetUser('id') userId: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)
  }
}