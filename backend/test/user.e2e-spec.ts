import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../src/users/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          logging: false,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // beforeEach(async () => {
  // });

  it('/users (GET) - return empty', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((response) => {
        return expect(response.body).toHaveLength(0);
      });
  });

  it('/users (POST)', () => {
    const payload = {
      email: 'admin@test.com',
      username: 'admin',
      password: 'admin1234',
    };
    return request(app.getHttpServer())
      .post('/users')
      .send(payload)
      .expect(201);
  });

  it('/users (GET) - have one user', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((response) => {
        return expect(response.body).toHaveLength(1);
      });
  });
});
