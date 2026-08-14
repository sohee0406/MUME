import { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../img/Logo_white.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 현재 메인 페이지인지 확인
  const isHome = location.pathname === "/";

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // 뒤로가기 처리
  const handleBack = () => {
    if (location.pathname === "/playlist" && location.state?.playlistDetail) {
      navigate("/playlist", {
        replace: true,
        state: null,
      });

      return;
    }

    // 그 외 페이지는 기존 뒤로가기
    navigate(-1);
  };

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        flex items-center justify-between
        px-5 py-4
        bg-slate-900
        transition-transform duration-300
        ${show ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* ================================= */}
      {/* 왼쪽 영역 */}
      {/* ================================= */}

      {isHome ? (
        /* 메인에서는 로고가 왼쪽으로 이동 */
        <Link
          to="/"
          aria-label="홈으로 이동"
          className="flex items-center w-[30px]"
        >
          <img src={logo} alt="MUME" className="w-full h-auto" />
        </Link>
      ) : (
        /* 메인 외 페이지에서는 뒤로가기 */
        <button
          onClick={handleBack}
          aria-label="뒤로 가기"
          className="
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
            text-white
            transition
            active:scale-90
          "
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
      )}

      {/* ================================= */}
      {/* 가운데 로고 */}
      {/* 메인에서는 표시하지 않음 */}
      {/* ================================= */}

      {!isHome && (
        <Link
          to="/"
          aria-label="홈으로 이동"
          className="flex justify-center w-[30px] h-auto"
        >
          <img src={logo} alt="MUME" className="w-full h-auto" />
        </Link>
      )}

      {/* ================================= */}
      {/* 오른쪽 검색 */}
      {/* ================================= */}

      <Link
        to="/search"
        aria-label="검색"
        className="
          flex
          h-[32px]
          w-[32px]
          items-center
          justify-center
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
