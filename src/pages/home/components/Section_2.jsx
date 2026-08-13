import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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
    <section className="w-full bg-[#0d1527] text-white px-4 py-7 mb-3 font-sans">
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-xl font-bold text-white tracking-wide">
          오늘의 music
        </h3>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-[130px] h-[130px] flex-shrink-0 bg-slate-800/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <Swiper
          spaceBetween={12}
          slidesPerView={2.2}
          slidesOffsetAfter={16}
          className="mySwiper !overflow-visible"
        >
          {tracks.map((track) => (
            <SwiperSlide key={track.id} className="w-[130px]">
              <Link
                to={`/music/${track.id}`}
                state={{ track }}
                className="relative w-[130px] h-[130px] rounded-xl overflow-hidden cursor-pointer shadow-md bg-slate-900 block"
              >
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
