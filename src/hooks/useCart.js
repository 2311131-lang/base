import { useState, useEffect } from "react";

const CART_KEY = "cart_items";

function getCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function useCart() {
  const [items, setItems] = useState(getCartFromStorage);

  useEffect(() => {
    const handler = () => setItems(getCartFromStorage());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const count = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  return { items, count };
}
