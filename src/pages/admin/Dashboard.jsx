import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/lib/productData";
import { ShoppingBag, DollarSign, Users, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [o, u] = await Promise.all([
        base44.entities.Order.list("-created_date"),
        base44.entities.User.list("-created_date"),
      ]);
      setOrders(o);
      setUsers(u);
      setLoading(false);
    };
    load();

    const unsub = base44.entities.Order.subscribe((event) => {
      if (event.type === "create") {
        setOrders(prev => [event.data, ...prev]);
      } else if (event.type === "update") {
        setOrders(prev => prev.map(o => o.id === event.id ? event.data : o));
      } else if (event.type === "delete") {
        setOrders(prev => prev.filter(o => o.id !== event.id));
      }
    });
    return unsub;
  }, []);

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0);
  const newOrders = orders.filter(o => o.status === "pending").length;

  // Chart data - last 7 days
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = moment().subtract(6 - i, "days");
    const dayOrders = orders.filter(o => moment(o.created_date).isSame(date, "day"));
    return {
      date: date.format("DD/MM"),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0) / 1000000,
    };
  });

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan hoạt động kinh doanh</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Tổng đơn hàng" value={orders.length} color="bg-blue-500" />
        <StatCard icon={DollarSign} label="Doanh thu" value={formatPrice(totalRevenue)} color="bg-green-500" />
        <StatCard icon={Users} label="Khách hàng" value={users.length} color="bg-purple-500" />
        <StatCard icon={Clock} label="Đơn mới" value={newOrders} color="bg-orange-500" />
      </div>

      <div className="bg-white border rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Doanh thu 7 ngày (triệu ₫)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Đơn hàng gần đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground">
              <th className="pb-2">Mã đơn</th><th className="pb-2">Khách hàng</th><th className="pb-2">Tổng</th><th className="pb-2">Trạng thái</th>
            </tr></thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{o.order_code}</td>
                  <td className="py-3">{o.customer_name}</td>
                  <td className="py-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.status === "pending" ? "bg-yellow-100 text-yellow-800" : o.status === "delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {o.status === "pending" ? "Chờ xác nhận" : o.status === "processing" ? "Đang xử lý" : o.status === "shipping" ? "Đang giao" : o.status === "delivered" ? "Đã giao" : "Đã huỷ"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}