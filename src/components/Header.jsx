import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    /* 헤더 컨테이너: fixed 대신 sticky top-0 w-full 적용 */
    <header
      className={`sticky top-0 z-50 w-full flex items-center justify-between px-5 py-4 transition-transform duration-300 bg-slate-900 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* 왼쪽: 뒤로 가기 */}
      <button
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
        className="flex h-[32px] w-[32px] items-center justify-center text-white transition active:scale-90"
      >
        <ArrowLeft size={22} strokeWidth={2.5} />
      </button>

      {/* 가운데: 로고 */}
      <Link to="/" aria-label="홈으로 이동" className="flex justify-center">
        <span className="text-xl font-bold text-white">MUME</span>
      </Link>

      {/* 오른쪽: 검색 */}
      <Link
        to="/search"
        aria-label="검색"
        className="flex h-[32px] w-[32px] items-center justify-center text-white transition active:scale-90"
      >
        <Search size={19} strokeWidth={2.5} />
      </Link>
    </header>
  );
}

export default Header;
