import request from 'supertest'
import app from '../../app'

describe('POST /routes/optimize', () => {
  it('returns 400 when no waypoints', async () => {
    const res = await request(app).post('/routes/optimize').send({ origin: { lat:0, lng:0 }, waypoints: [] })
    expect(res.statusCode).toBe(400)
  })
})

