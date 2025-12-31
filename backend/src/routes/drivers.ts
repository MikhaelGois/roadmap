import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const drivers = await prisma.driver.findMany();
  res.json(drivers);
});

router.post('/', async (req, res) => {
  const { name, phone, vehicle } = req.body;
  const d = await prisma.driver.create({ data: { name, phone, vehicle } });
  res.status(201).json(d);
});

router.get('/:id/deliveries', async (req, res) => {
  const { id } = req.params;
  const deliveries = await prisma.delivery.findMany({ where: { assignedToId: id } });
  res.json(deliveries);
});

export default router;
