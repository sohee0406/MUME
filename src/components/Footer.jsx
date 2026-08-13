import { House, Search, Heart, Headphones, Library } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const menus = [
    { name: "홈", icon: House, path: "/" },
    { name: "검색", icon: Search, path: "/search" },
    { name: "좋아요", icon: Heart, path: "/favorite" },
    { name: "음악", icon: Headphones, path: "/taste" },
    { name: "플레이리스트", icon: Library, path: "/playlist" },
  ];

  return (
    /* absolute bottom-0 left-0 w-full 로 스마트폰 박스 하단에 고정 */
    <footer className="absolute bottom-0 left-0 z-50 w-full">
      <nav className="flex h-16 w-full items-center justify-around bg-slate-900/90 backdrop-blur-md border-t border-slate-800">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = location.pathname === menu.path;

          return (
            <Link
              key={menu.name}
              to={menu.path}
              aria-label={menu.name}
              className={`
                flex
                h-full
                w-[20%]
                items-center
                justify-center
                ${isActive ? "text-white" : "text-slate-400"}
              `}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.8 : 2.2}
                fill={
                  menu.name === "좋아요" && isActive ? "currentColor" : "none"
                }
              />
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

export default Footer;
