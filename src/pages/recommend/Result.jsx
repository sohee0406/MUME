import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Play, ArrowLeft, RefreshCw } from "lucide-react";
import { getSearch } from "../../api/itunes";
import PageTitle from "../../components/PageTitle";

export default function RecommendResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [allTracks, setAllTracks] = useState([]);
  const [displayTracks, setDisplayTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const emotion = location.state?.emotion || {
    label: "Happy",
    emoji: "😄",
  };

  const situation = location.state?.situation || {
    label: "Drive",
    emoji: "🚗",
  };

  // 랜덤으로 음악 뽑기
  const getRandomTracks = (tracksList, count = 6) => {
    if (!tracksList || tracksList.length === 0) {
      return [];
    }

    const shuffled = [...tracksList].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
  };

  // 다른 노래 추천
  const handleRefreshTracks = () => {
    if (allTracks.length === 0) return;

    setDisplayTracks(getRandomTracks(allTracks, 6));
  };

  useEffect(() => {
    const fetchRecommendedMusic = async () => {
      setLoading(true);

      try {
        /*
         * 감정별 검색어
         * 한국어 검색이 모바일/배포 환경에서
         * 결과가 적을 수 있어서 영어 검색어도 같이 준비합니다.
         */
        const emotionMap = {
          Happy: ["happy pop", "upbeat pop", "feel good"],
          Clam: ["calm music", "chill music", "relaxing"],
          Calm: ["calm music", "chill music", "relaxing"],
          Excited: ["excited pop", "upbeat music", "dance pop"],
          Sad: ["sad songs", "emotional pop", "ballad"],
          Flutter: ["romantic pop", "love songs", "sweet pop"],
          Love: ["love songs", "romantic pop", "love pop"],
        };

        /*
         * 상황별 검색어
         */
        const situationMap = {
          Sleep: ["sleep music", "lofi", "relaxing music"],
          Cafe: ["cafe jazz", "jazz", "coffee shop music"],
          Drive: ["driving music", "road trip", "drive pop"],
          Running: ["running music", "workout music", "fitness music"],
          Sports: ["workout music", "sports music", "fitness"],
          Study: ["study music", "classical", "piano"],
        };

        const emotionKeywords = emotionMap[emotion.label] || ["pop"];

        const situationKeywords = situationMap[situation.label] || ["pop"];

        /*
         * 검색할 키워드들을 여러 개 만들어줍니다.
         *
         * 예:
         * happy pop + driving music
         * happy pop
         * driving music
         * upbeat pop
         * road trip
         */
        const searchQueries = [];

        // 감정 + 상황 조합
        emotionKeywords.forEach((emotionKeyword) => {
          situationKeywords.forEach((situationKeyword) => {
            searchQueries.push(`${emotionKeyword} ${situationKeyword}`);
          });
        });

        // 감정만
        emotionKeywords.forEach((keyword) => {
          searchQueries.push(keyword);
        });

        // 상황만
        situationKeywords.forEach((keyword) => {
          searchQueries.push(keyword);
        });

        // 마지막 기본 검색
        searchQueries.push("popular music");
        searchQueries.push("pop");

        /*
         * 중복 검색어 제거
         */
        const uniqueQueries = [...new Set(searchQueries)];

        let finalResults = [];

        /*
         * 검색 결과가 나올 때까지 차례대로 검색
         */
        for (const query of uniqueQueries) {
          try {
            console.log("iTunes 추천 검색:", query);

            const data = await getSearch(query);

            if (data?.results?.length > 0) {
              const songs = data.results.filter(
                (item) => item.kind === "song" || item.trackId,
              );

              if (songs.length > 0) {
                finalResults = [...finalResults, ...songs];
              }
            }

            /*
             * 충분한 곡을 모았으면 더 이상 검색하지 않음
             */
            if (finalResults.length >= 30) {
              break;
            }
          } catch (error) {
            console.warn(`검색 실패: ${query}`, error);
          }
        }

        /*
         * trackId 기준으로 중복 제거
         */
        const uniqueTracks = [];

        const usedIds = new Set();

        finalResults.forEach((track) => {
          const trackId = track.trackId;

          if (!trackId) return;

          if (usedIds.has(trackId)) return;

          usedIds.add(trackId);

          uniqueTracks.push(track);
        });

        /*
         * 최대 30곡까지만 사용
         */
        const formattedTracks = uniqueTracks.slice(0, 30).map((track) => {
          const highResImage = track.artworkUrl100
            ? track.artworkUrl100.replace("100x100bb", "300x300bb")
            : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop";

          return {
            id: track.trackId,
            title: track.trackName || "알 수 없는 곡",
            artist: track.artistName || "알 수 없는 아티스트",
            image: highResImage,
            previewUrl: track.previewUrl || "",
            genre: track.primaryGenreName || "Pop",
          };
        });

        console.log("최종 추천 음악:", formattedTracks);

        setAllTracks(formattedTracks);

        setDisplayTracks(getRandomTracks(formattedTracks, 6));
      } catch (error) {
        console.error("추천 음악 결과 로드 실패:", error);

        setAllTracks([]);
        setDisplayTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMusic();
  }, [emotion, situation]);

  return (
    <>
      <PageTitle title="RECOMMEND" />

      <div className="w-full max-w-md mx-auto min-h-screen bg-[#0B132A] text-white px-5 py-8 flex flex-col font-sans overflow-x-hidden">
        {/* 뒤로가기 */}
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

        {/* 선택한 테마 */}
        <div className="w-full bg-[#242E42] rounded-2xl p-5 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-1.5 mb-1.5">
            {emotion.emoji} {emotion.label} + {situation.emoji}{" "}
            {situation.label}
          </h2>

          <p className="text-[11px] text-slate-300 font-normal">
            선택한 감정과 상황에 맞는 6개의 엄선된 음악입니다 🎧
          </p>
        </div>

        {/* 로딩 */}
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
          /*
           * 음악이 없는 경우
           */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-4">🎧</p>

            <h3 className="text-base font-bold text-white mb-2">
              추천 음악을 불러오지 못했어요
            </h3>

            <p className="text-sm text-slate-400 mb-6">
              잠시 후 다시 시도해주세요.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-slate-900 rounded-full text-sm font-bold active:scale-95 transition"
            >
              다시 불러오기
            </button>
          </div>
        ) : (
          <>
            {/* 추천 음악 목록 */}
            <div className="flex flex-col gap-4 mb-6">
              {displayTracks.map((track) => (
                <Link
                  key={track.id}
                  to={`/music/${track.id}`}
                  state={{ track }}
                  className="flex items-center justify-between bg-transparent hover:bg-slate-800/20 p-1.5 rounded-xl transition-colors cursor-pointer block group"
                >
                  {/* 왼쪽 */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* 앨범 */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 shadow-md">
                      <img
                        src={track.image}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 제목 */}
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-sm font-bold text-white line-clamp-1">
                        {track.artist}
                      </span>

                      <span className="text-xs text-slate-400 font-medium tracking-tight mt-1 line-clamp-1">
                        {track.title}
                      </span>
                    </div>
                  </div>

                  {/* 재생 버튼 */}
                  <div className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md flex-shrink-0 transform active:scale-90 transition-transform">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                </Link>
              ))}
            </div>

            {/* 다른 노래 추천 */}
            <div className="w-full">
              <button
                onClick={handleRefreshTracks}
                className="w-full py-4 bg-white text-black font-bold rounded-full text-base transition-all duration-200 shadow-lg shadow-white/5 active:scale-95 hover:bg-slate-100 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />이 테마의 다른 노래 추천받기
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
