import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ALL_GAMES } from '../data/games';

interface GameHistoryViewProps {
  onBack: () => void;
  history?: any;
  setHistory?: any;
  isEditing?: boolean;
}

const GENRE_MAP: Record<string, string[]> = {
  'RPG': ['RPG'],
  '어드벤처': ['어드벤처', '노벨', '공포', '로그라이크', '메트로배니아', '비주얼 노벨'],
  '퍼즐': ['퍼즐', '퀴즈', '캐주얼'],
  '액션': ['액션', '난투', '대전', '배틀로얄', '격투', '런앤건', '플랫폼', '런게임', '생존'],
  '전략': ['전략', 'AOS', 'RTS', 'CCG', 'TCG', '디펜스'],
  '시뮬레이션': ['시뮬레이션', '스포츠', '레이싱', '경영', 'AR', '수면', '보드게임', '소셜'],
  '슈팅': ['슈팅', 'FPS', 'TPS', '히어로슈터'],
  '리듬': ['리듬']
};

const CHART_DATA = [
  { label: 'RPG', score: 99, angle: 0 },
  { label: '어드벤처', score: 92, angle: 45 },
  { label: '퍼즐', score: 88, angle: 90 },
  { label: '액션', score: 85, angle: 135 },
  { label: '전략', score: 82, angle: 180 },
  { label: '시뮬레이션', score: 87, angle: 225 },
  { label: '슈팅', score: 45, angle: 270 },
  { label: '리듬', score: 98, angle: 315 },
];

export const GameHistoryView = ({ onBack }: GameHistoryViewProps) => {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [displayLimit, setDisplayLimit] = useState(ALL_GAMES.length);

  // UX 연출 페이즈: splash(도입부) -> scrolling(쾌속 스크롤) -> done(차트 등장)
  const [introPhase, setIntroPhase] = useState<'splash' | 'scrolling' | 'done'>('splash');

  // ── 30년 경력 디자이너/개발자를 위한 시네마틱 스크롤 연출 ──
  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;

    // 1. 강렬한 Splash Screen (1.2초)
    const splashTimer = setTimeout(() => {
      if (isCancelled) return;
      setIntroPhase('scrolling');
      
      // 화면 최하단으로 즉시 셋업
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll, behavior: 'instant' });
      
      // 2. 쾌속 상향 스크롤 (초광속으로 아카이브를 훑고 지나가는 느낌)
      const startY = window.scrollY;
      const targetY = 0;
      const duration = 2400; // 2.4초로 약간 단축하여 텐션 증가
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        if (isCancelled) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeInOutQuart (폭발적으로 가속하다가 끝에서 극도로 부드럽게 감속)
        const ease = progress < 0.5 
          ? 8 * progress * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 4) / 2;
        
        window.scrollTo(0, startY + (targetY - startY) * ease);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateScroll);
        } else {
          // 3. 스크롤 완료 후 차트 웅장하게 등장
          setIntroPhase('done');
        }
      };

      animationFrameId = requestAnimationFrame(animateScroll);
    }, 1200);

    return () => {
      isCancelled = true;
      clearTimeout(splashTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const pcConsoleGames = ALL_GAMES.filter(g => g.category === 'Pc' || g.category === 'PC' || g.category === 'Console');
  const mobileGames = ALL_GAMES.filter(g => g.category === 'Mobile');

  const filteredGames = ALL_GAMES.filter(g => {
    let matchesSearch = true;
    if (searchQuery) {
      matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (g.company && g.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.genre && g.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    let matchesGenre = true;
    if (activeGenre) {
      const keywords = GENRE_MAP[activeGenre] || [activeGenre];
      matchesGenre = keywords.some(kw => g.genre?.toLowerCase().includes(kw.toLowerCase()));
    }
    return matchesSearch && matchesGenre;
  });

  const displayedGames = filteredGames.slice(0, displayLimit);

  // Radar logic
  const getPt = (value: number, angleDeg: number, size: number) => {
    const cx = size / 2;
    const cy = size / 2;
    const r = (value / 100) * (size / 2 - 40);
    const param = (angleDeg - 90) * (Math.PI / 180);
    return `${cx + r * Math.cos(param)},${cy + r * Math.sin(param)}`;
  };
  const svgSize = 340;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const polygonPoints = CHART_DATA.map(d => getPt(d.score, d.angle, svgSize)).join(' ');
  const bgPolygons = [20, 40, 60, 80, 100].map(level => CHART_DATA.map(d => getPt(level, d.angle, svgSize)).join(' '));

  return (
    <>
      {/* ── 1. 시네마틱 스플래시 스크린 (진입 시 몰입감 극대화) ── */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0047BB] text-white transition-all duration-700 ease-in-out ${introPhase === 'splash' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="overflow-hidden relative z-10">
          <h1 className={`text-6xl md:text-8xl font-black tracking-tighter transform transition-transform duration-1000 delay-100 ${introPhase === 'splash' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            GAMING DNA
          </h1>
        </div>
        <div className={`mt-8 flex items-center gap-3 opacity-80 transform transition-all duration-1000 delay-300 ${introPhase === 'splash' ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="font-mono text-sm tracking-widest uppercase">Extracting {ALL_GAMES.length}+ Records...</p>
        </div>
      </div>

      <div className="min-h-screen bg-[#FDFCF8] pt-28 pb-32 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* ── 2. 레이더 차트 & 통계 (스크롤이 끝나면 웅장하게 등장) ── */}
          <div className={`flex flex-col justify-center mb-16 transform transition-all duration-1000 ease-out ${introPhase === 'done' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-black/5 rounded-4xl p-8 shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#0047BB]/[0.02] to-transparent pointer-events-none" />
              <h3 className="font-bold text-lg text-zinc-500 tracking-tight self-start mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0047BB]"></span>
                장르별 숙련도 차트
              </h3>
              <div className="relative" style={{ width: svgSize, height: svgSize }}>
                <svg width={svgSize} height={svgSize} className="overflow-visible">
                  {bgPolygons.map((pts, i) => (
                    <polygon key={i} points={pts} fill="none" stroke="#E5E7EB" strokeWidth="1" />
                  ))}
                  {CHART_DATA.map((d, i) => (
                    <line key={i} x1={cx} y1={cy} x2={getPt(100, d.angle, svgSize).split(',')[0]} y2={getPt(100, d.angle, svgSize).split(',')[1]} stroke="#E5E7EB" strokeWidth="1" />
                  ))}
                  {/* 정적 폴리곤 (애니메이션 제거됨) */}
                  <polygon 
                    points={polygonPoints} fill="rgba(0, 71, 187, 0.15)" stroke="#0047BB" strokeWidth="2.5" 
                  />
                  {CHART_DATA.map((d, i) => {
                    const [px, py] = getPt(d.score, d.angle, svgSize).split(',');
                    return <circle key={i} cx={px} cy={py} r="4" fill="#0047BB" />;
                  })}
                  {CHART_DATA.map((d, i) => {
                    const [lx, ly] = getPt(115, d.angle, svgSize).split(',');
                    const isActive = activeGenre === d.label;
                    return (
                      <g key={i} onClick={() => setActiveGenre(isActive ? null : d.label)} className="cursor-pointer group" transform={`translate(${lx}, ${ly})`}>
                        <text x="0" y="0" textAnchor="middle" alignmentBaseline="middle" className={`font-bold transition-all text-[13px] tracking-tight ${isActive ? 'fill-[#0047BB] text-[15px]' : 'fill-zinc-400 group-hover:fill-zinc-700'}`}>{d.label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6 w-full">
                <button onClick={() => setActiveGenre(null)} className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 ${!activeGenre ? 'bg-[#0047BB] text-white shadow-md shadow-[#0047BB]/20 scale-105' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700'}`}>전체</button>
                {Object.keys(GENRE_MAP).map(genre => (
                  <button key={genre} onClick={() => setActiveGenre(genre)} className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 ${activeGenre === genre ? 'bg-[#0047BB] text-white shadow-md shadow-[#0047BB]/20 scale-105' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700'}`}>{genre}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white border border-black/5 rounded-4xl p-8 shadow-sm hover:shadow-md transition-shadow duration-500 flex-1 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-bl from-[#0047BB]/[0.02] to-transparent pointer-events-none" />
                <h3 className="font-bold text-lg text-zinc-500 tracking-tight mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047BB]"></span>
                  플레이 요약 통계
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-center justify-between border-b border-black/5 pb-4"><span className="font-bold text-[#2C2C2C]">총 플레이</span><span className="font-black text-[#0047BB] text-xl">{ALL_GAMES.length}종 이상</span></li>
                  <li className="flex items-center justify-between border-b border-black/5 pb-4"><span className="font-bold text-[#2C2C2C]">주력 플랫폼</span><span className="font-bold text-zinc-600 text-lg">PC / 콘솔</span></li>
                  <li className="flex items-center justify-between border-b border-black/5 pb-4"><span className="font-bold text-[#2C2C2C]">최장 플레이</span><span className="font-bold text-zinc-600 text-lg">메이플스토리 (15년)</span></li>
                  <li className="flex items-center justify-between"><span className="font-bold text-[#2C2C2C]">전문 분야</span><span className="font-bold text-[#0047BB] text-lg bg-[#0047BB]/10 px-3 py-1 rounded-md">RPG / 리듬</span></li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#0047BB] to-[#003388] text-white border border-[#0047BB] rounded-2xl p-6 shadow-md shadow-[#0047BB]/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <span className="block font-bold text-blue-200 mb-2 relative z-10">PC/콘솔</span>
                  <span className="text-3xl font-black relative z-10">{pcConsoleGames.length}종</span>
                </div>
                <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#0047BB]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <span className="block font-bold text-zinc-400 mb-2 relative z-10">모바일</span>
                  <span className="text-3xl font-black text-[#2C2C2C] relative z-10">{mobileGames.length}종</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Grid Section */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
          <h2 className="text-2xl font-black tracking-tight text-[#18181b]">게임 상세 플레이 이력</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedGames.map((game) => (
            <div key={game.id} className="group relative h-[140px] rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
              {game.image && (
                <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              <div className="relative h-full z-10 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-white bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded tracking-widest uppercase transition-transform duration-300 group-hover:scale-105">{game.genre}</span>
                  </div>
                  <h4 className="font-bold text-white text-[15px] leading-tight mb-1 truncate transition-colors duration-300 group-hover:text-blue-200">{game.title}</h4>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-[10px] font-bold text-white/60 truncate group-hover:text-white/90 transition-colors">{game.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};
