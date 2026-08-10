import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react"; // 재생 아이콘 (lucide-react가 없다면 일반 SVG나 이모지로 대체 가능)
import { getArtistSongs } from "../../../api/itunes";

export default function Section_4() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedMusic = async () => {
      try {
        // 1. 💾 로컬 스토리지에서 사용자가 '좋아요' 누른 가수 리스트를 가져옵니다.
        // (예: localStorage.setItem('likedArtists', JSON.stringify(['아이유', '데이식스'])))
        const savedArtists =
          JSON.parse(localStorage.getItem("likedArtists")) || [];

        let targetArtist = "아이유"; // 기본값 (좋아요 데이터가 없을 때 시안대로 아이유 추천)

        // 2. 만약 사용자가 좋아요를 누른 가수가 있다면, 그 중 무작위로 하나를 뽑아 추천 기준점으로 삼습니다.
        if (savedArtists.length > 0) {
          targetArtist =
            savedArtists[Math.floor(Math.random() * savedArtists.length)];
        }

        // 3. 추출된 가수의 음악들을 iTunes API로 검색
        const data = await getArtistSongs(targetArtist);

        if (data.results) {
          // 시안에 맞춰 세로 리스트 형태로 3개만 노출
          const formattedTracks = data.results.slice(1, 4).map((track) => {
            const highResImage = track.artworkUrl100
              ? track.artworkUrl100.replace("100x100bb", "300x300bb")
              : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop";

            return {
              id: track.trackId || track.trackName,
              title: track.trackName,
              artist: track.artistName,
              image: highResImage,
            };
          });
          setTracks(formattedTracks);
        }
      } catch (err) {
        console.error("당신을 위한 추천 로드 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMusic();
  }, []);

  return (
    <section className="w-full max-w-md mx-auto bg-[#0d1527] text-white px-5 py-6 font-sans">
      {/* 타이틀 영역 */}
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-xl font-bold text-white tracking-wide">
          당신을 위한 추천
        </h3>
      </div>

      {/* 로딩 UI */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 bg-slate-800/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        /* 세로 리스트 레이아웃 */
        <div className="flex flex-col gap-3">
          {tracks.map((track) => (
            /* 💡 링크 컴포넌트로 감싸서 클릭 시 이동 및 데이터 전달 */
            <Link
              key={track.id}
              to={`/music/${track.id}`}
              state={{ track }}
              className="flex items-center justify-between bg-transparent hover:bg-slate-800/30 p-2 rounded-xl transition-colors cursor-pointer block group"
            >
              {/* 좌측 이미지 + 중앙 텍스트 묶음 */}
              <div className="flex items-center gap-4">
                {/* 앨범 아트 */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 타이틀 & 아티스트 */}
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-bold text-white line-clamp-1">
                    {track.artist}
                  </span>
                  <span className="text-xs text-slate-400 font-medium tracking-tight mt-0.5 line-clamp-1">
                    {track.title}
                  </span>
                </div>
              </div>

              {/* 우측 재생 버튼 (원형 흰색 버튼 스타일 적용) */}
              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md transform active:scale-90 transition-transform">
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </button>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
