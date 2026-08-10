import { Link } from "react-router-dom";

export default function Section_1() {
  return (
    <div className="w-full">
      {/* 메인 배너 섹션 */}
      <main className="px-5">
        <div className="w-full aspect-[1.8/1] rounded-3xl bg-[#2F374A] px-6 py-7 flex flex-col justify-between">
          {/* 메인 타이틀 */}
          <div>
            <h1 className="text-[22px] font-bold text-white whitespace-nowrap tracking-tight">
              오늘 어떤 음악이 필요하세요? 💿
            </h1>
          </div>

          {/* 하단 설명 & 버튼 레이아웃 */}
          <div className="flex items-center justify-between w-full gap-3">
            <p className="text-[12px] text-[#E5F2FF] whitespace-nowrap">
              기분과 상황에 맞는 음악을 찾아 드립니다!
            </p>

            <Link
              to={`/recommend`}
              className="shrink-0 bg-[#2563eb] hover:bg-blue-600 text-white text-[12px] font-medium px-3 py-2 rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              음악 추천받기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
