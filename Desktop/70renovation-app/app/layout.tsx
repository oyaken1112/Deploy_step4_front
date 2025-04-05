import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { ImageProvider } from "@/lib/image-context"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-sans-jp",
})

export const metadata: Metadata = {
  title: "リフォトル - リフォームイメージ作成",
  description: "リフォームのイメージを簡単に作成できるサービス",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans`}>
        <ImageProvider>
          <Header />
          <main className="min-h-screen flex flex-col main-content">
            <div className="flex-grow">{children}</div>
            <Footer />
          </main>
        </ImageProvider>
      </body>
    </html>
  )
}



import './globals.css'