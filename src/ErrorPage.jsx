import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function Error() {
  const navigate = useNavigate();

  return (
    <main className="pt-40 min-h-0 bg-[#0F172A] text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[80px] leading-none font-black tracking-tight text-white">
        404
      </p>

      <h1 className="text-xl font-bold mt-5 mb-2">페이지를 찾을 수 없습니다</h1>

      <p className="text-sm text-gray-400 leading-relaxed mb-8">
        요청하신 페이지가 존재하지 않거나
        <br />
        잘못된 주소로 접근하셨습니다.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-full text-sm font-bold active:scale-95 transition-transform"
        >
          <ArrowLeft size={16} />
          이전으로
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#111827] rounded-full text-sm font-bold active:scale-95 transition-transform"
        >
          <Home size={16} />
          홈으로
        </button>
      </div>
    </main>
  );
}
