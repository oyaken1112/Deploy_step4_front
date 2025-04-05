"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Edit3, HelpCircle, Paintbrush } from "lucide-react"
import { useImageContext } from "@/lib/image-context"
import { useRouter } from "next/navigation"

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("壁")
  const [lineWidth, setLineWidth] = useState([10]) // デフォルトを一番太く設定
  const [isDrawing, setIsDrawing] = useState(false)
  const [showDemoPopup, setShowDemoPopup] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [hasFilled, setHasFilled] = useState(false)
  const [undoStack, setUndoStack] = useState<ImageData[]>([])
  const [redoStack, setRedoStack] = useState<ImageData[]>([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [activeTool, setActiveTool] = useState<"draw" | "fill" | "zoom">("draw")
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 })
  const [paths, setPaths] = useState<Array<{ points: Array<{ x: number; y: number }>; width: number; color: string }>>(
    [],
  )
  const [currentPath, setCurrentPath] = useState<{
    points: Array<{ x: number; y: number }>
    width: number
    color: string
  } | null>(null)
  const [selectedAreas, setSelectedAreas] = useState<
    Array<{
      path: { points: Array<{ x: number; y: number }>; width: number; color: string }
      filled: boolean
      fillColor: string
      outlineColor: string
    }>
  >([])
  const [penColor, setPenColor] = useState<"warm" | "cool" | "black">("warm")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const { uploadedImage, setCategoryImage } = useImageContext()
  const router = useRouter()
  const demoPopupTimerRef = useRef<NodeJS.Timeout | null>(null)

  // ペンの色に対応するCSS変数
  const penColors = {
    warm: "rgba(255, 119, 51, 0.5)",
    cool: "rgba(51, 119, 255, 0.5)",
    black: "rgba(0, 0, 0, 0.5)",
  }

  // 塗りつぶしの色に対応するCSS変数
  const fillColors = {
    warm: "rgba(255, 119, 51, 0.2)",
    cool: "rgba(51, 119, 255, 0.2)",
    black: "rgba(0, 0, 0, 0.2)",
  }

  useEffect(() => {
    // 画面遷移時に最上部にスクロールする
    window.scrollTo(0, 0)

    // Check if the device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // 実際のアプリでは、ここでカテゴリー選択後の画像を生成/保存します
    // この例では、アップロードされた画像をそのまま使用します
    if (uploadedImage) {
      setCategoryImage(uploadedImage)
    } else {
      // 画像がない場合はアップロードページにリダイレクト
      router.push("/1-upload")
    }

    // 画面遷移時にデモポップアップを表示
    setShowDemoPopup(true)

    // 5秒後に非表示
    demoPopupTimerRef.current = setTimeout(() => {
      setShowDemoPopup(false)
    }, 5000)

    return () => {
      if (demoPopupTimerRef.current) {
        clearTimeout(demoPopupTimerRef.current)
      }
      window.removeEventListener("resize", checkMobile)
    }
  }, [uploadedImage, setCategoryImage, router])

  // キャンバスの初期化
  const initCanvas = () => {
    const canvas = canvasRef.current
    const image = imageRef.current

    if (canvas && image && image.complete) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // キャンバスのサイズを画像に合わせる
        canvas.width = image.width
        canvas.height = image.height

        // 透明なキャンバスを作成
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  // 現在のキャンバス状態を保存
  const saveCanvasState = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setUndoStack([...undoStack, imageData])
    setRedoStack([])
  }

  // 描画開始
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool === "zoom") {
      handleZoomDragStart(e)
      return
    }

    if (activeTool !== "draw") return

    setIsDrawing(true)
    saveCanvasState()

    const canvas = canvasRef.current
    if (!canvas) return

    let x, y
    if ("touches" in e) {
      const rect = canvas.getBoundingClientRect()
      x = (e.touches[0].clientX - rect.left) / zoomLevel - viewPosition.x
      y = (e.touches[0].clientY - rect.top) / zoomLevel - viewPosition.y
    } else {
      x = e.nativeEvent.offsetX / zoomLevel - viewPosition.x
      y = e.nativeEvent.offsetY / zoomLevel - viewPosition.y
    }

    setCurrentPath({
      points: [{ x, y }],
      width: lineWidth[0],
      color: penColors[penColor],
    })
  }

  // 描画中
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool === "zoom" && dragStart) {
      handleZoomDrag(e)
      return
    }

    if (!isDrawing || activeTool !== "draw" || !currentPath) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      const rect = canvas.getBoundingClientRect()
      x = (e.touches[0].clientX - rect.left) / zoomLevel - viewPosition.x
      y = (e.touches[0].clientY - rect.top) / zoomLevel - viewPosition.y
    } else {
      x = e.nativeEvent.offsetX / zoomLevel - viewPosition.x
      y = e.nativeEvent.offsetY / zoomLevel - viewPosition.y
    }

    // 現在のパスに点を追加
    setCurrentPath((prev) => {
      if (!prev) return null
      return {
        ...prev,
        points: [...prev.points, { x, y }],
      }
    })

    // キャンバスに描画
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 既に塗りつぶされた領域を再描画
    redrawFilledAreas(ctx)

    // 既存のパスを描画
    drawAllPaths(ctx)

    // 現在描画中のパスを描画
    if (currentPath) {
      ctx.beginPath()
      ctx.strokeStyle = currentPath.color
      ctx.lineWidth = currentPath.width
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      const points = [...currentPath.points, { x, y }]
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
      }

      ctx.stroke()
    }

    setHasDrawn(true)
  }

  // すべてのパスを描画
  const drawAllPaths = (ctx: CanvasRenderingContext2D) => {
    paths.forEach((path) => {
      if (path.points.length > 0) {
        ctx.beginPath()
        ctx.strokeStyle = path.color
        ctx.lineWidth = path.width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.moveTo(path.points[0].x, path.points[0].y)
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y)
        }

        ctx.stroke()
      }
    })
  }

  // 塗りつぶされた領域を再描画（輪郭線も含む）
  const redrawFilledAreas = (ctx: CanvasRenderingContext2D) => {
    selectedAreas.forEach((area) => {
      if (area.filled && area.path.points.length > 0) {
        // 塗りつぶし
        ctx.beginPath()
        ctx.fillStyle = area.fillColor

        ctx.moveTo(area.path.points[0].x, area.path.points[0].y)
        for (let i = 1; i < area.path.points.length; i++) {
          ctx.lineTo(area.path.points[i].x, area.path.points[i].y)
        }

        ctx.closePath()
        ctx.fill()

        // 輪郭線も描画
        ctx.beginPath()
        ctx.strokeStyle = area.outlineColor
        ctx.lineWidth = area.path.width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.moveTo(area.path.points[0].x, area.path.points[0].y)
        for (let i = 1; i < area.path.points.length; i++) {
          ctx.lineTo(area.path.points[i].x, area.path.points[i].y)
        }

        ctx.closePath()
        ctx.stroke()
      }
    })
  }

  // 描画終了
  const stopDrawing = () => {
    if (activeTool === "zoom") {
      setDragStart(null)
      return
    }

    if (isDrawing && currentPath) {
      setPaths((prev) => [...prev, currentPath])
      setCurrentPath(null)
    }

    setIsDrawing(false)
  }

  // 塗りつぶし機能
  const fillArea = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool !== "fill" || paths.length === 0) return

    saveCanvasState()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 塗りつぶし処理
    const fillColor = fillColors[penColor]

    // パスがある場合は、パスの内側を塗りつぶす
    if (paths.length > 0) {
      // 最後のパスを使用して塗りつぶし
      const lastPath = paths[paths.length - 1]
      if (lastPath.points.length > 0) {
        ctx.beginPath()
        ctx.moveTo(lastPath.points[0].x, lastPath.points[0].y)

        // 最後のパスの残りの点を追加
        for (let i = 1; i < lastPath.points.length; i++) {
          ctx.lineTo(lastPath.points[i].x, lastPath.points[i].y)
        }

        // パスを閉じる
        ctx.closePath()
        ctx.fillStyle = fillColor
        ctx.fill()

        // 輪郭線も描画
        ctx.beginPath()
        ctx.strokeStyle = lastPath.color
        ctx.lineWidth = lastPath.width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.moveTo(lastPath.points[0].x, lastPath.points[0].y)
        for (let i = 1; i < lastPath.points.length; i++) {
          ctx.lineTo(lastPath.points[i].x, lastPath.points[i].y)
        }

        ctx.closePath()
        ctx.stroke()

        // 選択された領域を追加
        setSelectedAreas((prev) => [
          ...prev,
          {
            path: lastPath,
            filled: true,
            fillColor: fillColor,
            outlineColor: lastPath.color,
          },
        ])

        // 使用済みのパスを削除
        setPaths((prev) => prev.filter((_, index) => index !== prev.length - 1))
      }
    }

    setHasDrawn(true)
    setHasFilled(true) // 塗りつぶし済みフラグを設定
  }

  // ズーム機能のドラッグ開始
  const handleZoomDragStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool !== "zoom") return

    let x, y
    if ("touches" in e) {
      x = e.touches[0].clientX
      y = e.touches[0].clientY
    } else {
      x = e.clientX
      y = e.clientY
    }

    setDragStart({ x, y })
  }

  // ズーム機能のドラッグ中
  const handleZoomDrag = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!dragStart) return

    let x, y
    if ("touches" in e) {
      x = e.touches[0].clientX
      y = e.touches[0].clientY
    } else {
      x = e.clientX
      y = e.clientY
    }

    const dx = (x - dragStart.x) / zoomLevel
    const dy = (y - dragStart.y) / zoomLevel

    setViewPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }))

    setDragStart({ x, y })
  }

  // ズーム機能
  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in") {
      setZoomLevel((prev) => Math.min(prev + 0.1, 3))
    } else {
      // 元のサイズ以下にはならないようにする
      setZoomLevel((prev) => Math.max(prev - 0.1, 1))
    }
  }

  // ホイールでのズーム
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (activeTool !== "zoom") return

    e.preventDefault()
    const direction = e.deltaY < 0 ? "in" : "out"
    handleZoom(direction)
  }

  // ツール切り替え
  const switchTool = (tool: "draw" | "fill" | "zoom") => {
    setActiveTool(tool)

    // 塗りつぶしツールに切り替えたときにhasFilled状態をリセット
    if (tool === "fill") {
      setHasFilled(false)
    }
  }

  // 元に戻す
  const undo = () => {
    if (undoStack.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setRedoStack([...redoStack, currentState])

    const previousState = undoStack.pop()
    if (previousState) {
      ctx.putImageData(previousState, 0, 0)
      setUndoStack([...undoStack])
    }

    // 最後に追加された選択領域を削除
    if (selectedAreas.length > 0) {
      setSelectedAreas((prev) => prev.slice(0, -1))
    } else if (paths.length > 0) {
      // パスも一つ戻す
      setPaths((prev) => prev.slice(0, -1))
    }

    if (undoStack.length === 0 && selectedAreas.length === 0) {
      setHasDrawn(false)
      setHasFilled(false)
    }
  }

  // やり直し
  const redo = () => {
    if (redoStack.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setUndoStack([...undoStack, currentState])

    const nextState = redoStack.pop()
    if (nextState) {
      ctx.putImageData(nextState, 0, 0)
      setRedoStack([...redoStack])
      setHasDrawn(true)
    }
  }

  // ヘルプボタンクリック
  const handleHelpClick = () => {
    setShowDemoPopup((prev) => {
      // 現在表示中なら非表示に
      if (prev) {
        return false
      } else {
        // 非表示中なら表示して、5秒後に非表示にするタイマーをセット
        if (demoPopupTimerRef.current) {
          clearTimeout(demoPopupTimerRef.current)
        }
        demoPopupTimerRef.current = setTimeout(() => {
          setShowDemoPopup(false)
        }, 5000)
        return true
      }
    })
  }

  // キャンバスクリック
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool === "fill") {
      fillArea(e)
    }
  }

  const handleNextClick = (e: React.MouseEvent) => {
    if (!hasDrawn) {
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
                <div className="step-circle step-completed">1</div>
                <div className="step-label">
                  部屋写真
                  <br />
                  アップ
                </div>
              </div>
              <div className="step-line line-active"></div>
              <div className="step-item">
                <div className="step-circle step-active">2</div>
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
              カテゴリー・範囲選択
            </h1>

            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="flex-1 flex gap-3">
                  <button
                    className={`category-button flex-1 py-3 px-4 ${selectedCategory === "ドア" ? "category-button-active" : "category-button-inactive"}`}
                    onClick={() => setSelectedCategory("ドア")}
                  >
                    ドア
                  </button>
                  <button
                    className={`category-button flex-1 py-3 px-4 ${selectedCategory === "壁" ? "category-button-active" : "category-button-inactive"}`}
                    onClick={() => setSelectedCategory("壁")}
                  >
                    壁
                  </button>
                  <button
                    className={`category-button flex-1 py-3 px-4 ${selectedCategory === "床" ? "category-button-active" : "category-button-inactive"}`}
                    onClick={() => setSelectedCategory("床")}
                  >
                    床
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-lg p-4 mb-8 relative preserve-card">
              <div className="flex items-center justify-between mb-3">
                <div className="text-base md:text-lg text-[var(--text-primary)]">選択中: {selectedCategory}</div>
                <button className="bg-[var(--accent-color)] text-white rounded-full p-1" onClick={handleHelpClick}>
                  <HelpCircle className="w-6 h-6" />
                </button>
              </div>

              <div
                className="relative mb-4 overflow-hidden image-container"
                ref={canvasContainerRef}
                onWheel={handleWheel}
              >
                {uploadedImage ? (
                  <div
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "top left",
                      position: "relative",
                      left: `${viewPosition.x}px`,
                      top: `${viewPosition.y}px`,
                    }}
                  >
                    <Image
                      ref={imageRef}
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Room Image"
                      width={640}
                      height={480}
                      className="w-full h-full object-cover rounded-lg"
                      onLoad={initCanvas}
                    />
                    <canvas
                      ref={canvasRef}
                      className="drawing-canvas"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      onClick={handleCanvasClick}
                    />
                  </div>
                ) : (
                  <Image
                    src="/placeholder.svg?height=480&width=640&text=アップロードされた写真"
                    alt="Room Image"
                    width={640}
                    height={480}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}

                {/* デモポップアップ */}
                {showDemoPopup && (
                  <div className="demo-popup" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <p className="font-bold mb-2 selection-instruction preserve-white-text">範囲選択の方法</p>
                    <p className="mb-2 selection-instruction preserve-white-text whitespace-nowrap md:whitespace-nowrap">
                      1. 指やマウスで写真をなぞって変更したい範囲を選択
                    </p>
                    <p className="mb-2 selection-instruction preserve-white-text whitespace-nowrap md:whitespace-nowrap">
                      2. 塗りつぶしボタンで囲った内側を塗りつぶせます
                    </p>
                    <p className="mb-2 selection-instruction preserve-white-text whitespace-nowrap md:whitespace-nowrap">
                      3. 選択が完了したら「次へ進む」ボタンをクリック
                    </p>
                    <p className="selection-instruction preserve-white-text whitespace-nowrap md:whitespace-nowrap">
                      ペンの太さ調整や、ひとつ戻る進む等も可能です。
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="pen-size-control">
                  <div className="pen-icon">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <Slider
                    value={lineWidth}
                    onValueChange={setLineWidth}
                    max={10}
                    min={1}
                    step={1}
                    className="pen-slider"
                  />
                  <div className="pen-icon">
                    <Edit3 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-start gap-2 mb-4">
                <div className="text-sm mr-1">ペン色:</div>
                <div
                  className={`pen-color-button pen-color-warm ${penColor === "warm" ? "active" : ""}`}
                  onClick={() => setPenColor("warm")}
                ></div>
                <div
                  className={`pen-color-button pen-color-cool ${penColor === "cool" ? "active" : ""}`}
                  onClick={() => setPenColor("cool")}
                ></div>
                <div
                  className={`pen-color-button pen-color-black ${penColor === "black" ? "active" : ""}`}
                  onClick={() => setPenColor("black")}
                ></div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <button
                    className={`tool-button ${activeTool === "draw" ? "tool-button-active" : ""}`}
                    onClick={() => switchTool("draw")}
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    className={`tool-button ${activeTool === "fill" ? "tool-button-active" : ""} ${paths.length === 0 ? "tool-button-inactive" : ""}`}
                    onClick={() => (paths.length > 0 ? switchTool("fill") : null)}
                  >
                    <Paintbrush className="w-5 h-5" />
                  </button>
                  <button
                    className={`tool-button ${activeTool === "zoom" ? "tool-button-active" : ""}`}
                    onClick={() => switchTool("zoom")}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>

                {activeTool === "zoom" && (
                  <div className="flex gap-2">
                    <button className="tool-button" onClick={() => handleZoom("in")}>
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button
                      className={`tool-button ${zoomLevel <= 1 ? "tool-button-inactive" : ""}`}
                      onClick={() => (zoomLevel > 1 ? handleZoom("out") : null)}
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${undoStack.length > 0 ? "bg-gray-400" : "bg-gray-300"}`}
                  onClick={undo}
                  disabled={undoStack.length === 0}
                >
                  <ArrowLeft className="text-white w-6 h-6" />
                </button>
                <button
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${redoStack.length > 0 ? "bg-gray-400" : "bg-gray-300"}`}
                  onClick={redo}
                  disabled={redoStack.length === 0}
                >
                  <ArrowRight className="text-white w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-auto">
              <Link href="/1-upload">
                <div className="nav-button-back">
                  <span className="button-text">←戻る</span>
                </div>
              </Link>
              <Link
                href={`/3-materials?category=${selectedCategory}`}
                onClick={handleNextClick}
                className={!hasDrawn ? "pointer-events-none" : ""}
              >
                <div className={`nav-button ${!hasDrawn ? "button-disabled" : ""}`}>
                  <span className="button-text">次へ進む→</span>
                </div>
              </Link>
            </div>

            {!hasDrawn && (
              <div className="error-message mt-2" id="error-message">
                範囲を選択してから次へ進んでください
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

