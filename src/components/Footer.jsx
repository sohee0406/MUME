import { House, Search, Heart, Headphones, Library } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const menus = [
    {
      name: "홈",
      icon: House,
      path: "/",
    },
    {
      name: "검색",
      icon: Search,
      path: "/search",
    },
    {
      name: "좋아요",
      icon: Heart,
      path: "/favorite",
    },
    {
      name: "음악",
      icon: Headphones,
      path: "/taste",
    },
    {
      name: "플레이리스트",
      icon: Library,
      path: "/playlist",
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full">
      <nav className="flex h-16 w-full items-center justify-around bg-white border-t border-slate-200">
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
                ${isActive ? "text-black" : "text-slate-400"}
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
