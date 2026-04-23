import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { ALL_GAMES } from '../data/games';

interface CinematicIntroProps {
  onComplete: () => void;
}

// Same chart constants as GameHistoryView
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
const SVG = 300;
const C = SVG / 2;
const pt = (v: number, a: number) => {
  const r = (v / 100) * (C - 35);
  const rad = (a - 90) * (Math.PI / 180);
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
};
const polyPts = CHART_DATA.map(d => { const p = pt(d.score, d.angle); return `${p.x},${p.y}`; }).join(' ');
const bgLvls = [20, 40, 60, 80, 100].map(lv =>
  CHART_DATA.map(d => { const p = pt(lv, d.angle); return `${p.x},${p.y}`; }).join(' ')
);

const fallbackBg = (genre: string) => {
  const g = genre.toLowerCase();
  if (g.includes('rpg')) return '#1e3a8a';
  if (g.includes('액션') || g.includes('난투')) return '#7f1d1d';
  if (g.includes('전략') || g.includes('aos') || g.includes('rts')) return '#064e3b';
  if (g.includes('슈팅') || g.includes('fps')) return '#1c1917';
  if (g.includes('리듬')) return '#4a044e';
  if (g.includes('퍼즐') || g.includes('캐주얼')) return '#78350f';
  return '#27272a';
};

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const pcCount = ALL_GAMES.filter(g => ['Pc', 'PC', 'Console'].includes(g.category)).length;
  const mobileCount = ALL_GAMES.filter(g => g.category === 'Mobile').length;

  useEffect(() => {
    if (contentRef.current) {
      // 렌더링된 실제 높이 계산
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  const dur = Math.max(3.5, (contentHeight - vh) / 1800);

  // 렌더링할 공통 UI 블록
  const renderContent = () => (
    <div style={{ backgroundColor: '#FDFCF8', padding: '112px 48px 120px', width: '100%', boxSizing: 'border-box' }}>
      {/* 통계 + 레이더차트 — 스크롤 끝 화면 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 64, maxWidth: '1280px', margin: '0 auto 64px auto' }}>
        <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#71717a', marginBottom: 16 }}>장르별 숙련도 차트</div>
          <svg width={SVG} height={SVG} style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
            {bgLvls.map((p, i) => <polygon key={i} points={p} fill="none" stroke="#E5E7EB" strokeWidth="1" />)}
            {CHART_DATA.map((d, i) => { const p = pt(100, d.angle); return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth="1" />; })}
            <polygon points={polyPts} fill="rgba(0,71,187,0.15)" stroke="#0047BB" strokeWidth="2.5" />
            {CHART_DATA.map((d, i) => { const p = pt(d.score, d.angle); return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0047BB" />; })}
            {CHART_DATA.map((d, i) => { const lp = pt(118, d.angle); return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 12, fontWeight: 700, fill: '#a1a1aa', fontFamily: 'inherit' }}>{d.label}</text>; })}
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid rgba(0,0,0,0.05)', flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#18181b', marginBottom: 32 }}>플레이 요약 통계</div>
            {[
              { label: '총 플레이', val: `${ALL_GAMES.length}종 이상`, blue: true },
              { label: '주력 플랫폼', val: 'PC / 콘솔' },
              { label: '최장 플레이', val: '메이플스토리 (15년)' },
              { label: '전문 분야', val: 'RPG / 리듬', chip: true },
            ].map(({ label, val, blue, chip }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '18px 0' }}>
                <span style={{ fontWeight: 700, color: '#2C2C2C' }}>{label}</span>
                {chip
                  ? <span style={{ backgroundColor: 'rgba(0,71,187,0.1)', color: '#0047BB', fontWeight: 700, fontSize: 15, padding: '4px 12px', borderRadius: 8 }}>{val}</span>
                  : <span style={{ fontWeight: blue ? 900 : 700, fontSize: blue ? 20 : 17, color: blue ? '#0047BB' : '#52525b' }}>{val}</span>
                }
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ backgroundColor: '#0047BB', borderRadius: 24, padding: '22px 28px' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>PC/콘솔</div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: 32 }}>{pcCount}종</div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: 24, padding: '22px 28px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#71717a', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>모바일</div>
              <div style={{ fontWeight: 900, fontSize: 32, color: '#2C2C2C' }}>{mobileCount}종</div>
            </div>
          </div>
        </div>
      </div>

      {/* 게임 카드 그리드 — 스크롤 시작 화면 */}
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 24, marginBottom: 32 }}>
          <h2 style={{ fontWeight: 900, fontSize: 24, color: '#18181b' }}>게임 상세 플레이 이력</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {ALL_GAMES.map((game) => (
            <div key={game.id} style={{ height: 140, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: game.image ? '#18181b' : fallbackBg(game.genre) }}>
              {game.image && <img src={game.image} alt="" crossOrigin="anonymous" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }} />
              <div style={{ position: 'relative', height: '100%', zIndex: 1, padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: 'white', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{game.genre}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                    {['Pc', 'PC', 'Console'].includes(game.category) ? 'PC/CONSOLE' : 'MOBILE'}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: 15, lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{game.title}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{game.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] overflow-hidden bg-[#FDFCF8]">
      {/* ── 렌더링된 높이를 재기 위한 보이지 않는 래퍼 ── */}
      {contentHeight === 0 && (
        <div ref={contentRef} style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden', width: '100%' }}>
          {renderContent()}
        </div>
      )}

      {/* ── 스크롤 애니메이션 ── */}
      <AnimatePresence>
        {contentHeight > 0 && (
          <motion.div
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', willChange: 'transform' }}
            initial={{ y: -contentHeight + vh }}
            animate={{ y: 0 }}
            transition={{ duration: dur, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => {
              setTimeout(onComplete, 300);
            }}
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
