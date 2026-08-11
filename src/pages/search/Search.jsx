import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft, X, Play } from "lucide-react";
import { getSearch } from "../../api/itunes";

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [displayCount, setDisplayCount] = useState(5); // 현재 화면에 보여줄 개수 (최초 5개)
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  // 추천 검색어 리스트
  const recommendationList = ["NewJeans", "아이유", "Pretender", "Pop", "Jazz"];

  // 컴포넌트 마운트 시 로컬스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("recentMumeSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // 검색 실행 함수 (속도를 위해 처음부터 최대 15개를 한 번에 가져옴)
  const handleSearch = async (searchWord) => {
    const trimmedWord = searchWord.trim();
    if (!trimmedWord) return;

    setLoading(true);
    setDisplayCount(5); // 새로운 검색 시 다시 5개부터 보이도록 초기화
    try {
      // 💡 15개만 딱 고정으로 가져와서 속도를 유지합니다.
      const data = await getSearch(trimmedWord, 15);
      if (data?.results) {
        const formatted = data.results.map((t) => ({
          id: t.trackId,
          title: t.trackName,
          artist: t.artistName,
          image: t.artworkUrl100
            ? t.artworkUrl100.replace("100x100bb", "300x300bb")
            : "",
          previewUrl: t.previewUrl || "",
          genre: t.primaryGenreName || "Pop",
        }));
        setSearchResults(formatted);
      }

      // 최근 검색어 추가 (중복 제거)
      const updatedSearches = [
        trimmedWord,
        ...recentSearches.filter((item) => item !== trimmedWord),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem(
        "recentMumeSearches",
        JSON.stringify(updatedSearches),
      );
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 엔터키 다운 핸들러
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(keyword);
    }
  };

  // 최근 검색어 개별 삭제
  const deleteRecentSearch = (e, wordToDelete) => {
    e.stopPropagation();
    const updated = recentSearches.filter((word) => word !== wordToDelete);
    setRecentSearches(updated);
    localStorage.setItem("recentMumeSearches", JSON.stringify(updated));
  };

  // 최근 검색어 전체 삭제
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentMumeSearches");
  };

  // 💡 더 보기 버튼 클릭 시 5개씩 증가 (최대 15개 제한)
  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 5, 15));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-5 pt-6 pb-20">
      {/* 검색창 */}
      <div className="relative w-full mb-8">
        <input
          type="text"
          placeholder="음악, 아티스트 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full py-3.5 pl-5 pr-12 bg-white text-slate-900 placeholder-slate-400 font-medium rounded-full text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <button
          type="button"
          onClick={() => handleSearch(keyword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
        >
          <SearchIcon size={20} />
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      {searchResults.length > 0 ? (
        <section className="mb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">검색 결과</h2>
            <button
              onClick={() => {
                setSearchResults([]);
                setDisplayCount(5);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              결과 닫기
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {/* 💡 displayCount 만큼만 화면에 렌더링 */}
            {searchResults.slice(0, displayCount).map((track) => (
              <div
                key={track.id}
                onClick={() =>
                  navigate(`/music/${track.id}`, { state: { track } })
                }
                className="flex items-center gap-4 p-3 bg-slate-900/60 rounded-2xl hover:bg-slate-900 transition cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{track.title}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
                <div className="p-2 bg-slate-800 rounded-full text-slate-300">
                  <Play size={12} fill="currentColor" />
                </div>
              </div>
            ))}
          </div>

          {/* 💡 15개가 되지 않았고, 전체 검색 결과 개수보다 적을 때만 더 보기 버튼 노출 */}
          {displayCount < 15 && displayCount < searchResults.length && (
            <button
              onClick={handleLoadMore}
              className="w-full mt-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-2xl text-sm transition shadow-md"
            >
              더 보기 +
            </button>
          )}
        </section>
      ) : (
        <>
          {/* 최근 검색어 */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">최근 검색</h2>
              {recentSearches.length > 0 && (
                <button
                  onClick={clearAllRecentSearches}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  전체 삭제
                </button>
              )}
            </div>

            {recentSearches.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((word, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setKeyword(word);
                      handleSearch(word);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-full text-xs font-medium cursor-pointer transition"
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={(e) => deleteRecentSearch(e, word)}
                      className="p-0.5 hover:bg-slate-700 rounded-full text-slate-500 hover:text-slate-300"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 pl-1">
                최근 검색 기록이 없습니다.
              </p>
            )}
          </section>

          {/* 추천 검색어 */}
          <section>
            <h2 className="text-lg font-bold mb-4">추천 검색</h2>
            <div className="flex flex-wrap gap-2">
              {recommendationList.map((word, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setKeyword(word);
                    handleSearch(word);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-full text-xs font-medium transition"
                >
                  {word}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 로딩 인디케이터 */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-sm z-50">
          <div className="bg-slate-900 px-5 py-3 rounded-xl border border-slate-800">
            검색 중...
          </div>
        </div>
      )}
    </div>
  );
}
