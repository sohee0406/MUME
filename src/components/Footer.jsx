import { House, Search, Heart, Headphones, Library } from "lucide-react";

function Footer() {
  const menus = [
    {
      name: "홈",
      icon: House,
    },
    {
      name: "검색",
      icon: Search,
    },
    {
      name: "좋아요",
      icon: Heart,
    },
    {
      name: "음악",
      icon: Headphones,
    },
    {
      name: "플레이리스트",
      icon: Library,
    },
  ];

  return (
    <footer
      className="
        fixed
        bottom-0
        left-1/2
        z-50
        w-full
        max-w-[393px]
        -translate-x-1/2
        border-t
        border-[#E5E5E5]
        bg-white
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <nav className="flex h-[68px] items-center justify-around px-2">
        {menus.map((menu, index) => {
          const Icon = menu.icon;
          const isActive = index === 0;

          return (
            <button
              key={menu.name}
              type="button"
              aria-label={menu.name}
              className="
                flex
                h-full
                w-[20%]
                items-center
                justify-center
                text-black
                transition
                active:scale-90
              "
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.8 : 2.2}
                fill={menu.name === "좋아요" ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </nav>
    </footer>
  );
}

export default Footer;
