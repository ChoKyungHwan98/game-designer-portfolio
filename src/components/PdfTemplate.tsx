/**
 * PdfTemplate.tsx
 * 100% INLINE STYLES — NO TAILWIND CLASSES
 * This is critical: html2canvas (used by html2pdf.js) crashes on Tailwind 4's
 * oklch() / color-mix(in oklab) computed values. All colors must be hex or rgba.
 */
import React from 'react';
import type { ResumeData } from '../types';
import { ScrollText, Mail, Phone, GraduationCap, Award, Briefcase, Wrench, Figma, User, Calendar, MapPin, Shield } from 'lucide-react';

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

/* ─── tool SVG paths ─────────────────────────────────────────────── */
const TOOL_PATHS: Record<string, string> = {
  Word:        'M4.17 6.43l7.33-1.07v13.28l-7.33-1.07V6.43zm8.33-1.25V18.82l7.33 1.07V4.11L12.5 5.18zM6.5 8.79l1.19.12.8 4.23.95-4.23h1.05l.93 4.23.77-4.23 1.25.12-1.39 6.27h-1.12l-.98-4.32-.98 4.32H8l-1.5-6.51z',
  PowerPoint:  'M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zM8.38 8.81h2.24c1.17 0 1.95.73 1.95 1.83 0 1.1-.78 1.83-1.95 1.83H9.4v3.23H8.38V8.81zm1.02.83v2.09h1.16c.55 0 .9-.36.9-.99 0-.64-.35-1.1-.9-1.1H9.4z',
  Excel:       'M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zm-5.74 3.73l1.14.15.82 2.37.89-2.37h1.02l-1.36 3.19 1.48 3.32h-1.14l-1.01-2.43-1 2.43H6.42l1.52-3.32-1.42-3.34z',
  Notion:      'M4.459 4.208c-.755 0-1.282.49-1.282 1.17v13.244c0 .679.527 1.17 1.282 1.17h15.082c.755 0 1.282-.491 1.282-1.17V5.378c0-.68-.527-1.17-1.282-1.17H4.459zM2.8 5.378c0-1.27 1.013-2.301 2.261-2.301h13.878C20.187 3.077 21.2 4.108 21.2 5.378v13.244c0 1.27-1.013 2.301-2.261 2.301H5.06A2.28 2.28 0 012.8 18.622V5.378zm5.553 10.603V8.895l4.896 6.945V8.125h1.196v7.856l-4.896-6.945v6.945H8.353z',
  Figma:       'M8 13c0 1.657 1.343 3 3 3s3-1.343 3-3v-3H8v3zm3-11c-1.657 0-3 1.343-3 3s1.343 3 3 3V2zm-3 6c-1.657 0-3 1.343-3 3s1.343 3 3 3V8zm9 3c0-1.657-1.343-3-3-3v6c1.657 0 3-1.343 3-3zM8 2a3 3 0 000 6h3V2H8z',
  Unity:       'M12 3.8L3.8 8.53v9.42l8.2 4.71 8.2-4.71V8.53zM12 12.35l7-4.04-1.26-2.18-5.38 3.1-6.19-4.88-1.56 1.94 4.86 3.82-4.48 2.58L6.2 14.8l5.8-3.35z',
  ChatGPT:     'M22.28 12.12c0-1.23-.49-2.35-1.28-3.17.2-.62.31-1.28.31-1.95 0-3.31-2.69-6-6-6-1.38 0-2.64.47-3.65 1.25C10.65 1.47 9.39 1 8 1 4.69 1 2 3.69 2 7c0 .67.11 1.33.31 1.95-.79.82-1.28 1.94-1.28 3.17 0 1.23.49 2.35 1.28 3.17-.2.62-.31 1.28-.31 1.95 0 3.31 2.69 6 6 6 1.38 0 2.64-.47 3.65-1.25 1.01.78 2.27 1.25 3.65 1.25 3.31 0 6-2.69 6-6 0-.67-.11-1.33-.31-1.95.79-.82 1.28-1.94 1.28-3.17zm-10.28 7.21c-.81 0-1.58-.23-2.24-.62l.14-.08 3.51-2.03c.15-.09.24-.25.24-.42v-4.97l1.48.85c.1.06.16.17.16.29v4.02c0 .81-.66 1.47-1.47 1.47h-1.82zm-6.1-2.48c-.41-.7-.63-1.49-.63-2.31v-4.04c0-.12.06-.23.16-.29l3.48-2.01V6.15c0-.18.1-.33.25-.42l3.48-2.01c.07-.04.14-.06.21-.06.14 0 .28.08.35.21l1.48 2.56-1.48.85c-.1.06-.16.17-.16.29V11.2l-3.48 2.01c-.08.05-.13.13-.13.22v4.02l-1.81-1.04zm-1.18-7.21c0-.81.22-1.58.62-2.24l.08.14 2.03 3.51c.09.15.25.24.42.24h4.97l-.85 1.48c-.06.1-.17.16-.29.16H8c-.81 0-1.47-.66-1.47-1.47V12.12zm1.83-6.1c.7-.41 1.49-.63 2.31-.63h4.04c.12 0 .23.06.29.16l2.01 3.48h-4.14c-.18 0-.33.1-.42.25L10.36 12.1c-.04.07-.06.14-.06.21 0 .14.08.28.21.35l2.56 1.48-.85 1.48c-.06.1-.17.16-.29.16H8c-.09 0-.17-.05-.22-.13l-2.01-3.48 1.04-1.81zm7.21-1.18c.81 0 1.58.22 2.24.62l-.14-.08-3.51-2.03c-.15-.09-.24-.25-.24-.42V5.45l-1.48-.85c-.1-.06-.16-.17-.16-.29V8.33c0 .81.66 1.47 1.47 1.47h1.82zm6.1 2.48c.41.7.63 1.49.63 2.31v4.04c0 .12-.06.23-.16.29l-3.48 2.01v4.14c0 .18-.1.33-.25.42l-3.48 2.01c-.07.04-.14.06-.21.06-.14 0-.28-.08-.35-.21l-1.48-2.56 1.48-.85c.1-.06.16-.17.16-.29V12.8l3.48-2.01c.08-.05.13-.13.13-.22V6.55l1.81 1.04zM12 10.74l1.26.73v1.46l-1.26.73-1.26-.73v-1.46L12 10.74z',
  Claude:      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.6 15.5l-1.3-4.1h-2.6l-1.3 4.1H6.7l4.1-11h2.4l4.1 11h-1.7zm-1.7-5.5l-.9-2.9-.9 2.9h1.8z',
  Gemini:      'M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0Z',
  Antigravity: 'M12 2l8 18-8-4-8 4 8-18z M12 6l-3 7 3-1.5 3 1.5-3-7z',
};

const ToolBadge: React.FC<{ name: string }> = ({ name }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: '#52525B' }}>
    {TOOL_PATHS[name] && (
      <svg viewBox="0 0 24 24" width="12" height="12" style={{ fill: '#52525B', flexShrink: 0 }}>
        <path d={TOOL_PATHS[name]} />
      </svg>
    )}
    {name}
  </span>
);

const renderToolIcon = (name: string) => {
  if (name === 'Figma') return <Figma className="w-7 h-7" />;
  if (TOOL_PATHS[name]) return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
      <path d={TOOL_PATHS[name]} />
    </svg>
  );
  return <Wrench className="w-7 h-7" />;
};

/* ─── PAGE 1: RESUME ─────────────────────────────────────────────── */
const ResumePage: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="pdf-page bg-white mx-auto flex flex-col font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
    
    {/* 1. EDITORIAL HEADER SECTION */}
    <header className="flex items-start gap-5 p-6 bg-[#FAFAFA] border-b border-zinc-100">
      {/* Portrait */}
      <div className="relative shrink-0">
        <div className="w-[100px] rounded-sm overflow-hidden border border-black/10 shadow-xl bg-white">
          <img 
            src={data.image || "https://picsum.photos/seed/profile/600/800"} 
            alt="Profile" 
            className="w-full h-auto object-contain block" 
          />
        </div>
      </div>

      {/* Identity & Summary */}
      <div className="flex-1 flex flex-col items-start pt-1">
        <h1 className="text-[30px] font-bold text-[#1A1A1A] tracking-tighter leading-none mb-2">
          {data.name}
        </h1>
        <p className="text-[#0047BB] font-black font-mono tracking-[0.4em] text-[9.5px] uppercase mb-3 pb-1 border-b-2 border-[#0047BB]">
          {data.role}
        </p>
        
        <div className="max-w-2xl text-[11px] text-[#2C2C2C] leading-relaxed font-medium [&_strong]:text-[#0047BB] [&_strong]:font-bold break-keep italic opacity-90 mb-3">
          {inlineRender(data.summary || '')}
        </div>

        {/* Contact Quick List */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
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
    <div className="grid grid-cols-12 gap-0 flex-1">
      {/* LEFT COLUMN */}
      <aside className="col-span-4 p-6 border-r border-zinc-100 bg-[#FCFCFC] flex flex-col gap-6">
        {/* Education */}
        <section>
          <h3 className="text-[12px] font-bold mb-3 flex items-center gap-2 text-[#1A1A1A]">
            <GraduationCap className="text-[#0047BB] w-3.5 h-3.5" /> 학력 및 교육
          </h3>
          <div className="space-y-4">
            {data.education.map((edu, idx) => (
              <div key={idx} className="relative pl-3 border-l-2 border-[#0047BB]/20">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-none bg-[#0047BB]/40"></div>
                <div className="flex flex-col gap-0.5 mb-1">
                  <h4 className="font-bold text-[11px] text-[#1A1A1A] leading-snug">{edu.title}</h4>
                  <span className="text-[8.5px] font-mono font-bold text-zinc-400">{edu.period}</span>
                </div>
                <div className="text-[9.5px] text-zinc-600 leading-relaxed mb-1 font-medium">{edu.description}</div>
                <ul className="text-[8.5px] text-zinc-500 space-y-1 list-none">
                  {edu.details.map((detail, dIdx) => <li key={dIdx} className="relative pl-2"><span className="absolute left-0 top-1 w-1 h-1 bg-zinc-300 rounded-full"></span>{detail}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section>
          <h3 className="text-[12px] font-bold mb-2 flex items-center gap-2 text-[#1A1A1A]">
            <Award className="text-[#0047BB] w-3.5 h-3.5" /> 자격증
          </h3>
          <div className="flex flex-col">
            {data.certificates && data.certificates.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-zinc-100 last:border-0">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[10px] text-[#1A1A1A] tracking-tight">{cert.name}</span>
                    {cert.score && <span className="text-[8px] font-black text-[#0047BB] bg-[#0047BB]/5 px-1 py-0.5 rounded-sm leading-none tabular-nums mt-0.5">{cert.score}</span>}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 font-bold">{cert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>

      {/* RIGHT COLUMN */}
      <main className="col-span-8 p-6 bg-white flex flex-col gap-6">
        {/* Project Experience */}
        <section>
          <h3 className="text-[13px] font-bold mb-4 flex items-center gap-2 text-[#1A1A1A]">
            <Briefcase className="text-[#0047BB] w-4 h-4" /> 프로젝트 경험
          </h3>
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-5 border-l-2 border-[#0047BB]/10">
                <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#0047BB] shadow-sm"></div>
                
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-[13px] text-[#1A1A1A] tracking-tight">{exp.title}</h4>
                  <span className="text-[8px] font-mono font-black text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded-sm border border-zinc-100">{exp.period}</span>
                </div>

                <div className="text-[10px] text-[#0047BB] font-bold mb-1.5 bg-[#0047BB]/5 inline-block px-2 py-1 rounded-sm border-l-2 border-[#0047BB]">
                  {inlineRender(exp.description)}
                </div>
                {exp.teamSize && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[8px] font-mono font-black text-zinc-400 uppercase tracking-widest">팀 구성</span>
                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded-sm">{exp.teamSize}</span>
                  </div>
                )}

                <ul className="text-[9.5px] text-[#4A4A4A] space-y-1.5 list-none leading-relaxed font-medium">
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
          <section className="pt-4 border-t border-zinc-100 mt-auto">
            <h3 className="text-[13px] font-bold mb-3 flex items-center gap-2 text-[#1A1A1A]">
              <Wrench className="text-[#0047BB] w-4 h-4" /> 기술 역량 및 도구
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Group 1 */}
              <div className="space-y-2">
                <h4 className="text-[7.5px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-1 mb-1.5">DOCUMENTATION & OFFICE</h4>
                <div className="space-y-3">
                  {data.tools.filter(t => ["Excel", "PowerPoint", "Word", "Notion"].includes(t.name)).map((tool, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="text-[#1A1A1A] shrink-0 pt-0.5">{renderToolIcon(tool.name)}</div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-[#1A1A1A]">{tool.name}</span>
                        <p className="text-[8.5px] text-zinc-500 font-medium leading-snug">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2 */}
              <div className="space-y-2">
                <h4 className="text-[7.5px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-1 mb-1.5">CREATIVE & ENGINE</h4>
                <div className="space-y-3">
                  {data.tools.filter(t => ["Figma", "Unity"].includes(t.name)).map((tool, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="text-[#1A1A1A] shrink-0 pt-0.5">{renderToolIcon(tool.name)}</div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-[#1A1A1A]">{tool.name}</span>
                        <p className="text-[8.5px] text-zinc-500 font-medium leading-snug">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                  <h4 style={{ fontSize: '7.5px', fontWeight: 900, color: BLUE, letterSpacing: '0.4em', textTransform: 'uppercase', borderBottom: `1px solid ${BLUE_BORDER}`, paddingBottom: '4px', marginBottom: '6px', marginTop: '12px' }}>AI ASSISTANTS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.tools.filter(t => ["ChatGPT", "Claude", "Gemini", "Antigravity"].includes(t.name)).map((tool, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                        <div style={{ color: DARK, display: 'flex', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>{renderToolIcon(tool.name)}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: DARK }}>{tool.name}</span>
                          <p style={{ fontSize: '8.5px', color: MUTED, fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{tool.description}</p>
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
