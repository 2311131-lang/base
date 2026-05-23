import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Package, Droplets, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/AuthContext";

import useCart from "@/hooks/useCart";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/product", label: "Sản phẩm" },
    { to: "/faq", label: "FAQ" },
    { to: "/warranty", label: "Bảo hành" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Droplets className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:block">Smart-Lowcost</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
          ))}
          {isAdmin && <Link to="/admin" className="text-sm font-medium text-primary">Admin</Link>}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 hover:bg-accent rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">{count}</span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm max-w-[100px] truncate">{user.full_name || user.email}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/profile")}>Hồ sơ cá nhân</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-orders")}>
                  <Package className="w-4 h-4 mr-2" /> Đơn hàng của tôi
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>Trang Admin</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")} className="bg-primary hover:bg-primary/90">Đăng nhập</Button>
          )}

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-2">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">{l.label}</Link>
          ))}
          {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-primary">Admin</Link>}
        </div>
      )}
    </header>
  );
}