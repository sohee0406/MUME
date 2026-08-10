import { Search } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      {/* 로고 → 홈 */}
      <Link to="/" aria-label="홈으로 이동">
        <span className="text-xl font-bold text-white">MUME</span>
      </Link>

      {/* 검색 → 검색 페이지 */}
      <Link
        to="/search"
        aria-label="검색"
        className="
          flex
          h-[32px]
          w-[32px]
          items-center
          justify-center
          rounded-full
          bg-[#454D5F]
          text-white
          transition
          active:scale-90
        "
      >
        <Search size={19} strokeWidth={2.5} />
      </Link>
    </header>
  );
}

export default Header;
