import { HashRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";

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
import ErrorPage from "./ErrorPage";

export default function Router() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="w-full max-w-sm h-screen sm:shadow-2xl bg-[#0d1527] text-white relative overflow-hidden flex flex-col">
          {/* 공통 헤더 */}
          <Header />

          {/* 라우트 영역 */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex-col">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/music/:id" element={<Music />} />

              <Route path="/music/play" element={<MusicPlay />} />

              <Route path="/recommend" element={<Recommend />} />

              <Route path="/recommend/result" element={<Result />} />

              <Route path="/taste" element={<Taste />} />

              <Route path="/playlist" element={<Playlist />} />

              <Route path="/playlistFix" element={<PlaylistFix />} />

              <Route path="/playlist/:id" element={<PlaylistDetail />} />

              <Route path="/favorite" element={<Favorite />} />

              <Route path="/search" element={<Search />} />

              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>

          {/* 공통 푸터 */}
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}
