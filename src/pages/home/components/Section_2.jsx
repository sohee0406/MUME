import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// 💡 라우팅을 위해 Link 컴포넌트를 import 합니다.
import { Link } from "react-router-dom";

import { getArtistSongs } from "../../../api/itunes";

const K_CHART_ARTISTS = [
  "뉴진스",
  "아이유",
  "에스파",
  "데이식스",
  "아이브",
  "르세라핌",
];

export default function Section_2() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKoreanTopTracks = async () => {
      try {
        const promises = K_CHART_ARTISTS.map(async (artist) => {
          try {
            const data = await getArtistSongs(artist);
            if (data.results && data.results.length > 0) {
              const topTrack = data.results[0];

              const highResImage = topTrack.artworkUrl100
                ? topTrack.artworkUrl100.replace("100x100bb", "300x300bb")
                : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop";

              return {
                id: topTrack.trackId,
                title: topTrack.trackName,
                artist: topTrack.artistName,
                image: highResImage,
              };
            }
          } catch (err) {
            console.error(`${artist} 곡 로드 실패:`, err);
          }
          return null;
        });

        const resolvedTracks = await Promise.all(promises);
        const validTracks = resolvedTracks.filter((track) => track !== null);

        setTracks(validTracks);
      } catch (err) {
        console.error("한국 인기 순위 로드 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKoreanTopTracks();
  }, []);

  return (
    <section className="w-full max-w-md mx-auto bg-[#0d1527] text-white px-5 py-6 font-sans">
      {/* 타이틀 영역 */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="text-xl">🎧</span>
        <h3 className="text-xl font-bold text-white tracking-wide">
          오늘의 music
        </h3>
      </div>

      {/* 로딩 UI */}
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-[140px] h-[140px] flex-shrink-0 bg-slate-800/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        /* Swiper 가로 슬라이더 */
        <Swiper
          spaceBetween={14}
          slidesPerView={2.3}
          slidesOffsetAfter={20}
          className="mySwiper !overflow-visible"
        >
          {tracks.map((track) => (
            <SwiperSlide key={track.id} className="w-[140px]">
              {/* 💡 기존 div 박스를 <Link> 컴포넌트로 변경하여 클릭 시 이동하도록 만들었습니다. */}
              <Link
                to={`/music/${track.id}`}
                state={{ track }} // 섹션 3과 동일하게 데이터를 state로 넘겨줍니다.
                className="relative w-[140px] h-[140px] rounded-xl overflow-hidden group cursor-pointer shadow-md bg-slate-900 block"
              >
                {/* 앨범 커버 이미지 */}
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* 마우스 올리면 나타나는 검은색 반투명 오버레이 박스 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* 마우스 올리면 투명도가 변하며 슥 나타나는 텍스트 레이아웃 */}
                <div className="absolute inset-0 flex flex-col justify-center items-center p-3 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <span className="text-xs font-bold tracking-wider line-clamp-1 uppercase">
                    {track.artist}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium tracking-tight mt-1 line-clamp-2">
                    {track.title}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
