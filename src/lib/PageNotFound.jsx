import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-slate-800">404</h1>
      <p className="text-xl text-slate-500">Trang không tìm thấy</p>
      <Link
        to="/"
        className="mt-2 px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
