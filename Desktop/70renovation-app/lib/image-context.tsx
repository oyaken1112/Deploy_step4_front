"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// 画像コンテキストの型定義
type ImageContextType = {
  uploadedImage: string | null
  categoryImage: string | null
  setUploadedImage: (url: string | null) => void
  setCategoryImage: (url: string | null) => void
}

// コンテキストの作成
const ImageContext = createContext<ImageContextType | undefined>(undefined)

// コンテキストプロバイダーコンポーネント
export function ImageProvider({ children }: { children: ReactNode }) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [categoryImage, setCategoryImage] = useState<string | null>(null)

  return (
    <ImageContext.Provider
      value={{
        uploadedImage,
        categoryImage,
        setUploadedImage,
        setCategoryImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  )
}

// カスタムフック
export function useImageContext() {
  const context = useContext(ImageContext)
  if (context === undefined) {
    throw new Error("useImageContext must be used within an ImageProvider")
  }
  return context
}

