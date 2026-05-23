import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { User, Package, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h1>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{user?.full_name || "Người dùng"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
              {user?.role === "admin" ? "Admin" : "Khách hàng"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Link to="/my-orders" className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:bg-muted/50 transition-colors">
          <Package className="w-5 h-5 text-primary" />
          <span className="font-medium">Đơn hàng của tôi</span>
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:bg-muted/50 transition-colors">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-medium">Trang Admin</span>
          </Link>
        )}
        <button onClick={() => base44.auth.logout("/")} className="w-full flex items-center gap-3 p-4 bg-white border rounded-xl hover:bg-destructive/5 transition-colors text-destructive">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}