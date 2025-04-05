"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Home() {
  const [showFixedButton, setShowFixedButton] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 画面遷移時に最上部にスクロールする
  useEffect(() => {
    window.scrollTo(0, 0)

    const handleScroll = () => {
      // スクロール位置が300px以上になったらボタンを表示
      if (window.scrollY > 300) {
        setShowFixedButton(true)
      } else {
        setShowFixedButton(false)
      }
    }

    // ダークモードの設定を確認
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDarkMode)
    document.documentElement.classList.toggle("dark", prefersDarkMode)

    // モバイルかどうかを確認
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <div className="bg-[var(--app-bg)] min-h-screen top-page">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* メインコンテンツ - 横いっぱいに表示 */}
        <div className="w-full mb-8">
          {/* 上部セクション */}
          <div className="bg-[var(--highlight-bg)] rounded-lg p-6 mb-8 w-full preserve-bg">
            <h1 className="text-2xl md:text-3xl font-black mb-6 text-center text-[var(--text-primary)]">
              本当に <span className="text-red-500">安心できる</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-0 mb-6 max-w-md mx-auto">
              <div className="flex flex-row flex-wrap justify-center">
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">リ</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">フ</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">オ</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">ー</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">ム</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">会</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">社</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">選</div>
                <div className="border border-gray-400 p-1 min-w-[35px] text-center">び</div>
              </div>
              <span className="p-1 flex items-center font-bold text-[var(--text-primary)]">なら</span>
            </div>

            <p className="text-base md:text-lg text-center mb-4 text-[var(--text-primary)] max-w-md mx-auto mobile-wrap">
              <span className="text-red-500 relative inline-block">
                国土交通省登録団体
                <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300"></span>
              </span>
              に所属の信頼できる会社のみを集めた
            </p>

            <div className="flex mb-6 max-w-md mx-auto">
              <div className="bg-blue-600 text-white p-2 rounded-l-md">
                <p className="text-center text-base md:text-lg preserve-white-text">TOPPANが運営する</p>
              </div>
              <div className="bg-[var(--accent-color)] text-white p-2 rounded-r-md flex-grow">
                <p className="text-center font-bold text-lg md:text-xl preserve-white-text">リフォーム会社紹介サイト</p>
              </div>
            </div>
          </div>

          {/* 中央セクション - 画像を両サイドに追加 */}
          <div className="preserve-bg rounded-lg p-6 mb-8 w-full relative">
            <div className="flex flex-col md:flex-row items-center justify-center">
              {/* 左側の画像 */}
              <div className="md:absolute md:left-4 md:top-1/2 md:transform md:-translate-y-1/2 md:w-1/4 w-2/5 mb-4 md:mb-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1169-iqrfIAcepIDIlNHEmIXYV2YNrmmiJ1.png"
                  alt="スマホを操作する男性"
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
              </div>

              {/* 中央のテキスト */}
              <div className="md:w-2/3 w-full">
                <p className="text-center text-base md:text-lg mb-3 text-black max-w-md mx-auto mobile-wrap">
                  ご要望に合わせて厳選した<span className="text-red-500 font-bold">最大4社</span>をご紹介しますので、
                </p>
                <p className="text-center font-bold mb-4 text-lg md:text-xl text-black company-selection-text">
                  『比較検討』してください
                </p>

                <div className="bg-white rounded-lg p-3 mb-3 max-w-md mx-auto">
                  <p className="text-center text-base md:text-lg text-black">1分で簡単入力！相談だけでもOK</p>
                </div>

                <a
                  href="https://entry.refotoru.jp/regist/is?SMPFORM=ndqd-lhsbqd-743be428a3c9d530e62356be81517257&_gl=1*1fn60kc*_gcl_aw*R0NMLjE3NDI5MTY4OTEuQ2owS0NRandxSW1fQmhEbkFSSXNBS0JZY210djBSakRhTlh4ek9adktiVUM2T2FjVkRNYzNJd2ZzRHhfNU8wby1uRnlKNEs1dFhsckFZb2FBbnBrRUFMd193Y0I.*_gcl_au*MTI0MzQ0MzMzOC4xNzM3NzI3NDcy*_ga*MjA1MDY3MzE4LjE3Mzc3Mjc0NzI.*_ga_XLD4Q8640D*MTc0MjkxNjg5MC4xNy4wLjE3NDI5MTY4OTAuMC4wLjA."
                  className="company-intro-link-outline max-w-md mx-auto block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="free-badge">無料</span>
                  <span>優良リフォーム会社のご紹介はこちら</span>
                </a>
              </div>

              {/* 右側の画像 */}
              <div className="md:absolute md:right-4 md:top-1/2 md:transform md:-translate-y-1/2 md:w-1/4 w-2/5">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/948-bmnwBRoBhlxDcjoGspfM71UrKAsCNO.png"
                  alt="アドバイザー"
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Before/After セクション - 新しい画像を使用 */}
          <div className="w-full mb-8 relative">
            <div className="absolute -top-4 left-0 z-10 new-service-badge">
              <div className="bg-red-600 text-white px-4 py-2 rounded-md text-base md:text-lg font-black">
                新サービス
              </div>
            </div>

            {/* 新サービスの説明文 - Before写真の上に追加 */}
            <div className="mt-8 pt-4">
              <Link href="/1-upload">
                <div className="image-link-box">
                  <h2 className="text-center text-xl md:text-2xl font-bold soft-orange-text">
                    まずはイメージを膨らませたい方はこちら
                  </h2>
                </div>
              </Link>
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <div className="relative">
                {/* 高品質なBefore/After画像 */}
                <div className="relative w-full h-auto rounded-lg overflow-hidden">
                  <Image
                    src="/images/before-room.png"
                    alt="Before Room"
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover rounded-lg"
                    priority
                  />
                  <div className="absolute top-4 left-4 text-white text-3xl md:text-4xl font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    Before
                  </div>

                  {/* Afterのタブレット画像 - 位置調整 */}
                  <div className="absolute top-1/3 right-4 w-1/2 md:w-2/5">
                    <div className="relative">
                      <Image
                        src="/images/after-room.png"
                        alt="After Room"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg border-4 border-white shadow-lg"
                      />
                      <div className="absolute top-4 left-4 text-white text-2xl md:text-3xl font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        After
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 新サービスの説明文 */}
            <div className="mt-6 mb-6 bg-[var(--card-bg)] p-6 rounded-lg preserve-card">
              <p className="text-center text-base md:text-lg text-[var(--text-secondary)] mb-6">
                壁・床・ドアなど、好きな素材を選んで、リフォーム後のイメージを簡単に作成できます。
              </p>
              <div className="flex justify-center">
                <Link href="/1-upload">
                  {isMobile ? (
                    <button className="slim-button text-[var(--accent-color)] soft-orange-text">
                      理想のお部屋イメージ画像を作る
                    </button>
                  ) : (
                    <button className="slim-button text-[var(--accent-color)]">理想のお部屋イメージ画像を作る</button>
                  )}
                </Link>
              </div>
            </div>

            {/* イメージ画像を探す セクション */}
            <div className="w-full mb-8 bg-[var(--card-bg)] p-6 rounded-lg preserve-card">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-4">
                  参考画像から選びたい方へ
                </h2>
                <p className="text-base md:text-lg mt-2 text-[var(--text-primary)] mb-6">
                  リフォームしたい箇所やお好きなスタイルを選びその中から、
                  <br className="hidden md:block" />
                  あなたが理想とするお部屋のイメージ画像を見つけてください。
                </p>
              </div>

              {/* スタイル画像グリッド */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Tf3RT6Ws7iBFbXh0iY2ZOGkThlPHx4.png"
                    alt="ナチュラルスタイル"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JzBFp80lCTvIVHCLzLiNwGE2BnansW.png"
                    alt="北欧モダン"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TDilzKobmmu1wCQlExSb8jBdxpi7Sv.png"
                    alt="リビング・ダイニング"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zeHRuNwtOa5Pp4mkJkT7EI8URHujVu.png"
                    alt="キッチン"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <a
                  href="https://refotoru.mapion.co.jp/b/refotoru/?_gl=1*1oo0m81*_gcl_aw*R0NMLjE3NDMzNDMzMTEuQ2owS0NRandxSW1fQmhEbkFSSXNBS0JZY210djBSakRhTlh4ek9adktiVUM2T2FjVkRNYzNJd2ZzRHhfNU8wby1uRnlKNEs1dFhsckFZb2FBbnBrRUFMd193Y0I.*_gcl_au*MTI0MzQ0MzMzOC4xNzM3NzI3NDcy*_ga*MjA1MDY3MzE4LjE3Mzc3Mjc0NzI.*_ga_XLD4Q8640D*MTc0MzM0MzMxMS4yMS4xLjE3NDMzNDM0MTMuMC4wLjA."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-lg md:text-xl"
                >
                  イメージ画像を探す
                </a>
              </div>
            </div>

            {/* 安心リフォームの証 - 中央揃えに修正 */}
            <div className="preserve-bg p-6 rounded-lg mb-6 w-full text-center">
              <div className="flex flex-col items-center mb-3">
                <div className="bg-white p-2 rounded-md mb-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iw0saLyVUBNGPdNFP627DKYdE4NwmQ.png"
                    alt="住宅リフォーム事業者団体 国土交通大臣登録"
                    width={140}
                    height={70}
                    className="h-12 w-auto"
                  />
                </div>
                <p className="font-black text-base md:text-lg text-black">このマークは安心リフォームの証</p>
              </div>
              <p className="text-sm md:text-base mb-2 text-black">
                国土交通省の制度に登録された優良な団体とその団体の構成員であるリフォーム業者だけが使用できる
              </p>
              <p className="text-sm md:text-base text-black">
                この印の会社は<span className="text-red-500 font-bold">安心リフォームのマークです。</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

