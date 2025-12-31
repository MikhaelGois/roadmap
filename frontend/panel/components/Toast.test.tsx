import { render, screen } from '@testing-library/react'
import { ToastProvider } from './ToastContext'

describe('ToastProvider', ()=>{
  it('renders children and exposes push (smoke)', ()=>{
    render(<ToastProvider><div>child</div></ToastProvider>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })
})