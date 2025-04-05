import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <div className="w-full bg-[var(--footer-bg)] text-[var(--footer-text)] py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="footer-links mb-2">
          <Link href="https://forest.toppan.com/refotoru/terms/" className="hover:underline">
            利用規約
          </Link>
          <Link href="https://forest.toppan.com/refotoru/privacypolicy/" className="hover:underline">
            プライバシーポリシー
          </Link>
          <Link
            href="https://entry.refotoru.jp/regist/is?SMPFORM=ndqd-lhsbqc-0461960582cf6744b5ecc4ffc9b120e1&_gl=1*1gwjprr*_gcl_aw*R0NMLjE3NDI5OTg4MTguQ2owS0NRandxSW1fQmhEbkFSSXNBS0JZY210djBSakRhTlh4ek9adktiVUM2T2FjVkRNYzNJd2ZzRHhfNU8wby1uRnlKNEs1dFhsckFZb2FBbnBrRUFMd193Y0I.*_gcl_au*MTI0MzQ0MzMzOC4xNzM3NzI3NDcy*_ga*MjA1MDY3MzE4LjE3Mzc3Mjc0NzI.*_ga_XLD4Q8640D*MTc0Mjk5NzI5Ny4xOC4xLjE3NDI5OTg4MTguMC4wLjA."
            className="hover:underline"
          >
            お問い合せ
          </Link>
          <Link href="https://forest.toppan.com/refotoru/company/" className="hover:underline">
            企業情報
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <div className="hidden md:block">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gRaaoCAhk2Op4v1ZN7crDnv15qx4XZ.png"
              alt="リフォトル"
              width={120}
              height={30}
              className="h-8 w-auto"
            />
          </div>
          <div className="text-xs text-right">© 2024 TOPPAN Inc.</div>
        </div>
      </div>
    </div>
  )
}

