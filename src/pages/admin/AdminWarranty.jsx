import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import moment from "moment";

const statusMap = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
};

export default function AdminWarranty() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.WarrantyRequest.list("-created_date").then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.WarrantyRequest.update(id, { status });
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    toast({ title: "Đã cập nhật trạng thái bảo hành" });
  };

  if (loading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý bảo hành ({items.length})</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Shield className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Chưa có yêu cầu bảo hành nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border rounded-xl p-4">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.phone} • {item.email}</div>
                  {item.order_code && <div className="text-xs text-muted-foreground mt-1">Mã đơn: {item.order_code}</div>}
                </div>
                <Select value={item.status} onValueChange={(v) => updateStatus(item.id, v)}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="text-xs text-muted-foreground mt-2">{moment(item.created_date).format("DD/MM/YYYY HH:mm")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}