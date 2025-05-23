import '../../styles/global.css'
import type { AppProps } from "next/app"
import { Header } from '../components/Header'
import { SessionProvider } from "next-auth/react"
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
