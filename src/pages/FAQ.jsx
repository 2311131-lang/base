import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Máy lọc được bao lâu?", a: "Máy lọc nước Smart-Lowcost có tuổi thọ trung bình 5-7 năm với điều kiện bảo trì định kỳ và thay lõi đúng hạn." },
  { q: "Có lắp đặt tận nhà không?", a: "Có! Chúng tôi hỗ trợ lắp đặt miễn phí tại nhà cho khách hàng trong phạm vi thành phố. Các khu vực khác có phí lắp đặt hợp lý." },
  { q: "Có hỗ trợ trả góp không?", a: "Hiện tại chúng tôi chưa hỗ trợ trả góp. Tuy nhiên, với mức giá 4.500.000₫, sản phẩm đã được tối ưu để phù hợp với mọi gia đình." },
  { q: "Có bảo hành không?", a: "Có! Sản phẩm được bảo hành 24 tháng. Trong thời gian bảo hành, mọi lỗi do nhà sản xuất sẽ được sửa chữa miễn phí." },
  { q: "IoT hoạt động như thế nào?", a: "Hệ thống IoT sử dụng ESP32 kết nối WiFi, đo TDS, pH, độ đục real-time và hiển thị trên app điện thoại. Bạn có thể theo dõi chất lượng nước mọi lúc mọi nơi." },
  { q: "Máy có phù hợp cho nước giếng không?", a: "Có! Hệ thống lọc 7 tầng có khả năng xử lý nước giếng, loại bỏ kim loại nặng Fe, Mn, As, Pb hiệu quả." },
  { q: "Tiêu thụ điện bao nhiêu?", a: "Máy tiêu thụ khoảng 30W, rất tiết kiệm điện. Chi phí điện chỉ khoảng 10.000₫/tháng." },
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Câu hỏi thường gặp</h1>
      <p className="text-muted-foreground mb-8">Tìm câu trả lời cho những thắc mắc phổ biến về sản phẩm.</p>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`} className="bg-white border rounded-xl px-4">
            <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}