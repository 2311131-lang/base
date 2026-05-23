import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.Review.list("-created_date").then(data => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    await base44.entities.Review.delete(id);
    setReviews(prev => prev.filter(r => r.id !== id));
    toast({ title: "Đã xóa đánh giá" });
  };

  if (loading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đánh giá ({reviews.length})</h1>
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white border rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{r.user_name}</span>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}</div>
                <span className="text-xs text-muted-foreground">{moment(r.created_date).format("DD/MM/YYYY")}</span>
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDelete(r.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-center py-12 text-muted-foreground">Chưa có đánh giá nào.</p>}
      </div>
    </div>
  );
}