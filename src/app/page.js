"use client";
import { useState } from "react";

export default function POSPage() {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);

  // 商品情報取得
  const fetchProduct = async () => {
    if (!productCode) return;
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/product/${productCode}`);
      if (!response.ok) {
        throw new Error("商品が見つかりません");
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      alert(error.message);
    }
  };

  // カートに追加
  const addToCart = () => {
    if (!product) return;
    setCart([...cart, product]);
    setProduct(null);
    setProductCode("");
  };

  // 購入処理
  const handlePurchase = async () => {
    if (cart.length === 0) return;

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
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-3/4 flex gap-8">
        {/* 左側: 商品コード入力 & 商品情報 */}
        <div className="w-1/2">
          <input
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="バーコードを入力"
            className="w-full p-3 border border-black rounded mb-4 text-lg"
          />
          <button
            onClick={fetchProduct}
            className="w-full border border-black text-black p-3 rounded bg-blue-100 hover:bg-blue-200 text-lg"
          >
            商品コード 読み込み
          </button>

          {/* 商品情報エリア */}
          <div className="mt-6">
            <p className="text-lg font-bold mb-1">商品名:</p>
            <div className="w-full p-3 border border-black rounded text-lg bg-white">{product?.NAME || ""}</div>
            <p className="text-lg font-bold mt-3 mb-1">価格:</p>
            <div className="w-full p-3 border border-black rounded text-lg bg-white">
              {product ? `${product.PRICE} 円` : "円"}
            </div>
          </div>

          {/* 追加ボタン */}
          <button
            onClick={addToCart}
            className="w-full mt-6 border border-black text-black p-3 rounded bg-blue-100 hover:bg-blue-200 text-lg"
          >
            追加
          </button>
        </div>

        {/* 右側: 購入リスト */}
        <div className="w-1/2">
          <div className="border border-black p-4 rounded-lg mb-4 bg-white">
            <h2 className="text-xl font-bold mb-2 text-center">購入リスト</h2>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">購入リストが空です</p>
            ) : (
              cart.map((item, index) => (
                <p key={index} className="text-lg">
                  {item.NAME} x1 {item.PRICE}円
                </p>
              ))
            )}
          </div>

          {/* 購入ボタン */}
          <button
            onClick={handlePurchase}
            className="w-full border border-black text-black p-3 rounded bg-blue-100 hover:bg-blue-200 text-lg"
          >
            購入
          </button>
        </div>
      </div>
    </div>
  );
}
