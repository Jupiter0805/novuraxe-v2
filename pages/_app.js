import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '../styles/globals.css'
import '../styles/landing.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', 'G-D02S81LZG6', { page_path: url })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}