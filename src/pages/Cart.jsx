import useCart from "@/hooks/useCart";
import { formatPrice } from "@/lib/productData";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-slate-700">Giỏ hàng trống</h2>
        <p className="text-muted-foreground">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Button onClick={() => navigate("/")}>Tiếp tục mua sắm</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng ({items.length} sản phẩm)</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white border rounded-xl p-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{item.name}</p>
              <p className="text-primary font-semibold mt-1">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-slate-100">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-slate-100">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => removeItem(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-full">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white border rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tổng cộng</p>
          <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
        </div>
        <Button size="lg" onClick={() => navigate("/checkout")}>Đặt hàng ngay</Button>
      </div>
    </div>
  );
}
