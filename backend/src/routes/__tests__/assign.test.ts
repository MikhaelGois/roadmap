import request from 'supertest'
import app from '../../app'
import prisma from '../../db'

beforeAll(async ()=>{
  // ensure clean
})

afterAll(async ()=>{
  await prisma.delivery.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.route.deleteMany()
  await prisma.$disconnect()
})

describe('POST /routes/assign', () => {
  it('creates a route and assigns deliveries', async () => {
    // create driver
    const driver = await prisma.driver.create({ data: { name: 'Test Driver', phone: '000' } })
    // create deliveries
    const d1 = await prisma.delivery.create({ data: { clientName: 'A', address: 'Addr A', phone: '1', lat: -23.55, lng: -46.63 } })
    const d2 = await prisma.delivery.create({ data: { clientName: 'B', address: 'Addr B', phone: '2', lat: -23.56, lng: -46.64 } })

    const res = await request(app).post('/routes/assign').send({ driverId: driver.id, ordered: [d1.id, d2.id], distance: 1000, duration: 600 })
    expect(res.statusCode).toBe(200)
    expect(res.body.route).toBeDefined()

    const updated1 = await prisma.delivery.findUnique({ where: { id: d1.id } })
    const updated2 = await prisma.delivery.findUnique({ where: { id: d2.id } })
    expect(updated1?.assignedToId).toBe(driver.id)
    expect(updated2?.assignedToId).toBe(driver.id)
  })
})
