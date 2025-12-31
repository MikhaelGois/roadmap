import request from 'supertest'
import app from '../../app'
import prisma from '../../db'

let driver: any, d1: any, d2: any, route: any

beforeAll(async ()=>{
  driver = await prisma.driver.create({ data: { name: 'Cancel Driver', phone: '000' } })
  d1 = await prisma.delivery.create({ data: { clientName: 'C1', address: 'A1', phone: '1', lat: -23.55, lng: -46.63 } })
  d2 = await prisma.delivery.create({ data: { clientName: 'C2', address: 'A2', phone: '2', lat: -23.56, lng: -46.64 } })
  route = await prisma.route.create({ data: { driverId: driver.id, waypoints: [d1.id, d2.id], distance: 100, duration: 60 } })
  await prisma.delivery.updateMany({ where: { id: { in: [d1.id, d2.id] } }, data: { assignedToId: driver.id, status: 'ASSIGNED' } })
})

afterAll(async ()=>{
  await prisma.delivery.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.route.deleteMany()
  await prisma.$disconnect()
})

describe('POST /routes/:id/cancel', ()=>{
  it('cancels route and unassigns deliveries', async ()=>{
    const res = await request(app).post(`/routes/${route.id}/cancel`).send()
    expect(res.statusCode).toBe(200)
    const ud1 = await prisma.delivery.findUnique({ where: { id: d1.id } })
    const ud2 = await prisma.delivery.findUnique({ where: { id: d2.id } })
    expect(ud1?.assignedToId).toBeNull()
    expect(ud2?.assignedToId).toBeNull()
    const r = await prisma.route.findUnique({ where: { id: route.id } })
    expect(r).toBeNull()
  })
})
