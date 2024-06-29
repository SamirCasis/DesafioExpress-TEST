import { describe, test, expect } from 'vitest'
import request from 'supertest'
import server from './index.js'

describe('Operaciones CRUD de cafes', () => {
  test('GET /cafes debe devolver un status code 200 y un arreglo con al menos 1 objeto', async () => {
    const response = await request(server).get('/cafes')
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })

  test('DELETE /cafes/:id debe devolver un status code 404 si el id no existe', async () => {
    const token = 'jwt_KEY'
    const response = await request(server)
      .delete('/cafes/9999')
      .set('Authorization', token)
    expect(response.status).toBe(404)
  })

  test('POST /cafes debe agregar un nuevo cafe y devolver un código 201', async () => {
    const newCafe = { id: 5, nombre: 'Latte' }
    const response = await request(server).post('/cafes').send(newCafe)
    expect(response.status).toBe(201)
    expect(response.body).toContainEqual(newCafe)
  })

  test('PUT /cafes/:id debe devolver un status code 400 si el id del parámetro no coincide con el id del payload', async () => {
    const updatedCafe = { id: 6, nombre: 'Latte Vainilla' }
    const response = await request(server).put('/cafes/5').send(updatedCafe)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'El id del parámetro no coincide con el id del café recibido')
  })
})
