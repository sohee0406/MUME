import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const EMOTIONS = [
  { id: "happy", label: "Happy", emoji: "😄" },
  { id: "flutter", label: "Flutter", emoji: "🥰" },
  { id: "love", label: "Love", emoji: "💖" },
  { id: "calm", label: "Clam", emoji: "😌" },
  { id: "excited", label: "Excited", emoji: "🤩" },
  { id: "sad", label: "Sad", emoji: "😢" },
];

const SITUATIONS = [
  { id: "cafe", label: "Cafe", emoji: "☕" },
  { id: "drive", label: "Drive", emoji: "🚗" },
  { id: "running", label: "Sports", emoji: "🏃" },
  { id: "sleep", label: "Sleep", emoji: "🌙" },
  { id: "study", label: "Study", emoji: "📚" },
];

export default function RecommendPage() {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedSituation, setSelectedSituation] = useState(null);

  const handleRecommend = () => {
    if (!selectedEmotion || !selectedSituation) {
      alert("감정과 상황을 모두 선택해주세요!");
      return;
    }

    navigate("/recommend/result", {
      state: {
        emotion: selectedEmotion,
        situation: selectedSituation,
      },
    });
  };

  return (
    // 💡 justify-between을 제거하여 컴포넌트들이 위에서부터 차곡차곡 쌓이도록 했습니다.
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#0B132A] text-white px-5 py-8 flex flex-col font-sans">
      {/* 타이틀 및 설명 영역 */}
      <div className="mb-8">
        <h1 className="text-[24px] font-bold tracking-wide text-white mb-2">
          RECOMMEND MUSIC
        </h1>
        <p className="text-[14px] text-slate-300 leading-relaxed">
          현재감정과 상황을 선택하면 어울리는
          <br />
          음악을 추천해드릴게요
        </p>
      </div>

      {/* 1. 감정 섹션 */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">감정</h2>
        <Swiper
          spaceBetween={12}
          slidesPerView={4.2}
          className="mySwiper !overflow-visible"
        >
          {EMOTIONS.map((item) => {
            const isSelected = selectedEmotion?.id === item.id;
            return (
              <SwiperSlide key={item.id} className="flex flex-col items-center">
                <div
                  onClick={() => setSelectedEmotion(item)}
                  className="w-full flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`w-full aspect-square bg-white rounded-[22px] flex items-center justify-center text-3xl shadow-md transition-all duration-200 ${
                      isSelected
                        ? "ring-4 ring-blue-500 scale-105 shadow-blue-500/50"
                        : "active:scale-95"
                    }`}
                  >
                    {item.emoji}
                  </div>
                  <span
                    className={`text-xs mt-2.5 font-medium transition-colors whitespace-nowrap ${
                      isSelected ? "text-blue-400 font-bold" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      {/* 2. 상황 섹션 */}
      {/* 💡 mb-10에서 mb-12로 조절하여 슬라이더와 버튼 사이의 균형감 있는 간격을 확보했습니다. */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-white mb-4">상황</h2>
        <Swiper
          spaceBetween={12}
          slidesPerView={4.2}
          className="mySwiper !overflow-visible"
        >
          {SITUATIONS.map((item) => {
            const isSelected = selectedSituation?.id === item.id;
            return (
              <SwiperSlide key={item.id} className="flex flex-col items-center">
                <div
                  onClick={() => setSelectedSituation(item)}
                  className="w-full flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`w-full aspect-square bg-white rounded-[22px] flex items-center justify-center text-3xl shadow-md transition-all duration-200 ${
                      isSelected
                        ? "ring-4 ring-blue-500 scale-105 shadow-blue-500/50"
                        : "active:scale-95"
                    }`}
                  >
                    {item.emoji}
                  </div>
                  <span
                    className={`text-xs mt-2.5 font-medium transition-colors whitespace-nowrap ${
                      isSelected ? "text-blue-400 font-bold" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      {/* 하단 추천받기 버튼 */}
      {/* 💡 pt-8 대신 w-full만 남겨서 바로 위에 붙도록 수정했습니다. */}
      <div className="w-full">
        <button
          onClick={handleRecommend}
          className={`w-full py-4 text-slate-900 font-bold rounded-full text-base transition-all duration-200 shadow-lg active:scale-95 ${
            selectedEmotion && selectedSituation
              ? "bg-white text-black shadow-white/10"
              : "bg-[#E2E8F0] text-slate-800"
          }`}
        >
          음악 추천받기
        </button>
      </div>
    </div>
  );
}
