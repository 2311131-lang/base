import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Droplets } from "lucide-react";
import { CONTACT } from "@/lib/productData";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Droplets className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-white">Smart-Lowcost</span>
          </div>
          <p className="text-sm leading-relaxed">Giải pháp nước sạch thông minh cho mọi gia đình Việt Nam.</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Liên kết</h4>
          <div className="space-y-2 text-sm">
            <Link to="/" className="block hover:text-primary transition-colors">Trang chủ</Link>
            <Link to="/product" className="block hover:text-primary transition-colors">Sản phẩm</Link>
            <Link to="/faq" className="block hover:text-primary transition-colors">FAQ</Link>
            <Link to="/warranty" className="block hover:text-primary transition-colors">Bảo hành</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span>{CONTACT.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-primary" />
              <span>{CONTACT.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-primary" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors">{CONTACT.email}</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-background/50">
        © 2024 Smart-Lowcost. All rights reserved.
      </div>
    </footer>
  );
}