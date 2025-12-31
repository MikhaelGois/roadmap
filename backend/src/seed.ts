import prisma from './db'

async function main(){
  await prisma.driver.createMany({ data: [
    { name: 'João Motorista', phone: '+5511999999999', vehicle: 'Moto' },
    { name: 'Maria Entregas', phone: '+5511988888888', vehicle: 'Carro' }
  ]})

  await prisma.delivery.createMany({ data: [
    { clientName: 'Cliente A', address: 'Rua A, 123', phone: '+5511977777777', value: 20.5 },
    { clientName: 'Cliente B', address: 'Rua B, 456', phone: '+5511966666666', value: 35.0 }
  ]})

  console.log('Seed done')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
