import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Droplets, Wifi, Leaf, Star, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT, formatPrice } from "@/lib/productData";
import { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/components/ui/use-toast";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

function HeroSection() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!user) {
      toast({ title: "Vui lòng đăng nhập", description: "Bạn cần đăng nhập để mua hàng." });
      navigate("/login");
      return;
    }
    addItem(PRODUCT, 1);
    navigate("/checkout");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">🔥 Giảm 30% - Còn {PRODUCT.stock} sản phẩm</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{PRODUCT.shortName}</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg">Giải pháp nước sạch thông minh tích hợp IoT, bảo vệ sức khỏe gia đình bạn mỗi ngày.</p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{formatPrice(PRODUCT.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(PRODUCT.originalPrice)}</span>
          </div>
          <div className="flex gap-3">
            <Button size="lg" onClick={handleBuyNow} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              Mua ngay <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/product">Xem chi tiết</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <img src={PRODUCT.heroImage} alt="Máy lọc nước IoT" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl" />
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const icons = [Shield, Leaf, Wifi, Zap];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-2xl md:text-3xl font-bold text-center mb-12">Lợi ích vượt trội</motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCT.benefits.map((b, i) => {
            const Icon = icons[i];
            return (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-muted/50 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Công nghệ lọc 7 tầng</h2>
          <div className="space-y-3">
            {["Sỏi thạch anh", "Cát thạch anh", "Than hoạt tính", "Aluwat", "Hạt nâng pH", "Mangan", "Filox"].map((layer, i) =>
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <span className="font-medium">{layer}</span>
              </div>
            )}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <img src={PRODUCT.filterImage} alt="Hệ thống lọc" className="rounded-2xl shadow-xl" />
        </motion.div>
      </div>
    </section>
  );
}

function IoTSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <img src={PRODUCT.iotImage} alt="IoT Dashboard" className="rounded-2xl shadow-xl" />
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Giám sát IoT thông minh</h2>
          <p className="text-muted-foreground mb-6">Theo dõi chất lượng nước real-time qua smartphone với ESP32 và các cảm biến chuyên dụng.</p>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const mockReviews = [
    { id: 1, user_name: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm rất tốt, nước lọc trong veo. Rất hài lòng!" },
    { id: 2, user_name: "Trần Thị B", rating: 5, comment: "Giám sát IoT rất tiện lợi, theo dõi chất lượng nước mọi lúc." },
    { id: 3, user_name: "Lê Văn C", rating: 4, comment: "Thiết kế nhỏ gọn, phù hợp phòng trọ sinh viên." },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Khách hàng nói gì</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {mockReviews.map((r, i) =>
            <motion.div key={r.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) =>
                  <Star key={j} className={`w-4 h-4 ${j < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">"{r.comment}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {r.user_name[0]}
                </div>
                <span className="text-sm font-medium">{r.user_name}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!user) {
      toast({ title: "Vui lòng đăng nhập", description: "Bạn cần đăng nhập để mua hàng." });
      navigate("/login");
      return;
    }
    addItem(PRODUCT, 1);
    navigate("/checkout");
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Bảo vệ sức khỏe gia đình ngay hôm nay</h2>
        <p className="mb-8 opacity-90">Đặt hàng ngay để nhận ưu đãi giảm 30% - Chỉ còn {PRODUCT.stock} sản phẩm!</p>
        <Button size="lg" variant="secondary" className="shadow-lg" onClick={handleBuyNow}>
          Đặt hàng ngay - {formatPrice(PRODUCT.price)} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BenefitsSection />
      <TechSection />
      <IoTSection />
      <ReviewsSection />
      <CTASection />
    </div>
  );
}
