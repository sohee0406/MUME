import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import PageTitle from "../../components/PageTitle";

const EMOTIONS = [
  { id: "happy", label: "Happy", emoji: "😄" },
  { id: "flutter", label: "Flutter", emoji: "🥰" },
  { id: "love", label: "Love", emoji: "💖" },
  { id: "calm", label: "Calm", emoji: "😌" },
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
    <>
      {/* 브라우저 탭 제목 */}
      <PageTitle title="RECOMMEND" />

      <div className="w-full max-w-md mx-auto min-h-screen bg-[#0B132A] text-white px-5 py-8 flex flex-col font-sans">
        {/* 타이틀 및 설명 */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold tracking-wide text-white mb-2">
            RECOMMEND MUSIC
          </h1>

          <p className="text-[14px] text-slate-300 leading-relaxed">
            현재 감정과 상황을 선택하면 어울리는
            <br />
            음악을 추천해드릴게요
          </p>
        </div>

        {/* 감정 */}
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
                <SwiperSlide
                  key={item.id}
                  className="flex flex-col items-center"
                >
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

        {/* 상황 */}
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
                <SwiperSlide
                  key={item.id}
                  className="flex flex-col items-center"
                >
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

        {/* 추천받기 버튼 */}
        <div className="w-full">
          <button
            onClick={handleRecommend}
            className={`w-full py-4 font-bold rounded-full text-base transition-all duration-200 shadow-lg active:scale-95 ${
              selectedEmotion && selectedSituation
                ? "bg-white text-black shadow-white/10"
                : "bg-[#E2E8F0] text-slate-800"
            }`}
          >
            음악 추천받기
          </button>
        </div>
      </div>
    </>
  );
}
