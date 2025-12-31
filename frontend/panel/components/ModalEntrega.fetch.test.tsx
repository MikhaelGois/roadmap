import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ModalEntrega from './ModalEntrega'
import axios from 'axios'

jest.mock('axios')
const mocked = axios as jest.Mocked<typeof axios>

describe('ModalEntrega driver list', ()=>{
  it('fetches drivers and shows options', async ()=>{
    mocked.get.mockResolvedValueOnce({ data: [ { id: 'd1', name: 'Ana' }, { id: 'd2', name: 'Carlos' } ] })
    render(<ModalEntrega open={true} onClose={()=>{}} delivery={{ id: '22', clientName: 'M' }} />)
    // wait for options
    await waitFor(()=> expect(screen.getByLabelText('Atribuir motorista')).toBeInTheDocument())
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
  })
})