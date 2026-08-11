import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft, X, Play } from "lucide-react";
import { getSearch } from "../../api/itunes"; // 💡 기존에 사용하시던 api 경로

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

  // 검색 실행 함수
  const handleSearch = async (searchWord) => {
    const trimmedWord = searchWord.trim();
    if (!trimmedWord) return;

    setLoading(true);
    try {
      const data = await getSearch(trimmedWord);
      if (data?.results) {
        // 기존 상세페이지 구조와 맞게 데이터 매핑
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
      ].slice(0, 5); // 최대 5개 유지

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
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    const updated = recentSearches.filter((word) => word !== wordToDelete);
    setRecentSearches(updated);
    localStorage.setItem("recentMumeSearches", JSON.stringify(updated));
  };

  // 최근 검색어 전체 삭제
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentMumeSearches");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-5 pt-6 pb-10">
      {/* =========================
          💡 [요청사항] 흰색 검색창
      ========================= */}
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

      {/* =========================
          콘텐츠 영역 (결과화면 vs 기본화면)
      ========================= */}
      {searchResults.length > 0 ? (
        // 1. 검색 결과 리스트 표시
        <section className="mb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">검색 결과</h2>
            <button
              onClick={() => setSearchResults([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              결과 닫기
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {searchResults.map((track) => (
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
        </section>
      ) : (
        // 2. 검색 전 기본 화면 (최근 검색 & 추천 검색)
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
