"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ImageIcon, ShieldCheck } from "lucide-react"
import { useImageContext } from "@/lib/image-context"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { setUploadedImage } = useImageContext()
  const router = useRouter()

  useEffect(() => {
    // 画面遷移時に最上部にスクロールする
    window.scrollTo(0, 0)

    // Check if the device is mobile or tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleUploadClick = () => {
    // ポップアップを表示せず、直接ファイル選択ダイアログを開く
    document.getElementById("file-upload")?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 実際のアプリでは、ここでファイルをアップロードし、URLを取得します
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setUploadedImage(imageUrl) // コンテキストに画像を保存
    }
  }

  const handleBackClick = () => {
    if (previewImage) {
      setShowConfirmPopup(true)
    } else {
      router.push("/")
    }
  }

  const handleConfirmYes = () => {
    setShowConfirmPopup(false)
    setPreviewImage(null)
    setUploadedImage(null)
    router.push("/")
  }

  const handleConfirmNo = () => {
    setShowConfirmPopup(false)
  }

  const handleNextClick = (e: React.MouseEvent) => {
    if (!previewImage) {
      e.preventDefault()
      document.getElementById("error-message")?.classList.add("show")
      setTimeout(() => {
        document.getElementById("error-message")?.classList.remove("show")
      }, 3000)
    }
  }

  return (
    <div className="bg-[var(--app-bg)] min-h-screen preserve-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 md:col-start-3">
            {/* ステップナビゲーション */}
            <div className="step-nav">
              <div className="step-item">
                <div className="step-circle step-active">1</div>
                <div className="step-label">
                  部屋写真
                  <br />
                  アップ
                </div>
              </div>
              <div className="step-line line-active"></div>
              <div className="step-item">
                <div className="step-circle step-inactive">2</div>
                <div className="step-label">
                  カテゴリ
                  <br />
                  範囲選択
                </div>
              </div>
              <div className="step-line line-inactive"></div>
              <div className="step-item">
                <div className="step-circle step-inactive">3</div>
                <div className="step-label">素材選択</div>
              </div>
              <div className="step-line line-inactive"></div>
              <div className="step-item">
                <div className="step-circle step-inactive">4</div>
                <div className="step-label">作成完了</div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-center mb-8 mt-6 text-[var(--text-primary)]">
              部屋写真アップロード
            </h1>

            <div className="mb-8">
              <div
                className="border-2 border-dashed border-[var(--accent-color)] rounded-lg p-8 bg-[var(--card-bg)] relative cursor-pointer flex items-center justify-center preserve-card image-container"
                onClick={handleUploadClick}
              >
                {previewImage ? (
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="アップロードされた写真"
                    width={640}
                    height={480}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <ImageIcon className="h-16 w-16 md:h-20 md:w-20 text-gray-400" />
                    </div>
                    <p className="text-lg md:text-xl mb-3 text-[var(--text-primary)]">ここに写真をドラッグ＆ドロップ</p>
                    <p className="text-base md:text-lg text-[var(--text-secondary)]">または下のボタンから</p>
                    <p className="text-sm text-gray-500 mt-4">対応形式: JPEG, PNG, SVG, HEIF</p>
                  </div>
                )}
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/jpeg,image/png,image/svg+xml,image/heif"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <button className="standard-button text-white text-lg md:text-xl px-8 py-3" onClick={handleUploadClick}>
                {isMobile ? "写真を選択" : "写真を選択"}
              </button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-100 rounded-lg p-4 mb-10 preserve-card">
              <div className="flex items-start">
                <ShieldCheck className="text-green-600 w-6 h-6 md:w-7 md:h-7 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm md:text-base text-[var(--text-primary)]">
                  <p className="mb-2 font-bold">プライバシー保護について</p>
                  <p>
                    アップロードされた写真は安全なクラウドストレージに保存され、リフォームイメージの作成にのみ使用されます。個人情報保護のため、写真は暗号化され、第三者に共有されることはありません。
                  </p>
                </div>
              </div>
            </div>

            {/* 戻るボタンの修正 */}
            <div className="flex justify-between mt-auto">
              <Link href="/">
                <div className="nav-button-back">
                  <span className="button-text">←戻る</span>
                </div>
              </Link>
              <Link href="/2-category" onClick={handleNextClick} className={!previewImage ? "pointer-events-none" : ""}>
                <div className={`nav-button ${!previewImage ? "button-disabled" : ""}`}>
                  <span className="button-text">次へ進む→</span>
                </div>
              </Link>
            </div>

            {!previewImage && (
              <div className="error-message mt-2" id="error-message">
                写真をアップロードしてから次へ進んでください
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 確認ポップアップ */}
      {showConfirmPopup && (
        <div className="confirm-popup">
          <div className="confirm-popup-content">
            <p className="text-center font-bold text-lg mb-2">確認</p>
            <p className="text-center">選択した画像は削除されますがよろしいですか？</p>
            <div className="confirm-popup-buttons">
              <button className="confirm-button confirm-yes" onClick={handleConfirmYes}>
                はい
              </button>
              <button className="confirm-button confirm-no" onClick={handleConfirmNo}>
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

