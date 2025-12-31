import { Router } from 'express';
import prisma from '../db';
import { emitToDriver, emitToOperators } from '../socket';

const router = Router();

// List deliveries
router.get('/', async (req, res) => {
  const deliveries = await prisma.delivery.findMany({ include: { assignedTo: true } });
  res.json(deliveries);
});

// Create delivery
router.post('/', async (req, res) => {
  const { clientName, address, phone, value, lat, lng } = req.body;
  const d = await prisma.delivery.create({ data: { clientName, address, phone, value: value || 0, lat, lng } });
  emitToOperators('deliveryCreated', d);
  res.status(201).json(d);
});

// Get one delivery
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const d = await prisma.delivery.findUnique({ where: { id }, include: { assignedTo: true } });
  if(!d) return res.status(404).json({ message: 'not found' });
  res.json(d);
});

// Assign delivery to driver
router.post('/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { driverId } = req.body;
  const updated = await prisma.delivery.update({ where: { id }, data: { assignedToId: driverId, status: 'ASSIGNED' } });
  emitToDriver(driverId, 'assignedDelivery', updated);
  emitToOperators('deliveryAssigned', updated);
  res.json(updated);
});

// Update status
router.post('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await prisma.delivery.update({ where: { id }, data: { status } });
  emitToOperators('statusUpdated', updated);
  res.json(updated);
});

// Update delivery (partial update)
router.put('/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const allowed: any = {};
    const fields = ['clientName','address','lat','lng','phone','value','status','assignedToId'];
    for(const f of fields) if(typeof req.body[f] !== 'undefined') allowed[f] = req.body[f];

    const prev = await prisma.delivery.findUnique({ where: { id } });
    if(!prev) return res.status(404).json({ message: 'not found' });

    const updated = await prisma.delivery.update({ where: { id }, data: allowed });

    // emit relevant events
    emitToOperators('deliveryUpdated', updated);
    if(allowed.assignedToId && allowed.assignedToId !== prev.assignedToId){
      emitToDriver(allowed.assignedToId, 'assignedDelivery', updated);
      emitToOperators('deliveryAssigned', updated);
    }

    res.json(updated);
  }catch(e){
    console.error('update delivery failed', e)
    res.status(500).json({ message: 'update failed' })
  }
});

import multer from 'multer'
import { uploadFile } from '../uploads'

const upload = multer({ storage: multer.memoryStorage() })

// Upload proof (photo / signature)
router.post('/:id/proof', upload.single('file'), async (req, res) => {
  try{
    const { id } = req.params
    if(!req.file) return res.status(400).json({ message: 'file missing' })
    // stream from buffer
    const stream = require('stream')
    const read = new stream.PassThrough()
    read.end(req.file.buffer)

    const url = await uploadFile(read, req.file.originalname, req.file.mimetype)
    const updated = await prisma.delivery.update({ where: { id }, data: { proofUrl: url, status: 'DELIVERED' } })
    emitToOperators('statusUpdated', updated)
    res.json(updated)
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'upload failed' })
  }
});

export default router;
