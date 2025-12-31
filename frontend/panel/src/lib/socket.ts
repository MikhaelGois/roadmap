import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function initSocket(){
  if(socket) return socket
  if(typeof window !== 'undefined' && (window as any).__USE_MOCK && (window as any).__MOCK_SOCKET){
    socket = (window as any).__MOCK_SOCKET as any
    return socket
  }
  socket = io(typeof window !== 'undefined' ? 'http://localhost:4000' : '')
  return socket
}

export function getSocket(){
  return socket
}
