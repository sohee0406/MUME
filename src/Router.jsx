import { HashRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Detail from "./pages/detail/Detail";
import Favorite from "./pages/favorite/Favorite";
import Music from "./pages/music/Music";
import MusicPlay from "./pages/music/MusicPlay";
import Playlist from "./pages/playlist/Playlist";
import Recommend from "./pages/recommend/Recommend";
import Result from "./pages/recommend/Result";
import Search from "./pages/search/Search";
import Taste from "./pages/taste/Taste";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PlaylistFix from "./pages/playlist/PlaylistFix";
import PlaylistDetail from "./pages/playlist/PlaylistDetail";

export default function Router() {
  return (
    <HashRouter>
      {/* 1. PC 넓은 화면에서는 배경을 채우고, 콘텐츠를 정중앙(flex justify-center items-center)에 배치 */}
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        {/* 2. 스마트폰 앱 같은 비율의 박스 (모바일에서는 화면 꽉 참, PC에서는 max-w-md와 둥근 모서리 적용) */}
        <div className="w-full max-w-sm h-screen sm:shadow-2xl bg-[#0d1527] text-white relative overflow-hidden flex flex-col">
          {/* 공통 헤더 */}
          <Header />

          {/* 라우트 영역이 남은 공간을 채우도록 flex-1 부여 */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex-col">
            <Routes>
              {/* 홈 */}
              <Route path="/" element={<Home />} />

              {/* 음악 상세 */}
              <Route path="/music/:id" element={<Music />} />

              {/* 음악 재생 */}
              <Route path="/music/play" element={<MusicPlay />} />

              {/* 음악 추천 */}
              <Route path="/recommend" element={<Recommend />} />

              {/* 음악 추천 결과 */}
              <Route path="/recommend/result" element={<Result />} />

              {/* 취향 선택 */}
              <Route path="/taste" element={<Taste />} />

              {/* 플레이리스트 */}
              <Route path="/playlist" element={<Playlist />} />

              {/* 플레이리스트 수정 */}
              <Route path="/playlistFix" element={<PlaylistFix />} />

              {/* 플레이리스트 디테일 */}
              <Route path="/playlistdetail" element={<PlaylistDetail />} />

              {/* 상세 페이지 */}
              <Route path="/detail/:id" element={<Detail />} />

              {/* 즐겨찾기 */}
              <Route path="/favorite" element={<Favorite />} />

              {/* 검색 */}
              <Route path="/search" element={<Search />} />

              {/* 존재하지 않는 주소 */}
              <Route
                path="*"
                element={
                  <div className="min-h-[50vh] flex items-center justify-center text-white">
                    페이지를 찾을 수 없습니다.
                  </div>
                }
              />
            </Routes>
          </div>

          {/* 공통 푸터 */}
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}
