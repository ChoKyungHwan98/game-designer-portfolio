/**
 * PdfTemplate.tsx
 * 100% INLINE STYLES — NO TAILWIND CLASSES
 * This is critical: html2canvas (used by html2pdf.js) crashes on Tailwind 4's
 * oklch() / color-mix(in oklab) computed values. All colors must be hex or rgba.
 */
import React from 'react';
import type { ResumeData } from '../types';
import { ScrollText, Mail, Phone, GraduationCap, Award, Briefcase, Wrench, Figma, User, Calendar, MapPin, Shield } from 'lucide-react';
import { BRAND_ICONS } from './icons/BrandIcons';

/* ─── design tokens ─────────────────────────────────────────────── */
const BLUE        = '#0047BB';
const DARK        = '#1A1A1A';
const BODY        = '#333F48';
const MUTED       = '#71717A';
const FAINT       = '#A1A1AA';
const LIGHTER     = '#D4D4D8';
const BG          = '#f8f9fa';
const WHITE       = '#ffffff';
const CARD_BORDER = 'rgba(0,0,0,0.06)';
const BLUE_FAINT  = 'rgba(0,71,187,0.06)';
const BLUE_BORDER = 'rgba(0,71,187,0.15)';
const PAGE: React.CSSProperties = {
  width: '210mm',
  height: '297mm',
  boxSizing: 'border-box',
  background: BG,
  fontFamily: "'Pretendard', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
  fontSize: '12px',
  color: DARK,
  pageBreakAfter: 'always',
  breakAfter: 'page',
  overflow: 'hidden',
};

/* ─── inline markdown & html renderer ────────────────────────────── */
function inlineRender(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const clean = text.replace(/\n/g, ' ');
  
  // Match **bold**, <strong>bold</strong>, and <span...>text</span>
  const rx = /(\*\*(.*?)\*\*|<strong>(.*?)<\/strong>|<span[^>]*>(.*?)<\/span>)/g;
  
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = rx.exec(clean))) {
    if (m.index > last) nodes.push(clean.slice(last, m.index));
    
    if (m[2] || m[3]) {
      // Bold (Recursively render to catch nested spans!)
      nodes.push(<strong key={k++} style={{ color: BLUE, fontWeight: 800 }}>{inlineRender(m[2] || m[3])}</strong>);
    } else if (m[4]) {
      // Span (e.g., -, 0, +)
      const content = m[4];
      const isPlus = content === '+';
      nodes.push(
        <span key={k++} style={{ 
          fontSize: '16px', 
          fontWeight: 900, 
          color: isPlus ? BLUE : '#999',
          margin: '0 2px'
        }}>
          {content}
        </span>
      );
    }
    
    last = m.index + m[0].length;
  }
  if (last < clean.length) nodes.push(clean.slice(last));
  return nodes.length === 1 && typeof nodes[0] === 'string' ? nodes[0] : nodes;
}

/* ─── paragraphs renderer ────────────────────────────────────────── */
function renderParagraphs(text: string): React.ReactNode {
  if (!text) return null;
  return text.split('\n\n').map((p, i) => (
    <p key={i} style={{ margin: '0 0 12px', lineHeight: 1.85, fontSize: '13px', color: BODY, wordBreak: 'keep-all' }}>
      {inlineRender(p)}
    </p>
  ));
}

/* ─── pullQuote renderer ─────────────────────────────────────────── */
function renderPullQuote(text?: string): React.ReactNode {
  if (!text) return null;
  return (
    <div style={{ borderLeft: `3px solid ${BLUE_BORDER}`, background: '#F8F9FF', padding: '16px 24px', margin: '24px 0', borderRadius: '0 12px 12px 0' }}>
      <span style={{ fontWeight: 700, fontSize: '14px', color: BODY }}>{text}</span>
    </div>
  );
}

/* ─── highlights renderer (Horizontal for single column) ──────────── */
function renderHighlightsHorizontal(items?: { bold: string; em: string }[]): React.ReactNode {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '24px 0' }}>
      {items.map((item, j) => (
        <div key={j} style={{ background: '#F8F9FF', border: `1px solid ${BLUE_BORDER}`, borderRadius: '12px', padding: '16px 14px' }}>
          <div style={{ fontWeight: 800, fontSize: '12px', color: BLUE, marginBottom: '6px' }}>{item.bold}</div>
          <div style={{ fontSize: '11px', color: MUTED, lineHeight: 1.5, wordBreak: 'keep-all' }}>{item.em}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── logline renderer (Refined) ─────────────────────────────────── */
function renderLogline(logline: string): React.ReactNode {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
       {logline.trim().split(/\s*\n\s*/).map((line, i) => {
          const isBold = line.startsWith('**') && line.endsWith('**');
          return (
            <div key={i} style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.25, color: isBold ? BLUE : DARK, letterSpacing: '-0.8px', wordBreak: 'keep-all' }}>
              {isBold ? line.slice(2, -2) : line}
            </div>
          );
       })}
    </div>
  );
}

const ToolBadge: React.FC<{ name: string }> = ({ name }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: '#52525B' }}>
    {BRAND_ICONS[name] && (
      <div style={{ width: '12px', height: '12px', flexShrink: 0 }}>
        {BRAND_ICONS[name]}
      </div>
    )}
    {name}
  </span>
);

const renderToolIcon = (name: string) => {
  if (BRAND_ICONS[name]) {
    return (
      <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {BRAND_ICONS[name]}
      </div>
    );
  }
  return <span style={{ fontSize: '10px', fontWeight: 700 }}>{name.charAt(0)}</span>;
};

/* ─── PAGE 1: RESUME ─────────────────────────────────────────────── */
const ResumePage: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="pdf-page bg-white mx-auto flex flex-col font-sans" style={{ width: '210mm', height: '297mm', overflow: 'hidden' }}>

    {/* 1. EDITORIAL HEADER SECTION */}
    <header className="flex items-start gap-4 px-6 py-4 bg-[#FAFAFA] border-b border-zinc-100">
      {/* Portrait */}
      <div className="relative shrink-0">
        <div className="w-[84px] rounded-sm overflow-hidden border border-black/10 shadow-xl bg-white">
          <img
            src={data.image || "https://picsum.photos/seed/profile/600/800"}
            alt="Profile"
            className="w-full h-auto object-contain block"
          />
        </div>
      </div>

      {/* Identity & Summary */}
      <div className="flex-1 flex flex-col items-start pt-0.5">
        <h1 className="text-[26px] font-bold text-[#1A1A1A] tracking-tighter leading-none mb-1.5">
          {data.name}
        </h1>
        <p className="text-[#0047BB] font-black font-mono tracking-[0.4em] text-[9px] uppercase mb-2 pb-1 border-b-2 border-[#0047BB]">
          {data.role}
        </p>

        <div className="max-w-2xl text-[10.5px] text-[#2C2C2C] leading-relaxed font-medium [&_strong]:text-[#0047BB] [&_strong]:font-bold break-keep italic opacity-90 mb-2">
          {inlineRender(data.summary || '')}
        </div>

        {/* Contact Quick List */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-[#0047BB]/70" strokeWidth={2} />
            <span className="lowercase">{data.email}</span>
          </div>
          {data.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#0047BB]/70" strokeWidth={2} />
              <span>{data.phone}</span>
            </div>
          )}
          {data.birthDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#0047BB]/70" strokeWidth={2} />
              <span>{data.birthDate}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#0047BB]/70" strokeWidth={2} />
              <span>{data.address}</span>
            </div>
          )}
          {data.military && (
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#0047BB]/70" strokeWidth={2} />
              <span>{data.military.branch} {data.military.rank} {data.military.status}</span>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* 2. MAIN CONTENT GRID */}
    <div className="grid grid-cols-12 gap-0 flex-1 overflow-hidden">
      {/* LEFT COLUMN */}
      <aside className="col-span-4 px-5 py-4 border-r border-zinc-100 bg-[#FCFCFC] flex flex-col gap-4 overflow-hidden">
        {/* Education */}
        <section>
          <h3 className="text-[11px] font-bold mb-2 flex items-center gap-2 text-[#1A1A1A]">
            <GraduationCap className="text-[#0047BB] w-3 h-3" /> 학력 및 교육
          </h3>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="relative pl-3 border-l-2 border-[#0047BB]/20">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-none bg-[#0047BB]/40"></div>
                <div className="flex flex-col gap-0.5 mb-0.5">
                  <h4 className="font-bold text-[10.5px] text-[#1A1A1A] leading-snug">{edu.title}</h4>
                  <span className="text-[8px] font-mono font-bold text-zinc-400">{edu.period}</span>
                </div>
                <div className="text-[9px] text-zinc-600 leading-relaxed mb-0.5 font-medium">{edu.description}</div>
                <ul className="text-[8px] text-zinc-500 space-y-0.5 list-none">
                  {edu.details.map((detail, dIdx) => <li key={dIdx} className="relative pl-2"><span className="absolute left-0 top-1 w-1 h-1 bg-zinc-300 rounded-full"></span>{detail}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section>
          <h3 className="text-[11px] font-bold mb-1.5 flex items-center gap-2 text-[#1A1A1A]">
            <Award className="text-[#0047BB] w-3 h-3" /> 자격증
          </h3>
          <div className="flex flex-col">
            {data.certificates && data.certificates.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-zinc-100 last:border-0">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[9.5px] text-[#1A1A1A] tracking-tight">{cert.name}</span>
                    {cert.score && <span className="text-[7.5px] font-black text-[#0047BB] bg-[#0047BB]/5 px-1 py-0.5 rounded-sm leading-none tabular-nums">{cert.score}</span>}
                  </div>
                  <span className="text-[7.5px] font-mono text-zinc-400 font-bold">{cert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>

      {/* RIGHT COLUMN */}
      <main className="col-span-8 px-5 py-4 bg-white flex flex-col gap-4 overflow-hidden">
        {/* Project Experience */}
        <section>
          <h3 className="text-[12px] font-bold mb-3 flex items-center gap-2 text-[#1A1A1A]">
            <Briefcase className="text-[#0047BB] w-3.5 h-3.5" /> 프로젝트 경험
          </h3>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-[#0047BB]/10">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-white border-2 border-[#0047BB] shadow-sm"></div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-[12px] text-[#1A1A1A] tracking-tight">{exp.title}</h4>
                  <span className="text-[7.5px] font-mono font-black text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded-sm border border-zinc-100 shrink-0">{exp.period}</span>
                </div>

                <div className="text-[9.5px] text-[#0047BB] font-bold mb-1 bg-[#0047BB]/5 inline-block px-2 py-0.5 rounded-sm border-l-2 border-[#0047BB]">
                  {inlineRender(exp.description)}
                </div>
                {exp.teamSize && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[7.5px] font-mono font-black text-zinc-400 uppercase tracking-widest">팀 구성</span>
                    <span className="text-[8.5px] font-bold text-zinc-500 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded-sm">{exp.teamSize}</span>
                  </div>
                )}

                <ul className="text-[9px] text-[#4A4A4A] space-y-1 list-none leading-relaxed font-medium">
                  {exp.details.map((detail, dIdx) => (
                    <li key={dIdx} className="relative pl-3">
                      <span className="absolute left-0 top-1.5 w-1 h-1 border border-[#0047BB] rounded-full"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Proficiency */}
        {data.tools && data.tools.length > 0 && (
          <section className="pt-3 border-t border-zinc-100">
            <h3 className="text-[12px] font-bold mb-2 flex items-center gap-2 text-[#1A1A1A]">
              <Wrench className="text-[#0047BB] w-3.5 h-3.5" /> 기술 역량 및 도구
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {/* Group 1 */}
              <div>
                <h4 className="text-[7px] font-black text-[#0047BB] tracking-[0.35em] uppercase border-b border-[#0047BB]/10 pb-1 mb-2">DOCUMENTATION & OFFICE</h4>
                <div className="space-y-2">
                  {data.tools.filter(t => ["Excel", "PowerPoint", "Word", "Notion"].includes(t.name)).map((tool, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="text-[#1A1A1A] shrink-0 pt-0.5">{renderToolIcon(tool.name)}</div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9.5px] font-bold text-[#1A1A1A]">{tool.name}</span>
                        <p className="text-[8px] text-zinc-500 font-medium leading-snug">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2 */}
              <div>
                <h4 className="text-[7px] font-black text-[#0047BB] tracking-[0.35em] uppercase border-b border-[#0047BB]/10 pb-1 mb-2">CREATIVE & ENGINE</h4>
                <div className="space-y-2">
                  {data.tools.filter(t => ["Figma", "Unity"].includes(t.name)).map((tool, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="text-[#1A1A1A] shrink-0 pt-0.5">{renderToolIcon(tool.name)}</div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9.5px] font-bold text-[#1A1A1A]">{tool.name}</span>
                        <p className="text-[8px] text-zinc-500 font-medium leading-snug">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                  <h4 style={{ fontSize: '7px', fontWeight: 900, color: BLUE, letterSpacing: '0.35em', textTransform: 'uppercase', borderBottom: `1px solid ${BLUE_BORDER}`, paddingBottom: '4px', marginBottom: '6px', marginTop: '10px' }}>AI ASSISTANTS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {data.tools.filter(t => ["ChatGPT", "Claude", "Gemini", "Antigravity"].includes(t.name)).map((tool, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                        <div style={{ color: DARK, display: 'flex', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>{renderToolIcon(tool.name)}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span style={{ fontSize: '9.5px', fontWeight: 700, color: DARK }}>{tool.name}</span>
                          <p style={{ fontSize: '8px', color: MUTED, fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{tool.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  </div>
);

/* ─── PAGES 2-4: COVER LETTER ────────────────────────────────────── */
type IntroItem = NonNullable<ResumeData['selfIntroductions']>[0];

const CoverPage: React.FC<{ intro: IntroItem; idx: number; isLast: boolean; data: ResumeData }> = ({ intro, idx, isLast, data }) => {
  const number = String(idx + 1).padStart(2, '0');

  return (
    <div style={{
      ...PAGE,
      padding: '16mm 20mm',
      display: 'flex',
      flexDirection: 'column',
      pageBreakAfter: isLast ? 'auto' : 'always',
      breakAfter: isLast ? 'auto' : 'page',
      background: WHITE,
    }} className="pdf-page">

      {/* Header: Number & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${BLUE_BORDER}`, background: BLUE_FAINT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 900, fontSize: '14px', color: BLUE }}>
          {number}
        </div>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${BLUE_BORDER}, transparent)` }}></div>
      </div>

      {/* Logline */}
      <div style={{ borderLeft: `4px solid ${BLUE}`, paddingLeft: '16px', marginBottom: '36px' }}>
         {renderLogline(intro.logline)}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderParagraphs(intro.hook)}
        
        {intro.highlights && renderHighlightsHorizontal(intro.highlights)}

        {intro.pullQuote && (
          <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
             {renderPullQuote(intro.pullQuote)}
          </div>
        )}

        {intro.body && (
          <div style={{ marginTop: '12px' }}>
            {renderParagraphs(intro.body)}
          </div>
        )}

        {intro.closing && (
          <div style={{ marginTop: '12px' }}>
            {renderParagraphs(intro.closing)}
          </div>
        )}
      </div>

      {/* Footer */}
      {isLast && (
        <div style={{ marginTop: '30px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: MUTED }}>{data.name} / {data.role}</span>
          <span style={{ fontSize: '9px', color: FAINT }}>© 2026. ALL RIGHTS RESERVED.</span>
        </div>
      )}
    </div>
  );
};

/* ─── MAIN EXPORT ────────────────────────────────────────────────── */
export const PdfTemplate = React.forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => (
    <div ref={ref} style={{ width: '210mm', fontFamily: "'Pretendard', 'Noto Sans KR', 'Malgun Gothic', sans-serif" }}>
      <ResumePage data={data} />
      {(data.selfIntroductions || []).map((intro, i, arr) => (
        <CoverPage key={i} intro={intro} idx={i} isLast={i === arr.length - 1} data={data} />
      ))}
    </div>
  )
);
PdfTemplate.displayName = 'PdfTemplate';
