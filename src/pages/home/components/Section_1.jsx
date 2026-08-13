import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Section_1() {
  return (
    <div className="w-full">
      <main className="px-5 py-5 pb-7 mb-3">
        <div className="relative w-full aspect-[1.8/1] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 opacity-90" />

          <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-400 rounded-full blur-3xl opacity-40 pointer-events-none" />

          <div className="relative z-10 w-full h-full px-6 py-7 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold mb-2 shadow-inner">
                <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                MUME 만의 음악 추천 서비스
              </span>
              <h1 className="text-[23px] font-extrabold text-white tracking-tight drop-shadow-sm">
                오늘 어떤 음악이 필요하세요? 💿
              </h1>
            </div>

            <div className="flex items-center justify-between w-full gap-3">
              <p className="text-[12px] text-slate-100 font-medium drop-shadow-sm">
                기분과 상황에 맞는 음악을 추천해줘요!
              </p>

              <Link
                to={`/recommend`}
                className="shrink-0 bg-white text-indigo-600 text-[12px] font-bold px-4 py-2.5 rounded-full transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                음악 추천받기
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
