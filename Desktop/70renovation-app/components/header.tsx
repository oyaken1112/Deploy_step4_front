"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 header ${
        isScrolled ? "header-scrolled py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gRaaoCAhk2Op4v1ZN7crDnv15qx4XZ.png"
            alt="リフォトル"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* ハンバーガーメニューボタン（PC・モバイル共通） */}
        <button className="text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* メニュー（PC・モバイル共通） */}
      {isMenuOpen && (
        <div className="bg-white shadow-lg absolute top-full left-0 right-0 p-4 flex flex-col space-y-4 mobile-menu">
          <Link
            href="/1-upload"
            className="header-menu-link mobile-menu-link font-medium py-2 text-[var(--text-primary)]"
            onClick={() => setIsMenuOpen(false)}
          >
            理想のお部屋イメージ画像を作る
            <style jsx>{`
            .mobile-menu-link {
              position: relative;
              color: black;
            }
            .mobile-menu-link::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background-color: var(--accent-color);
              transition: width 0.3s ease;
            }
            .mobile-menu-link:hover::after {
              width: 100%;
            }
          `}</style>
          </Link>
          <a
            href="https://entry.refotoru.jp/regist/is?SMPFORM=ndqd-lhsbqd-743be428a3c9d530e62356be81517257&_gl=1*1fn60kc*_gcl_aw*R0NMLjE3NDI5MTY4OTEuQ2owS0NRandxSW1fQmhEbkFSSXNBS0JZY210djBSakRhTlh4ek9adktiVUM2T2FjVkRNYzNJd2ZzRHhfNU8wby1uRnlKNEs1dFhsckFZb2FBbnBrRUFMd193Y0I.*_gcl_au*MTI0MzQ0MzMzOC4xNzM3NzI3NDcy*_ga*MjA1MDY3MzE4LjE3Mzc3Mjc0NzI.*_ga_XLD4Q8640D*MTc0MjkxNjg5MC4xNy4wLjE3NDI5MTY4OTAuMC4wLjA."
            className="flex items-center header-menu-link mobile-menu-link font-medium py-2 text-[var(--text-primary)]"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
          >
            優良リフォーム会社のご紹介はこちら
            <style jsx>{`
            .mobile-menu-link {
              position: relative;
              color: black;
            }
            .mobile-menu-link::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background-color: var(--accent-color);
              transition: width 0.3s ease;
            }
            .mobile-menu-link:hover::after {
              width: 100%;
            }
          `}</style>
          </a>
          <a
            href="https://refotoru.mapion.co.jp/b/refotoru/?_gl=1*1oo0m81*_gcl_aw*R0NMLjE3NDMzNDMzMTEuQ2owS0NRandxSW1fQmhEbkFSSXNBS0JZY210djBSakRhTlh4ek9adktiVUM2T2FjVkRNYzNJd2ZzRHhfNU8wby1uRnlKNEs1dFhsckFZb2FBbnBrRUFMd193Y0I.*_gcl_au*MTI0MzQ0MzMzOC4xNzM3NzI3NDcy*_ga*MjA1MDY3MzE4LjE3Mzc3Mjc0NzI.*_ga_XLD4Q8640D*MTc0MzM0MzMxMS4yMS4xLjE3NDMzNDM0MTMuMC4wLjA."
            className="header-menu-link mobile-menu-link font-medium py-2 text-[var(--text-primary)]"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
          >
            イメージ画像を探す
            <style jsx>{`
            .mobile-menu-link {
              position: relative;
              color: black;
            }
            .mobile-menu-link::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background-color: var(--accent-color);
              transition: width 0.3s ease;
            }
            .mobile-menu-link:hover::after {
              width: 100%;
            }
          `}</style>
          </a>
          <Link
            href="https://forest.toppan.com/refotoru/about/"
            className="header-menu-link mobile-menu-link font-medium py-2 text-[var(--text-primary)]"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
          >
            リフォトルとは
            <style jsx>{`
            .mobile-menu-link {
              position: relative;
              color: black;
            }
            .mobile-menu-link::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background-color: var(--accent-color);
              transition: width 0.3s ease;
            }
            .mobile-menu-link:hover::after {
              width: 100%;
            }
          `}</style>
          </Link>
        </div>
      )}
    </header>
  )
}

