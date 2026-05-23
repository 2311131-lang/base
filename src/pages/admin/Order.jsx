import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { STATUS_MAP, formatPrice } from "@/lib/productData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Package, Clock, MapPin, Phone, CreditCard, RefreshCw } from "lucide-react";
import moment from "moment";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchOrders = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const data = await base44.entities.Order.list("-created_date");
      setOrders(data);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
    } finally {
      setLoading(false);
      if (showSpinner) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    let unsub;
    try {
      unsub = base44.entities.Order.subscribe((event) => {
        if (event.type === "create") {
          setOrders(prev => [event.data, ...prev]);
        } else if (event.type === "update") {
          setOrders(prev => prev.map(o => o.id === event.id ? event.data : o));
        } else if (event.type === "delete") {
          setOrders(prev => prev.filter(o => o.id !== event.id));
        }
      });
    } catch (err) {
      console.warn("Subscribe không khả dụng, dùng polling:", err);
    }

    const interval = setInterval(() => fetchOrders(), 30000);

    return () => {
      if (unsub) unsub();
      clearInterval(interval);
    };
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    await base44.entities.Order.update(orderId, { status: newStatus });
    toast({ title: "Đã cập nhật trạng thái", description: STATUS_MAP[newStatus]?.label });
  };

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng ({orders.length})</h1>
        <button
          onClick={() => fetchOrders(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4" aria-live="polite">
          {orders.map(o => {
            const s = STATUS_MAP[o.status] || STATUS_MAP.pending;
            const pmLabel = o.payment_method === "COD" ? "COD" : o.payment_method === "bank_transfer" ? `Ngân hàng${o.bank_name ? " - " + o.bank_name : ""}` : "MoMo";
            return (
              <div key={o.id} className="bg-white border rounded-xl p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="font-mono text-sm font-bold">{o.order_code}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      {moment(o.created_date).format("DD/MM/YYYY HH:mm")}
                    </div>
                  </div>
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_MAP).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{o.customer_name}</div>
                      <div className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" />{o.customer_phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{o.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{pmLabel}</span>
                  </div>
                  <div className="text-right font-bold text-primary text-lg">{formatPrice(o.total)}</div>
                </div>

                {o.items?.length > 0 && (
                  <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                    {o.items.map((item, i) => (
                      <span key={i}>{item.name} x{item.quantity}{i < o.items.length - 1 ? ", " : ""}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
