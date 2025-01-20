import { NextResponse } from 'next/server'

// Keep track of active SSE connections
export const clients = new Set<ReadableStreamController<any>>()

// Cleanup function to remove closed connections
export function removeClient(controller: ReadableStreamController<any>) {
  clients.delete(controller)
}

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)
      
      // Send initial connection message
      controller.enqueue('data: {"type":"connected"}\n\n')
      
      // Keep connection alive with periodic pings
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue('data: {"type":"ping"}\n\n')
        } catch (error) {
          clearInterval(pingInterval)
          removeClient(controller)
        }
      }, 30000) // Send ping every 30 seconds
      
      return () => {
        clearInterval(pingInterval)
        removeClient(controller)
      }
    },
    cancel() {
      console.log('Client disconnected from events stream')
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 