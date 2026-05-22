export const PRODUCT = {
  id: "smart-lowcost-001",
  name: "MÁY LỌC NƯỚC THÔNG MINH IoT SMART-LOWCOST",
  shortName: "Máy Lọc Nước IoT Smart-Lowcost",
  price: 4500000,
  originalPrice: 6500000,
  sold: 1247,
  stock: 89,
  rating: 4.8,
  reviewCount: 356,
  badge: "Sản phẩm",
  images: [
    "https://media.base44.com/images/public/6a1071561cb625e244b350d6/bfa8a4d77_generated_84daaa26.png",
    "https://media.base44.com/images/public/6a1071561cb625e244b350d6/3fc9e213a_generated_3ad46ebd.png",
    "https://media.base44.com/images/public/6a1071561cb625e244b350d6/2dc6e4ade_generated_b267b228.png",
  ],
  heroImage: "https://media.base44.com/images/public/6a1071561cb625e244b350d6/d62e4ba38_generated_0f295af9.png",
  filterImage: "https://media.base44.com/images/public/6a1071561cb625e244b350d6/3fc9e213a_generated_3ad46ebd.png",
  iotImage: "https://media.base44.com/images/public/6a1071561cb625e244b350d6/2dc6e4ade_generated_b267b228.png",
  description: `Máy Lọc Nước Thông Minh Tích Hợp IoT – Giải Pháp Nước Sạch Smart-Lowcost

Bạn có thực sự an tâm về chất lượng nguồn nước gia đình đang sử dụng mỗi ngày?

Máy lọc nước thông minh của chúng tôi mang đến một giải pháp đột phá, kết hợp giữa hệ thống lọc đa tầng chuyên sâu và công nghệ giám sát IoT.`,
  features: [
    "Hệ thống lọc đa tầng 7 lớp: Sỏi thạch anh, cát thạch anh, than hoạt tính, Aluwat, hạt nâng pH, Mangan, Filox",
    "Loại bỏ kim loại nặng: Fe, Mn, As, Pb",
    "Khử khuẩn UV-C: Tiêu diệt vi khuẩn và vi sinh vật",
    "Giám sát IoT: ESP32 + cảm biến đo TDS, độ đục, pH",
  ],
  specs: {
    "Công nghệ lọc": "7 tầng lọc chuyên sâu",
    "Khử khuẩn": "UV-C",
    "Kết nối": "WiFi (ESP32)",
    "Cảm biến": "TDS, pH, Độ đục",
    "Công suất": "10L/giờ",
    "Kích thước": "35 x 25 x 60 cm",
    "Trọng lượng": "8 kg",
    "Bảo hành": "24 tháng",
    "Nguồn điện": "220V / 50Hz",
  },
  benefits: [
    { title: "Bảo vệ sức khỏe", desc: "Loại bỏ 99.9% vi khuẩn và kim loại nặng" },
    { title: "Tiết kiệm chi phí", desc: "Hoàn vốn cao hơn nước đóng chai" },
    { title: "Giám sát thông minh", desc: "Theo dõi chất lượng nước real-time qua app" },
    { title: "Thiết kế nhỏ gọn", desc: "Phù hợp mọi không gian gia đình" },
  ],
  targets: ["Sinh viên", "Hộ gia đình", "Khu vực nông thôn"],
};

export const CONTACT = {
  address: "01 Phù Đổng Thiên Vương, Phường Lâm Viên – Đà Lạt, Tỉnh Lâm Đồng",
  phone: "0263 3822 246",
  email: "daihocdalat@dlu.edu.vn",
};

export const STATUS_MAP = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã huỷ", color: "bg-red-100 text-red-800" },
};

export const formatPrice = (p) => p.toLocaleString("vi-VN") + "₫";