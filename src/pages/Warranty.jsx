import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { Shield, CheckCircle } from "lucide-react";

export default function Warranty() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", order_code: "", description: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.description) {
      toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }
    setLoading(true);
    await base44.entities.WarrantyRequest.create({ ...form, status: "pending" });
    setLoading(false);
    setSent(true);
    toast({ title: "Gửi yêu cầu bảo hành thành công!" });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Bảo hành</h1>

      <div className="bg-white border rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Chính sách bảo hành</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Thời gian:</strong> 24 tháng kể từ ngày mua hàng.</p>
          <p><strong className="text-foreground">Phạm vi:</strong> Bảo hành miễn phí cho các lỗi do nhà sản xuất.</p>
          <p><strong className="text-foreground">Không áp dụng:</strong> Hư hỏng do va đập, sử dụng sai cách, tự ý tháo lắp.</p>
          <p><strong className="text-foreground">Quy trình:</strong> Gửi yêu cầu → Xác nhận → Sửa chữa/Đổi mới (3-7 ngày làm việc).</p>
        </div>
      </div>

      {sent ? (
        <div className="text-center py-12">
          <CheckCircle className="w-14 h-14 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Đã gửi yêu cầu bảo hành!</h3>
          <p className="text-muted-foreground">Chúng tôi sẽ liên hệ bạn trong 24 giờ.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Gửi yêu cầu bảo hành</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Họ và tên *</Label><Input value={form.name} onChange={e => set("name", e.target.value)} required /></div>
              <div><Label>Số điện thoại *</Label><Input value={form.phone} onChange={e => set("phone", e.target.value)} required /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={e => set("email", e.target.value)} /></div>
              <div><Label>Mã đơn hàng</Label><Input value={form.order_code} onChange={e => set("order_code", e.target.value)} /></div>
            </div>
            <div><Label>Mô tả vấn đề *</Label><Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} required /></div>
            <Button type="submit" disabled={loading}>{loading ? "Đang gửi..." : "Gửi yêu cầu"}</Button>
          </form>
        </div>
      )}
    </div>
  );
}