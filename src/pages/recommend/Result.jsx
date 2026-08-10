import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Play, ArrowLeft, RefreshCw } from "lucide-react"; // 💡 새로고침 아이콘 추가
import { getSearch } from "../../api/itunes";

export default function RecommendResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [allTracks, setAllTracks] = useState([]); // 전체 검색 결과 저장
  const [displayTracks, setDisplayTracks] = useState([]); // 화면에 보여줄 6곡 저장
  const [loading, setLoading] = useState(true);

  const emotion = location.state?.emotion || { label: "Happy", emoji: "😄" };
  const situation = location.state?.situation || {
    label: "Drive",
    emoji: "🚗",
  };

  // 💡 검색된 결과 중에서 랜덤하게 6곡을 뽑아내는 함수
  const getRandomTracks = (tracksList, count = 6) => {
    if (tracksList.length === 0) return [];
    // 배열 복사 후 무작위 셔플
    const shuffled = [...tracksList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // 💡 [다른 노래 추천받기] 버튼 클릭 시 작동하는 함수
  const handleRefreshTracks = () => {
    if (allTracks.length === 0) return;
    setDisplayTracks(getRandomTracks(allTracks, 6));
  };

  useEffect(() => {
    const fetchRecommendedMusic = async () => {
      setLoading(true);
      try {
        const emotionMap = {
          Happy: "신나는 팝송",
          Clam: "잔잔한",
          Calm: "잔잔한",
          Excited: "Excited",
          Sad: "슬픈 노래",
          Flutter: "설레는",
          Love: "사랑 노래",
        };
        const situationMap = {
          Sleep: "수면 Lofi",
          Cafe: "카페 재즈",
          Drive: "드라이브",
          Running: "러닝 운동",
          Sports: "러닝 운동",
          Study: "공부 클래식",
        };

        const emotionKeyword = emotionMap[emotion.label] || "";
        const situationKeyword = situationMap[situation.label] || "";

        let finalResults = [];

        // 🔍 [1단계] 조합 검색
        let query = `${emotionKeyword} ${situationKeyword}`.trim();
        let data = await getSearch(query);
        if (data && data.results && data.results.length > 0) {
          finalResults = data.results;
        }

        // 🔍 [2단계 안전장치] 상황 검색
        if (finalResults.length === 0 && situationKeyword) {
          data = await getSearch(situationKeyword);
          if (data && data.results && data.results.length > 0) {
            finalResults = data.results;
          }
        }

        // 🔍 [3단계 안전장치] 감정 검색
        if (finalResults.length === 0 && emotionKeyword) {
          data = await getSearch(emotionKeyword);
          if (data && data.results && data.results.length > 0) {
            finalResults = data.results;
          }
        }

        if (finalResults.length > 0) {
          // 데이터를 넉넉히 받아와서 포맷팅 (셔플 풀을 넓히기 위해 30개 타겟팅)
          const formattedTracks = finalResults.slice(0, 30).map((track) => {
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

          setAllTracks(formattedTracks);
          // 💡 최초 로드 시 랜덤 6곡 추출해서 표시
          setDisplayTracks(getRandomTracks(formattedTracks, 6));
        } else {
          setAllTracks([]);
          setDisplayTracks([]);
        }
      } catch (err) {
        console.error("추천 음악 결과 로드 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMusic();
  }, [emotion, situation]);

  return (
    // 💡 flex flex-col 구조에서 justify-between을 빼서 컴포넌트들이 위로 바짝 붙도록 수정
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#0B132A] text-white px-5 py-8 flex flex-col font-sans">
      {/* 상단 뒤로가기 버튼 영역 */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="transform group-hover:-translate-x-0.5 transition-transform"
          />
          <span>테마 다시 고르기</span>
        </button>
      </div>

      {/* 상단 요약 배너 박스 */}
      <div className="w-full bg-[#242E42] rounded-2xl p-5 mb-6 shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-1.5 mb-1.5">
          {emotion.emoji} {emotion.label} + {situation.emoji} {situation.label}
        </h2>
        <p className="text-[11px] text-slate-300 font-normal">
          선택한 감정과 상황에 맞는 6개의 엄선된 음악입니다 🎧
        </p>
      </div>

      {/* 리스트 출력 영역 */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-16 bg-slate-800/40 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : displayTracks.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          추천해드릴 음악을 찾지 못했습니다. 😢
        </div>
      ) : (
        // 💡 버튼이 바로 밑에 붙을 수 있도록 리스트 하단 마진을 mb-6으로 줄임
        <div className="flex flex-col gap-4 mb-6">
          {displayTracks.map((track) => (
            <Link
              key={track.id}
              to={`/music/${track.id}`}
              state={{ track }}
              className="flex items-center justify-between bg-transparent hover:bg-slate-800/20 p-1.5 rounded-xl transition-colors cursor-pointer block group"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 shadow-md">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-bold text-white line-clamp-1">
                    {track.artist}
                  </span>
                  <span className="text-xs text-slate-400 font-medium tracking-tight mt-1 line-clamp-1">
                    {track.title}
                  </span>
                </div>
              </div>
              <button className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md transform active:scale-90 transition-transform">
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </button>
            </Link>
          ))}
        </div>
      )}

      {/* 💡 [수정] 노래 리스트 바로 밑으로 올라온 '다른 노래 추천받기' 버튼 */}
      {!loading && displayTracks.length > 0 && (
        <div className="w-full">
          <button
            onClick={handleRefreshTracks}
            className="w-full py-4 bg-white text-black font-bold rounded-full text-base transition-all duration-200 shadow-lg shadow-white/5 active:scale-95 hover:bg-slate-100 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />이 테마의 다른 노래 추천받기
          </button>
        </div>
      )}
    </div>
  );
}
