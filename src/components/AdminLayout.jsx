import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users, Star, Shield, LogOut, Droplets, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Đơn hàng" },
  { to: "/admin/customers", icon: Users, label: "Khách hàng" },
  { to: "/admin/reviews", icon: Star, label: "Đánh giá" },
  { to: "/admin/warranty", icon: Shield, label: "Bảo hành" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Droplets className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
                <l.icon className="w-4 h-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent">
            <ChevronLeft className="w-4 h-4" /> Về trang chủ
          </Link>
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 bg-white border-b flex items-center px-4 lg:hidden">
          <Link to="/" className="mr-3"><ChevronLeft className="w-5 h-5" /></Link>
          <span className="font-bold">Admin</span>
        </header>
        {/* Mobile nav */}
        <div className="lg:hidden flex overflow-x-auto border-b bg-white px-2 gap-1">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
                <l.icon className="w-3.5 h-3.5" /> {l.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}