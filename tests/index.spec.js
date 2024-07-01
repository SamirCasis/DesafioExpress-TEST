import { describe, test, expect } from 'vitest'
import request from 'supertest'
import server from './index.js'

describe('Operaciones CRUD de cafes', () => {
  test('GET /cafes It should return a status code 200 and an array with at least 1 object', async () => {
    const res = await request(server).get('/cafes')
    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBeGreaterThan(0)
  })

  test('DELETE /cafes/:id debe devolver un status code 404 si el id no existe', async () => {
    const jwt = 'token'
    const deletedCafeId = 999
    const res = await request(server)
      .delete(`/cafes/${deletedCafeId}`)
      .set("Authorization", jwt)
      .send()
      
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('message', 'No se encontró ningún cafe con ese id')
  })

  test('POST /cafes debe agregar un nuevo cafe y devolver un código 201', async () => {
    const id = Math.floor(Math.random() * 999)
    const addCafe = { id, nombre: "Nuevo cafe" }
    const res = await request(server).post('/cafes').send(addCafe)
    expect(res.status).toBe(201)
    expect(res.body).toContainEqual(addCafe)
  })

  test('POST /cafes debe devolver un código 400 si el id ya existe', async () => {
    const existingId = 1
    const addCafe = { id: existingId, nombre: "Cafe existente" }
    const res = await request(server).post('/cafes').send(addCafe)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message', 'Ya existe un cafe con ese id')
  })

  test('PUT /cafes/:id It should return a status code code 400 if the parameter id does not match the payload id', async () => {
    const updCafe = { id: 6, nombre: 'Latte Vainilla' }
    const res = await request(server).put('/cafes/5').send(updCafe)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message', 'El id del parámetro no coincide con el id del café recibido')
  })
})

describe('Test ruta errónea', () => {
  test('It should return a status code 404 and an error message for incorrectly entered routes', async () => {
    const res = await request(server).get('/ruta/no/existente')
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('La ruta que intenta consultar no existe')
  })
})
