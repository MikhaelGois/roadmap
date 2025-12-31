import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { ToastProvider } from '../components/ToastContext'

if (typeof window !== 'undefined') {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === '1' || !process.env.NEXT_PUBLIC_API_URL || window.location.hostname.endsWith('github.io') || window.location.search.includes('mock=1')
  if (useMock) {
    // initialize the mock server (axios adapter + fake socket) in the browser
    import('../src/lib/mockServer').then((m) => m.startMock()).catch(() => {})
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ToastProvider>
  )
}
