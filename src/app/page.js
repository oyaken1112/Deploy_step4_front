"use client";
import { useState } from "react";

export default function POSPage() {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false); // 追加：連打防止フラグ

  const fetchProduct = async () => {
    if (!productCode) return;
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/product/${productCode}`);
      if (!response.ok) throw new Error("商品が見つかりません");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const addToCart = () => {
    if (!product) return;
    setCart([...cart, product]);
    setProduct(null);
    setProductCode("");
  };

  const handlePurchase = async () => {
    if (cart.length === 0 || isPurchasing) return; // 連打防止

    setIsPurchasing(true); // 購入開始時にフラグON

    const totalAmount = cart.reduce((sum, item) => sum + item.PRICE, 0);
    const requestBody = {
      EMP_CD: "EMP001",
      STORE_CD: "ST01",
      POS_NO: "PS1",
      TOTAL_AMT: totalAmount,
      details: cart.map((item) => ({
        PRD_ID: item.PRD_ID,
        PRD_CODE: item.CODE,
        PRD_NAME: item.NAME,
        PRD_PRICE: item.PRICE,
      })),
    };

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("購入に失敗しました");
      }

      alert(`購入完了しました。\n合計金額: ${totalAmount}円 (税込)`);
      setCart([]);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsPurchasing(false); // 処理終了後にフラグOFF
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-3/4 flex gap-8">
        {/* 左側エリア */}
        <div className="w-1/2">
          <input
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="バーコードを入力"
            className="w-full p-3 border border-black rounded mb-4 text-lg bg-white text-black"
          />
          <button
            onClick={fetchProduct}
            className="w-full border border-black text-black p-3 rounded bg-blue-100 hover:bg-blue-200 text-lg"
          >
            商品コード 読み込み
          </button>

          <div className="mt-6">
            <p className="text-lg font-bold mb-1 text-black">商品名:</p>
            <div className="w-full p-3 border border-black rounded bg-white text-black text-lg min-w-0 truncate">
              {product?.NAME || ""}
            </div>
            <p className="text-lg font-bold mt-3 mb-1 text-black">価格:</p>
            <div className="w-full p-3 border border-black rounded bg-white text-black text-lg">
              {product ? `${product.PRICE} 円` : "円"}
            </div>
          </div>

          <button
            onClick={addToCart}
            className="w-full mt-6 border border-black text-black p-3 rounded bg-blue-100 hover:bg-blue-200 text-lg"
          >
            追加
          </button>
        </div>

        {/* 右側エリア */}
        <div className="w-1/2">
          <div className="border border-black p-4 rounded-lg mb-4 bg-white text-black">
            <h2 className="text-xl font-bold mb-2 text-center">購入リスト</h2>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">購入リストが空です</p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="text-xs sm:text-sm md:text-base flex justify-between items-center max-w-full bg-white text-black"
                >
                  <span className="truncate">{item.NAME}</span>
                  <span className="mx-2">×1</span>
                  <span>{item.PRICE}円</span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handlePurchase}
            disabled={isPurchasing}  // 連打防止（購入中は無効化）
            className={`w-full border border-black text-black p-3 rounded ${
              isPurchasing ? "bg-gray-300 cursor-not-allowed" : "bg-blue-100 hover:bg-blue-200"
            } text-lg`}
          >
            購入
          </button>
        </div>
      </div>
    </div>
  );
}
