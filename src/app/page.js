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
      details: cart.map(item => ({
        PRD_ID: item.PRD_ID,
        PRD_CODE: item.CODE,
        PRD_NAME: item.NAME,
        PRD_PRICE: item.PRICE
      }))
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
    <div>
      <h1>POSシステム</h1>
      <input
        type="text"
        value={productCode}
        onChange={(e) => setProductCode(e.target.value)}
        placeholder="商品コードを入力"
      />
      <button onClick={fetchProduct}>商品コード読み込み</button>

      {product && (
        <div>
          <p>商品名: {product.NAME}</p>
          <p>価格: {product.PRICE}円</p>
          <button onClick={addToCart}>追加</button>
        </div>
      )}

      <h2>購入リスト</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.NAME} x 1 - {item.PRICE}円</li>
        ))}
      </ul>
      <button onClick={handlePurchase}>購入</button>
    </div>
  );
}
