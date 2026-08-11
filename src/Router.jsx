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
      {/* 공통 헤더 */}
      <Header />

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
            <div className="min-h-screen flex items-center justify-center text-white">
              페이지를 찾을 수 없습니다.
            </div>
          }
        />
      </Routes>

      {/* 공통 푸터 */}
      <Footer />
    </HashRouter>
  );
}
