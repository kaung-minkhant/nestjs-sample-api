import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum'
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const PORT: number = 3001;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    await app.init();
    await app.listen(PORT)

    let prisma = app.get(PrismaService);
    await prisma.cleanDb()
    pactum.request.setBaseUrl(`http://localhost:${PORT}`)
  });

  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'a@gmail.com',
      password: '1234'
    }
    describe('sign up', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST)
      })
      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
      })
    })

    describe('sign in', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(HttpStatus.BAD_REQUEST)
      })
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token')
      })
    })
  })

  describe('User', () => {
    describe('Get Me', () => {
      it('should get user info', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.OK)
      })
    })
    describe('Edit User', () => {
      it('shoud edit user info', () => {
        const dto: EditUserDto = {
          email: 'b@gmail.com',
        }
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.ACCEPTED)
          .expectBodyContains(dto.email)
      })
    })
  })

  describe('Bookmark', () => {
    describe('Get Empty Bookmark', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([])
      })
    })
    describe('Create Bookmark', () => {
      it('should create a new bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'sample bookmark',
          description: 'this is sample bookmark',
          link: 'this is a link'
        }
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(dto.link)
          .stores('bookmarkId', 'id')
      })
    })
    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1)
      })
    })
    describe('Get Bookmark by ID', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}')
      })
    })
    describe('Edit Bookmark', () => {
      const dto: EditBookmarkDto = {
        link: 'updated link'
      }
      it('should throw if can\'t find bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}'+'1')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(HttpStatus.NOT_FOUND)
      })
      it('should update bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(HttpStatus.ACCEPTED)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(dto.link)
      })
    })
    describe('Delete Bookmark', () => { 
      it('should throw if can\'t find bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}'+'1')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.NOT_FOUND)
      })
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}')
      })
      it('should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0)
      })
    })
  })
})
