"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, Share2, X } from "lucide-react"
import { useImageContext } from "@/lib/image-context"

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState("after")
  const [isMobile, setIsMobile] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [showImagePopup, setShowImagePopup] = useState(false)
  const { uploadedImage } = useImageContext()

  useEffect(() => {
    // 画面遷移時に最上部にスクロールする
    window.scrollTo(0, 0)

    // Check if the device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Store the initial touch position
    const touchStartX = e.touches[0].clientX

    // Add a touch move event listener
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndX = e.touches[0].clientX
      const diff = touchEndX - touchStartX

      // If swiped left to right, show before image
      if (diff > 50 && activeTab === "after") {
        setActiveTab("before")
      }
      // If swiped right to left, show after image
      else if (diff < -50 && activeTab === "before") {
        setActiveTab("after")
      }
    }

    // Add a touch end event listener to clean up
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  const handleSave = () => {
    // In a real app, this would trigger a download
    // For now, we'll just simulate it with an alert
    alert("画像を保存しています...")
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const handleConsult = () => {
    window.open(
      "https://entry.refotoru.jp/regist/is?SMPFORM=ndqd-lhsbqd-743be428a3c9d530e62356be81517257&_gl=1*1fn60kc*_gcl_aw*R0NMLjE3NDI5MTY4OTEuQ2owS0NRandxSW1fQmhEbkFSSXNBS0JZY210djBSakRhTlh4ek9adktiVUM2T2FjVkRNYzNJd2ZzRHhfNU8wby1uRnlKNEs1dFhsckFZb2FBbnBrRUFMd193Y0I.*_gcl_au*MTI0MzQ0MzMzOC4xNzM3NzI3NDcy*_ga*MjA1MDY3MzE4LjE3Mzc3Mjc0NzI.*_ga_XLD4Q8640D*MTc0MjkxNjg5MC4xNy4wLjE3NDI5MTY4OTAuMC4wLjA.",
      "_blank",
    )
  }

  const handleImageClick = () => {
    setShowImagePopup(true)
  }

  return (
    <div className="bg-[var(--app-bg)] min-h-screen preserve-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 md:col-start-3">
            {/* ステップナビゲーション */}
            <div className="step-nav">
              <div className="step-item">
                <div className="step-circle step-completed">1</div>
                <div className="step-label">
                  部屋写真
                  <br />
                  アップ
                </div>
              </div>
              <div className="step-line line-active"></div>
              <div className="step-item">
                <div className="step-circle step-completed">2</div>
                <div className="step-label">
                  カテゴリ
                  <br />
                  範囲選択
                </div>
              </div>
              <div className="step-line line-active"></div>
              <div className="step-item">
                <div className="step-circle step-completed">3</div>
                <div className="step-label">素材選択</div>
              </div>
              <div className="step-line line-active"></div>
              <div className="step-item">
                <div className="step-circle step-active">4</div>
                <div className="step-label">作成完了</div>
              </div>
            </div>

            <div className="text-center mb-4 mt-6">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">作成完了！</h1>
              <p className="text-sm md:text-base text-[var(--text-secondary)] mt-2">タブで Before/After を切り替え</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-lg p-6 mb-8 relative preserve-card">
              {/* タブ切り替えボタン */}
              <div className="flex mb-4">
                <button
                  className={`tab-button ${activeTab === "before" ? "tab-active" : "tab-inactive"}`}
                  onClick={() => handleTabChange("before")}
                >
                  Before
                </button>
                <button
                  className={`tab-button ${activeTab === "after" ? "tab-active" : "tab-inactive"}`}
                  onClick={() => handleTabChange("after")}
                >
                  After
                </button>
              </div>

              <div
                className="relative w-full mb-6 cursor-pointer"
                onTouchStart={handleTouchStart}
                onClick={handleImageClick}
              >
                {activeTab === "before" ? (
                  uploadedImage ? (
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Before Image"
                      width={640}
                      height={480}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg?height=480&width=640&text=アップロードされた写真"
                      alt="Before Image"
                      width={640}
                      height={480}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  )
                ) : (
                  <Image
                    src="/placeholder.svg?height=480&width=640&text=生成された写真"
                    alt="After Image"
                    width={640}
                    height={480}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                )}
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <button
                  className="action-button flex-1 flex items-center justify-center gap-2 py-3 text-base"
                  onClick={handleSave}
                >
                  <Download className="w-5 h-5 md:w-5 md:h-5 preserve-white-text" />
                  <span className="preserve-white-text">保存する</span>
                </button>
                <button
                  className="action-button flex-1 flex items-center justify-center gap-2 py-3 text-base"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5 md:w-5 md:h-5 preserve-white-text" />
                  <span className="preserve-white-text">共有する</span>
                </button>
              </div>

              {showShareOptions && (
                <div className="flex justify-center gap-6 mb-8">
                  <Link href="https://www.instagram.com" target="_blank">
                    <Button variant="outline" className="w-16 h-16 p-0">
                      <Image src="/images/instagram-icon.png" alt="Instagram" width={32} height={32} />
                    </Button>
                  </Link>
                  <Link href="https://www.twitter.com" target="_blank">
                    <Button variant="outline" className="w-16 h-16 p-0">
                      <Image src="/images/x-icon.jpeg" alt="X" width={32} height={32} />
                    </Button>
                  </Link>
                  <Link href="https://www.facebook.com" target="_blank">
                    <Button variant="outline" className="w-16 h-16 p-0">
                      <Image src="/images/facebook-icon.png" alt="Facebook" width={32} height={32} />
                    </Button>
                  </Link>
                  <Link href="https://www.pinterest.com" target="_blank">
                    <Button variant="outline" className="w-16 h-16 p-0">
                      <Image src="/images/pinterest-icon.png" alt="Pinterest" width={32} height={32} />
                    </Button>
                  </Link>
                </div>
              )}

              <div className="bg-[var(--comparison-bg)] p-4 rounded-lg mb-6 preserve-card">
                <p className="text-sm md:text-base text-center text-[var(--text-primary)] mobile-wrap">
                  国土交通大臣登録団体の事業者を最大4社までご紹介します
                </p>
              </div>

              <a
                href="https://entry.refotoru.jp/regist/is?SMPFORM=ndqd-lhsbqd-743be428a3c9d530e62356be81517257&_gl=1*1fn60kc*_gcl_aw*R0NMLjE3NDI5MTY4OTEuQ2owS0NRandxSW1fQmhEbkFSSXNBS0JZY210djBSakRhTlh4ek9adktiVUM2T2FjVkRNYzNJd2ZzRHhfNU8wby1uRnlKNEs1dFhsckFZb2FBbnBrRUFMd193Y0I.*_gcl_au*MTI0MzQ0MzMzOC4xNzM3NzI3NDcy*_ga*MjA1MDY3MzE4LjE3Mzc3Mjc0NzI.*_ga_XLD4Q8640D*MTc0MjkxNjg5MC4xNy4wLjE3NDI5MTY4OTAuMC4wLjA."
                className="company-intro-link-outline block w-full mb-6 text-[var(--accent-color)] bg-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="free-badge preserve-white-text">無料</span>
                優良リフォーム会社のご紹介はこちら
              </a>
            </div>

            {/* モバイル用のナビゲーションボタン */}
            {isMobile ? (
              <div className="flex flex-col gap-3 mb-8">
                <Link href="/3-materials">
                  <div className="nav-button-back w-full">
                    <span className="button-text">←戻る</span>
                  </div>
                </Link>
                <Link href="/1-upload">
                  <div className="nav-button-try w-full">
                    <span className="button-text">他の部屋でも試す</span>
                  </div>
                </Link>
                <Link href="/">
                  <div className="nav-button w-full">
                    <span className="button-text">トップページへ</span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap justify-between gap-2 mt-auto">
                <Link href="/3-materials">
                  <div className="nav-button-back">
                    <span className="button-text">←戻る</span>
                  </div>
                </Link>
                <Link href="/1-upload">
                  <div className="nav-button-try">
                    <span className="button-text">他の部屋でも試す</span>
                  </div>
                </Link>
                <Link href="/">
                  <div className="nav-button">
                    <span className="button-text">トップページへ</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 画像ポップアップ */}
      {showImagePopup && (
        <div className="image-popup-overlay" onClick={() => setShowImagePopup(false)}>
          <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-popup-close" onClick={() => setShowImagePopup(false)}>
              <X size={20} />
            </button>
            {activeTab === "before" ? (
              uploadedImage ? (
                <Image
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Before Image"
                  width={1200}
                  height={900}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Image
                  src="/placeholder.svg?height=900&width=1200&text=アップロードされた写真"
                  alt="Before Image"
                  width={1200}
                  height={900}
                  className="max-w-full max-h-full object-contain"
                />
              )
            ) : (
              <Image
                src="/placeholder.svg?height=900&width=1200&text=生成された写真"
                alt="After Image"
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

