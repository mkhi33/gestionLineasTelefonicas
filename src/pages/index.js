import Image from 'next/image'
import { Inter } from 'next/font/google'
import Layout from '@/Layout/Layout.jsx'
import { AuthProvider } from '@/context/authProvider'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (

    <Layout>
      Desde inicio
    </Layout>


  )
}
