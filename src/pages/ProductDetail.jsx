import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Zap, Truck, Shield, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { PRODUCT, formatPrice } from "@/lib/productData";
import useCart from "@/hooks/useCart";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    base44.entities.Review.list("-created_date", 20).then(setReviews).catch(() => {});
  }, []);

  const requireAuth = () => {
    if (!user) {
      toast({ title: "Vui lòng đăng nhập", description: "Bạn cần đăng nhập để thực hiện thao tác này." });
      navigate("/login");
      return true;
    }
    return false;
  };

  const handleAddToCart = () => {
    if (requireAuth()) return;
    addItem(PRODUCT, qty);
    toast({ title: "Đã thêm vào giỏ hàng!", description: `${qty} x ${PRODUCT.shortName}` });
  };

  const handleBuyNow = () => {
    if (requireAuth()) return;
    addItem(PRODUCT, qty);
    navigate("/checkout");
  };

  const handleReview = async () => {
    if (requireAuth()) return;
    if (!reviewForm.comment.trim()) return;
    setSubmitting(true);
    await base44.entities.Review.create({
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      user_name: user.full_name || user.email,
    });
    const updated = await base44.entities.Review.list("-created_date", 20);
    setReviews(updated);
    setReviewForm({ rating: 5, comment: "" });
    setSubmitting(false);
    toast({ title: "Cảm ơn đánh giá của bạn!" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
            <img src={PRODUCT.images[selectedImg]} alt={PRODUCT.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
          <div className="flex gap-2">
            {PRODUCT.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImg(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImg ? "border-primary" : "border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded mb-2">{PRODUCT.badge}</span>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{PRODUCT.name}</h1>
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(PRODUCT.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
              ))}
              <span className="ml-1 font-medium">{PRODUCT.rating}</span>
            </div>
            <span className="text-muted-foreground">{PRODUCT.reviewCount} đánh giá</span>
            <span className="text-muted-foreground">{PRODUCT.sold} đã bán</span>
          </div>
          <div className="bg-primary/5 rounded-xl p-4 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(PRODUCT.price)}</span>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(PRODUCT.originalPrice)}</span>
              <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">-30%</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-muted-foreground">Số lượng:</span>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted"><Minus className="w-4 h-4" /></button>
              <span className="px-4 font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-muted"><Plus className="w-4 h-4" /></button>
            </div>
            <span className="text-sm text-muted-foreground">Còn {PRODUCT.stock} sản phẩm</span>
          </div>

          <div className="flex gap-3 mb-6">
            <Button onClick={handleAddToCart} size="lg" variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/5">
              <ShoppingCart className="w-4 h-4 mr-2" /> Thêm vào giỏ
            </Button>
            <Button onClick={handleBuyNow} size="lg" className="flex-1 bg-primary hover:bg-primary/90">
              <Zap className="w-4 h-4 mr-2" /> Mua ngay
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            {[{ icon: Truck, t: "Miễn phí vận chuyển" }, { icon: Shield, t: "Bảo hành 24 tháng" }, { icon: Zap, t: "Giao hàng 2-5 ngày" }].map((item, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg">
                <item.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span>{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="desc" className="mb-12">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="desc">Mô tả</TabsTrigger>
          <TabsTrigger value="specs">Thông số</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="desc" className="mt-6">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line leading-relaxed">{PRODUCT.description}</p>
            <h3 className="font-bold mt-6 mb-3">TÍNH NĂNG NỔI BẬT:</h3>
            <ul className="space-y-2">
              {PRODUCT.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="specs" className="mt-6">
          <div className="max-w-lg">
            {Object.entries(PRODUCT.specs).map(([k, v], i) => (
              <div key={k} className={`flex justify-between py-3 px-4 ${i % 2 === 0 ? "bg-muted/50" : ""} rounded`}>
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          {user && (
            <div className="bg-muted/30 p-4 rounded-xl mb-6">
              <h4 className="font-semibold mb-3">Viết đánh giá</h4>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setReviewForm(p => ({ ...p, rating: s }))}>
                    <Star className={`w-6 h-6 ${s <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
              <textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} className="w-full border rounded-lg p-3 text-sm resize-none h-20 mb-3" placeholder="Nhận xét của bạn..." />
              <Button onClick={handleReview} disabled={submitting} size="sm">{submitting ? "Đang gửi..." : "Gửi đánh giá"}</Button>
            </div>
          )}
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{(r.user_name || "U")[0]}</div>
                  <span className="font-medium text-sm">{r.user_name}</span>
                  <div className="flex gap-0.5 ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-muted-foreground py-8">Chưa có đánh giá nào.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}