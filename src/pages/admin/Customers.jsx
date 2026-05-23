import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/lib/productData";
import { Users } from "lucide-react";
import moment from "moment";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const buildCustomers = (orders) => {
    const map = {};
    orders.forEach(o => {
      const key = o.customer_email || o.customer_phone;
      if (!key) return;
      if (!map[key]) {
        map[key] = { name: o.customer_name, phone: o.customer_phone, email: o.customer_email, orders: 0, total: 0, date: o.created_date };
      }
      map[key].orders++;
      map[key].total += o.total || 0;
      if (o.created_date < map[key].date) map[key].date = o.created_date;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  };

  useEffect(() => {
    base44.entities.Order.list("-created_date").then(data => {
      setCustomers(buildCustomers(data));
      setLoading(false);
    });

    const unsub = base44.entities.Order.subscribe(() => {
      base44.entities.Order.list("-created_date").then(data => {
        setCustomers(buildCustomers(data));
      });
    });
    return unsub;
  }, []);

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Khách hàng ({customers.length})</h1>
      {customers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Chưa có khách hàng nào.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground">
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Số điện thoại</th>
                <th className="p-3">Số đơn</th>
                <th className="p-3">Tổng chi tiêu</th>
                <th className="p-3">Ngày tạo</th>
              </tr></thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-muted-foreground">{c.phone}</td>
                    <td className="p-3">{c.orders}</td>
                    <td className="p-3 font-medium text-primary">{formatPrice(c.total)}</td>
                    <td className="p-3 text-muted-foreground">{moment(c.date).format("DD/MM/YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}