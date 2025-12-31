import request from 'supertest'
import app from '../app'

describe('GET /deliveries', () => {
  it('should respond 200', async () => {
    const res = await request(app).get('/deliveries')
    expect(res.statusCode).toBe(200)
  })
})
