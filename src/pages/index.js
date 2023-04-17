import Image from 'next/image'
import { Inter } from 'next/font/google'
import Layout from '@/Layout/Layout.jsx'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout>
      Desde inicio
    </Layout>
  )
}
