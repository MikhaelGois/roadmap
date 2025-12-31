import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ToastProvider, useToast } from './ToastContext'

function TestPusher(){
  const toast = useToast()
  return (
    <div>
      <button onClick={()=>toast.push('Hello', 'success')}>Push</button>
      <button onClick={()=>toast.push('Action me', 'info', { actionLabel: 'Open', onAction: () => { (window as any).__ACTION_CALLED = true }})}>PushAction</button>
      <button onClick={()=>toast.push('Persist', 'error', { ttl: 0 })}>PushPersistent</button>
    </div>
  )
}

describe('ToastProvider', ()=>{
  it('shows a toast and allows dismiss', async ()=>{
    render(<ToastProvider><TestPusher/></ToastProvider>)
    fireEvent.click(screen.getByText('Push'))
    expect(await screen.findByText('Hello')).toBeInTheDocument()
    // dismiss
    fireEvent.click(screen.getByLabelText('Dismiss notification'))
    await waitFor(()=> expect(screen.queryByText('Hello')).not.toBeInTheDocument())
  })

  it('shows action button and calls callback', async ()=>{
    render(<ToastProvider><TestPusher/></ToastProvider>)
    fireEvent.click(screen.getByText('PushAction'))
    const action = await screen.findByText('Action me')
    expect(action).toBeInTheDocument()
    fireEvent.click(screen.getByText('Open'))
    await waitFor(()=> expect((window as any).__ACTION_CALLED).toBe(true))
  })

  it('persistent toast stays until dismissed when ttl=0', async ()=>{
    jest.useFakeTimers()
    render(<ToastProvider><TestPusher/></ToastProvider>)
    fireEvent.click(screen.getByText('PushPersistent'))
    // advance time beyond normal ttl
    jest.advanceTimersByTime(10000)
    // should still be present
    expect(screen.getByText('Persist')).toBeInTheDocument()
    // dismiss manually
    fireEvent.click(screen.getAllByLabelText('Dismiss notification')[0])
    await waitFor(()=> expect(screen.queryByText('Persist')).not.toBeInTheDocument())
    jest.useRealTimers()
  })
})
