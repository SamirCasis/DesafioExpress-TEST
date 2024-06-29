import { describe, test, expect } from 'vitest'
import request from 'supertest'
import server from './index.js'

describe('Operaciones CRUD de cafes', () => {
  let cafeId

  test('GET /cafes debe devolver una lista de cafes', async () => {
    const response = await request(server).get('/cafes')
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })

  test('GET /cafes/:id debe devolver un cafe específico', async () => {
    const response = await request(server).get('/cafes/1')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', 1)
  })

  test('POST /cafes debe crear un nuevo cafe', async () => {
    const newCafe = { id: 5, nombre: 'Latte' }
    const response = await request(server).post('/cafes').send(newCafe)
    expect(response.status).toBe(201)
    expect(response.body).toContainEqual(newCafe)
    cafeId = newCafe.id
  })

  test('PUT /cafes/:id debe actualizar un cafe existente', async () => {
    const updatedCafe = { id: cafeId, nombre: 'Latte Vainilla' }
    const response = await request(server).put(`/cafes/${cafeId}`).send(updatedCafe)
    expect(response.status).toBe(200)
    expect(response.body).toContainEqual(updatedCafe)
  })

  test('DELETE /cafes/:id debe eliminar un cafe existente', async () => {
    const token = 'jwt_KEY'
    const response = await request(server)
      .delete(`/cafes/${cafeId}`)
      .set('Authorization', token)
    expect(response.status).toBe(200)
    expect(response.body).not.toContainEqual(expect.objectContaining({ id: cafeId }))
  })

  test('DELETE /cafes/:id sin token debe fallar', async () => {
    const response = await request(server).delete(`/cafes/${cafeId}`)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'No recibió ningún token en las cabeceras')
  })
})
