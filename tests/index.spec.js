import { describe, test, expect } from 'vitest'
import request from 'supertest'
import app from './index.js'

describe('Operaciones CRUD de cafes', () => {
  test('GET /cafes It should return a status code 200 and an array with at least 1 object', async () => {
    const res = await request(app).get('/cafes')
    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBeGreaterThan(0)
  })

  test('DELETE /cafes/:id It should return a status code 404 if id does not exist', async () => {
    const jwt = 'token'
    const deletedCafeId = 999
    const res = await request(app)
      .delete(`/cafes/${deletedCafeId}`)
      .set("Authorization", jwt)
      .send()
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message', 'No se encontró ningún cafe con ese id')
  })

  test('POST /cafes It should add a new Coffe and return a status code 201', async () => {
    const postCafe = { id: 5, nombre: "Expresso" }
    const res = await request(app)
        .post('/cafes')
        .send(postCafe)
    expect(res.status).toBe(201)
    expect(res.body).toContainEqual(postCafe)
})

  test('PUT /cafes/:id It should return a status code code 400 if the parameter id does not match the payload id', async () => {
    const updCafe = { id: 6, nombre: 'Latte Vanilla' }
    const res = await request(app).put('/cafes/5').send(updCafe)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message', 'El id del parámetro no coincide con el id del café recibido')
  })
})

describe('Test ruta errónea', () => {
  test('It should return a status code 404 and an error message for incorrectly entered routes', async () => {
    const res = await request(app).get('/ruta/no/existente')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message', 'La ruta que intenta consultar no existe')
  })
})
