import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await base44.auth.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Quên mật khẩu</h1>
        {sent ? (
          <p className="text-green-600">Đã gửi email đặt lại mật khẩu. Kiểm tra hộp thư của bạn.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi email đặt lại"}
            </Button>
          </form>
        )}
        <p className="text-sm text-center">
          <Link to="/login" className="text-blue-600 hover:underline">Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
