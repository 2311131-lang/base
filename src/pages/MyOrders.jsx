import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { STATUS_MAP, formatPrice } from "@/lib/productData";
import { Package, Clock } from "lucide-react";
import moment from "moment";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const data = await base44.entities.Order.filter({ customer_email: user.email }, "-created_date");
      setOrders(data);
      setLoading(false);
    };
    load();

    // Real-time subscription
    const unsub = base44.entities.Order.subscribe((event) => {
      if (event.type === "create" && event.data.customer_email === user.email) {
        setOrders(prev => [event.data, ...prev]);
      } else if (event.type === "update") {
        setOrders(prev => prev.map(o => o.id === event.id ? event.data : o));
      } else if (event.type === "delete") {
        setOrders(prev => prev.filter(o => o.id !== event.id));
      }
    });
    return unsub;
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4" aria-live="polite">
          {orders.map(o => {
            const s = STATUS_MAP[o.status] || STATUS_MAP.pending;
            return (
              <div key={o.id} className="bg-white border rounded-xl p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-sm font-bold">{o.order_code}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {o.items?.map((item, i) => (
                    <div key={i}>{item.name} x{item.quantity}</div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{moment(o.created_date).format("DD/MM/YYYY HH:mm")}</span>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(o.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}