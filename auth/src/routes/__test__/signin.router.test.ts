import request from 'supertest';

import { app } from '../../app';

it("Неудачная попытка авторизации, с несуществующим емейлом.", async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(400);
});

it("Неудачная попытка авторизации, с неверным паролем.", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "pasword"
    })
    .expect(400);
});

it("Удачная попытка авторизации, с верным емейлом и паролем.", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "Password"
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();  
});