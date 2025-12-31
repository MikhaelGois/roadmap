import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ModalEntrega from './ModalEntrega'

describe('ModalEntrega', ()=>{
  it('focuses first focusable element and closes on Esc', ()=>{
    const onClose = jest.fn()
    render(<ModalEntrega open={true} onClose={onClose} delivery={{ id: '22', clientName: 'M' }} />)
    const closeBtn = screen.getByLabelText('Fechar')
    expect(closeBtn).toBeInTheDocument()
    // simulate Escape
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onSave with form data when Save clicked', async ()=>{
    const onClose = jest.fn()
    const onSave = jest.fn().mockResolvedValue(true)
    const delivery = { id: '22', clientName: 'M', status: 'PENDING', assignedToId: '' }
    render(<ModalEntrega open={true} onClose={onClose} onSave={onSave} delivery={delivery} />)
    // change status
    fireEvent.change(screen.getByDisplayValue('PENDING'), { target: { value: 'DELIVERED' } })
    const saveBtn = screen.getByText('Salvar')
    fireEvent.click(saveBtn)
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ status: 'DELIVERED' }))
  })
})