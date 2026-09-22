import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const GENRE_LIST = [
  { id: "ballad", name: "발라드" },
  { id: "dance", name: "댄스" },
  { id: "hiphop", name: "랩/힙합" },
  { id: "rnb", name: "R&B/Soul" },
  { id: "pop", name: "팝" },
  { id: "rock", name: "록" },
  { id: "indie", name: "인디" },
  { id: "ost", name: "OST" },
];

const TEMP_MUSIC = {
  ballad: [
    {
      id: "ballad-1",
      title: "밤편지",
      artist: "아이유",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
    {
      id: "ballad-2",
      title: "사랑인가 봐",
      artist: "멜로망스",
      image:
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&q=80",
    },
    {
      id: "ballad-3",
      title: "너의 모든 순간",
      artist: "성시경",
      image:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80",
    },
    {
      id: "ballad-4",
      title: "그대라는 시",
      artist: "태연",
      image:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&q=80",
    },
  ],

  dance: [
    {
      id: "dance-1",
      title: "Supernova",
      artist: "aespa",
      image:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=300&q=80",
    },
    {
      id: "dance-2",
      title: "Dynamite",
      artist: "BTS",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    },
    {
      id: "dance-3",
      title: "LOVE DIVE",
      artist: "IVE",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
    },
    {
      id: "dance-4",
      title: "ANTIFRAGILE",
      artist: "LE SSERAFIM",
      image:
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&q=80",
    },
  ],

  hiphop: [
    {
      id: "hiphop-1",
      title: "무제",
      artist: "G-DRAGON",
      image:
        "https://images.unsplash.com/photo-1571266028243-d220c19c2d4c?w=300&q=80",
    },
    {
      id: "hiphop-2",
      title: "LOVE.",
      artist: "Kendrick Lamar",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
    {
      id: "hiphop-3",
      title: "VVS",
      artist: "미란이",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
    },
    {
      id: "hiphop-4",
      title: "Smoke",
      artist: "다이나믹 듀오",
      image:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80",
    },
  ],

  rnb: [
    {
      id: "rnb-1",
      title: "instagram",
      artist: "DEAN",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80",
    },
    {
      id: "rnb-2",
      title: "Best Part",
      artist: "Daniel Caesar",
      image:
        "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&q=80",
    },
    {
      id: "rnb-3",
      title: "Get You",
      artist: "Daniel Caesar",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
    },
    {
      id: "rnb-4",
      title: "Love Again",
      artist: "DPR IAN",
      image:
        "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=300&q=80",
    },
  ],

  pop: [
    {
      id: "pop-1",
      title: "Cruel Summer",
      artist: "Taylor Swift",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
    {
      id: "pop-2",
      title: "Espresso",
      artist: "Sabrina Carpenter",
      image:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80",
    },
    {
      id: "pop-3",
      title: "As It Was",
      artist: "Harry Styles",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
    },
    {
      id: "pop-4",
      title: "Levitating",
      artist: "Dua Lipa",
      image:
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&q=80",
    },
  ],

  rock: [
    {
      id: "rock-1",
      title: "Yellow",
      artist: "Coldplay",
      image:
        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80",
    },
    {
      id: "rock-2",
      title: "Creep",
      artist: "Radiohead",
      image:
        "https://images.unsplash.com/photo-1501612780327-45045538702b?w=300&q=80",
    },
    {
      id: "rock-3",
      title: "Do I Wanna Know?",
      artist: "Arctic Monkeys",
      image:
        "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=300&q=80",
    },
    {
      id: "rock-4",
      title: "Fix You",
      artist: "Coldplay",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    },
  ],

  indie: [
    {
      id: "indie-1",
      title: "Tomboy",
      artist: "HYUKOH",
      image:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80",
    },
    {
      id: "indie-2",
      title: "Wiing Wiing",
      artist: "HYUKOH",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
    },
    {
      id: "indie-3",
      title: "Square",
      artist: "Yerin Baek",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
    {
      id: "indie-4",
      title: "Hug Me",
      artist: "Standing Egg",
      image:
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&q=80",
    },
  ],

  ost: [
    {
      id: "ost-1",
      title: "너에게 닿을게",
      artist: "10CM",
      image:
        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80",
    },
    {
      id: "ost-2",
      title: "With You",
      artist: "Jimin",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    },
    {
      id: "ost-3",
      title: "Everytime",
      artist: "첸, 펀치",
      image:
        "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&q=80",
    },
    {
      id: "ost-4",
      title: "Start Over",
      artist: "가호",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
    },
  ],
};

export default function Section_5() {
  const [activeGenre, setActiveGenre] = useState(GENRE_LIST[0]);

  const tracks = TEMP_MUSIC[activeGenre.id];

  return (
    <section className="px-5 py-7 mb-16">
      <h2 className="text-xl font-bold text-white mb-5">장르별 탐색</h2>

      <div className="w-full mb-5">
        <Swiper
          slidesPerView="auto"
          spaceBetween={8}
          freeMode={true}
          className="w-full"
        >
          {GENRE_LIST.map((genre) => (
            <SwiperSlide key={genre.id} className="!w-auto">
              <button
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeGenre.id === genre.id
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {genre.name}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-col gap-3">
        {tracks.map((track) => (
          <Link
            key={track.id}
            to={`/music/${track.id}`}
            state={{ track }}
            className="flex items-center justify-between bg-transparent p-2 rounded-xl"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 flex items-center justify-center">
                {track.image ? (
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.innerHTML =
                        '<span class="text-[10px] text-slate-500 text-center leading-tight">이미지<br />없음</span>';
                    }}
                  />
                ) : (
                  <span className="text-[10px] text-slate-500 text-center leading-tight">
                    이미지
                    <br />
                    없음
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <span className="text-sm font-bold text-white line-clamp-1">
                  {track.artist}
                </span>

                <span className="text-xs text-slate-400 font-medium tracking-tight mt-0.5 line-clamp-1">
                  {track.title}
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md flex-shrink-0">
              <Play size={14} fill="currentColor" className="ml-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
