import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { PRODUCT, formatPrice } from "@/lib/productData";
import useCart from "@/hooks/useCart";
import { CheckCircle, Loader2, CreditCard, Wallet, Banknote } from "lucide-react";

const banks = ["Vietcombank", "MB Bank", "Techcombank", "BIDV", "ACB"];

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [payment, setPayment] = useState("COD");
  const [bankName, setBankName] = useState("");
  const [form, setForm] = useState({
    name: user?.full_name || "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    bankAccount: "",
    bankPassword: "",
    momoPhone: "",
    momoPassword: "",
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.street) {
      toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Giỏ hàng trống", variant: "destructive" });
      return;
    }

    setLoading(true);
    const code = "DH" + Date.now().toString().slice(-8);
    const address = `${form.street}, ${form.ward}, ${form.district}, ${form.city}`;

    await base44.entities.Order.create({
      order_code: code,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: user?.email || "",
      address,
      city: form.city,
      district: form.district,
      ward: form.ward,
      street: form.street,
      payment_method: payment,
      bank_name: payment === "bank_transfer" ? bankName : "",
      quantity: items.reduce((s, i) => s + i.quantity, 0),
      total,
      status: "pending",
      items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
    });

    clearCart();
    setOrderCode(code);
    setLoading(false);
    setSuccess(true);
    toast({ title: "Đặt hàng thành công!", description: `Mã đơn: ${code}` });
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p className="text-muted-foreground mb-2">Nhân viên sẽ xác nhận qua cuộc gọi</p>
        <p className="font-mono text-lg font-bold text-primary mb-6">Mã đơn: {orderCode}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate("/my-orders")}>Xem đơn hàng</Button>
          <Button variant="outline" onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Thông tin người nhận</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Họ và tên *</Label><Input value={form.name} onChange={e => set("name", e.target.value)} required /></div>
              <div><Label>Số điện thoại *</Label><Input value={form.phone} onChange={e => set("phone", e.target.value)} required /></div>
              <div><Label>Tỉnh/Thành phố *</Label><Input value={form.city} onChange={e => set("city", e.target.value)} required /></div>
              <div><Label>Quận/Huyện</Label><Input value={form.district} onChange={e => set("district", e.target.value)} /></div>
              <div><Label>Phường/Xã</Label><Input value={form.ward} onChange={e => set("ward", e.target.value)} /></div>
              <div><Label>Số nhà/Tên đường *</Label><Input value={form.street} onChange={e => set("street", e.target.value)} required /></div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Phương thức thanh toán</h3>
            <RadioGroup value={payment} onValueChange={setPayment} className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${payment === "COD" ? "border-primary bg-primary/5" : ""}`}>
                <RadioGroupItem value="COD" />
                <Banknote className="w-5 h-5 text-green-600" />
                <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${payment === "bank_transfer" ? "border-primary bg-primary/5" : ""}`}>
                <RadioGroupItem value="bank_transfer" />
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Chuyển khoản ngân hàng</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${payment === "momo" ? "border-primary bg-primary/5" : ""}`}>
                <RadioGroupItem value="momo" />
                <Wallet className="w-5 h-5 text-pink-600" />
                <span className="font-medium">Ví MoMo</span>
              </label>
            </RadioGroup>

            {payment === "bank_transfer" && (
              <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Ngân hàng</Label>
                  <Select value={bankName} onValueChange={setBankName}>
                    <SelectTrigger><SelectValue placeholder="Chọn ngân hàng" /></SelectTrigger>
                    <SelectContent>{banks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Số tài khoản</Label><Input value={form.bankAccount} onChange={e => set("bankAccount", e.target.value)} /></div>
                <div><Label>Mật khẩu thanh toán</Label><Input type="password" value={form.bankPassword} onChange={e => set("bankPassword", e.target.value)} /></div>
              </div>
            )}

            {payment === "momo" && (
              <div className="mt-4 space-y-3 p-4 bg-pink-50 rounded-lg">
                <div><Label>Số điện thoại MoMo</Label><Input value={form.momoPhone} onChange={e => set("momoPhone", e.target.value)} /></div>
                <div><Label>Mật khẩu MoMo</Label><Input type="password" value={form.momoPassword} onChange={e => set("momoPassword", e.target.value)} /></div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border rounded-xl p-6 h-fit sticky top-20">
          <h3 className="font-semibold mb-4">Đơn hàng</h3>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b">
              <span className="truncate mr-2">{item.name} x{item.quantity}</span>
              <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm py-2"><span className="text-muted-foreground">Vận chuyển</span><span className="text-green-600">Miễn phí</span></div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg mt-2">
            <span>Tổng</span><span className="text-primary">{formatPrice(total)}</span>
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-4 bg-primary hover:bg-primary/90" size="lg">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang xử lý...</> : "Đặt hàng"}
          </Button>
        </div>
      </form>
    </div>
  );
}