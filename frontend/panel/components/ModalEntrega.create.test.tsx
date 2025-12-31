import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ModalEntrega from './ModalEntrega'
import axios from 'axios'

jest.mock('axios')
const mocked = axios as jest.Mocked<typeof axios>

describe('ModalEntrega quick create driver', ()=>{
  it('creates driver and selects it', async ()=>{
    mocked.get.mockResolvedValueOnce({ data: [ { id: 'd1', name: 'Ana' } ] })
    mocked.post.mockResolvedValueOnce({ data: { id: 'd-new', name: 'Novo Motorista', phone: '123' } })

    render(<ModalEntrega open={true} onClose={()=>{}} delivery={{ id: '22', clientName: 'M' }} />)

    // wait for select to be present
    await waitFor(()=> expect(screen.getByLabelText('Atribuir motorista')).toBeInTheDocument())

    // open create form
    fireEvent.click(screen.getByText('Criar motorista'))
    expect(screen.getByLabelText('Nome do motorista')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Nome do motorista'), { target: { value: 'Novo Motorista' } })
    fireEvent.change(screen.getByLabelText('Telefone do motorista'), { target: { value: '123' } })

    fireEvent.click(screen.getByText('Criar'))

    await waitFor(()=> expect(mocked.post).toHaveBeenCalledWith('/api/drivers', expect.objectContaining({ name: 'Novo Motorista' })))
    // new option should be present and selected
    await waitFor(()=> expect((screen.getByLabelText('Atribuir motorista') as HTMLSelectElement).value).toBe('d-new'))
  })
})