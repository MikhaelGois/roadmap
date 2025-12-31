import request from 'supertest'
import app from '../../app'
import prisma from '../../db'

let driver: any, d1: any

afterAll(async ()=>{
  await prisma.delivery.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.$disconnect()
})

describe('PUT /deliveries/:id', () => {
  it('updates status and assignedToId', async () => {
    driver = await prisma.driver.create({ data: { name: 'Upd Driver', phone: '000' } })
    d1 = await prisma.delivery.create({ data: { clientName: 'UpdateMe', address: 'Addr', phone: '1' } })

    const res = await request(app).put(`/deliveries/${d1.id}`).send({ status: 'ASSIGNED', assignedToId: driver.id })
    expect(res.statusCode).toBe(200)
    expect(res.body.assignedToId).toBe(driver.id)
    expect(res.body.status).toBe('ASSIGNED')
  })
})
