import request from 'supertest';

import { app } from '../../app';

it("Возврощает код 201 при успешной регистрации.", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(201);
});

it("Возврощает код 400 при указании некорректного емейла.", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test#test.com",
      password: "Password"
    })
    .expect(400);
});

it("Возврощает код 400 при указании некорректного пароля.", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test#test.com",
      password: "p"
    })
    .expect(400);
});

it("Возврощает код 400 при отсутствии емейла и пароля.", async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: "test#test.com",
  })
  .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: "p"
    })
    .expect(400);
});

it("Запрещает регистрацию на существующий емейл.", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(400);
});

it("Устанавливает куки после успешной регистрации.", async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});