import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, Mail, Phone, GraduationCap, Award, Briefcase, Wrench, Figma, User, Calendar, MapPin, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditableText } from './EditableText';
import { CoverLetter } from './CoverLetter';
import { PrintTemplate } from './PrintTemplate';
import { PdfTemplate } from './PdfTemplate';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ResumeData } from '../types';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  Word: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#2b579a] transition-transform group-hover:scale-110"><path d="M4.17 6.43l7.33-1.07v13.28l-7.33-1.07V6.43zm8.33-1.25V18.82l7.33 1.07V4.11L12.5 5.18zM6.5 8.79l1.19.12.8 4.23.95-4.23h1.05l.93 4.23.77-4.23 1.25.12-1.39 6.27h-1.12l-.98-4.32-.98 4.32H8l-1.5-6.51z"/></svg>,
  PowerPoint: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#d24726] transition-transform group-hover:scale-110"><path d="M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zM8.38 8.81h2.24c1.17 0 1.95.73 1.95 1.83 0 1.1-.78 1.83-1.95 1.83H9.4v3.23H8.38V8.81zm1.02.83v2.09h1.16c.55 0 .9-.36.9-.99 0-.64-.35-1.1-.9-1.1H9.4z"/></svg>,
  Excel: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#217346] transition-transform group-hover:scale-110"><path d="M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zm-5.74 3.73l1.14.15.82 2.37.89-2.37h1.02l-1.36 3.19 1.48 3.32h-1.14l-1.01-2.43-1 2.43H6.42l1.52-3.32-1.42-3.34z"/></svg>,
  Notion: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current group-hover:text-black transition-transform group-hover:scale-110"><path d="M4.459 4.208c-.755 0-1.282.49-1.282 1.17v13.244c0 .679.527 1.17 1.282 1.17h15.082c.755 0 1.282-.491 1.282-1.17V5.378c0-.68-.527-1.17-1.282-1.17H4.459zM2.8 5.378c0-1.27 1.013-2.301 2.261-2.301h13.878C20.187 3.077 21.2 4.108 21.2 5.378v13.244c0 1.27-1.013 2.301-2.261 2.301H5.06A2.28 2.28 0 012.8 18.622V5.378zm5.553 10.603V8.895l4.896 6.945V8.125h1.196v7.856l-4.896-6.945v6.945H8.353z"/></svg>,
  Figma: <svg viewBox="0 0 38 57" className="w-8 h-8 transition-transform group-hover:scale-110"><path d="M19 28.5c0-2.652 1.054-5.196 2.929-7.071C23.804 19.554 26.348 18.5 29 18.5s5.196 1.054 7.071 2.929C37.946 23.304 39 25.848 39 28.5s-1.054 5.196-2.929 7.071C34.196 37.446 31.652 38.5 29 38.5s-5.196-1.054-7.071-2.929C20.054 33.696 19 31.152 19 28.5z" fill="#1ABCFE"/><path d="M0 47.5C0 44.848 1.054 42.304 2.929 40.429 4.804 38.554 7.348 37.5 10 37.5s5.196 1.054 7.071 2.929C18.946 42.304 20 44.848 20 47.5s-1.054 5.196-2.929 7.071C15.196 56.446 12.652 57.5 10 57.5s-5.196-1.054-7.071-2.929C1.054 52.696 0 50.152 0 47.5z" fill="#0ACF83"/><path d="M0 28.5C0 25.848 1.054 23.304 2.929 21.429 4.804 19.554 7.348 18.5 10 18.5h10v20H10c-2.652 0-5.196-1.054-7.071-2.929C1.054 33.696 0 31.152 0 28.5z" fill="#A259FF"/><path d="M0 9.5C0 6.848 1.054 4.304 2.929 2.429 4.804 0.554 7.348 0 10 0h10v19H10c-2.652 0-5.196-1.054-7.071-2.929C1.054 14.196 0 11.652 0 9.5z" fill="#F24E1E"/><path d="M20 0h10c2.652 0 5.196 1.054 7.071 2.929C38.946 4.804 40 7.348 40 10c0 2.652-1.054 5.196-2.929 7.071C35.196 18.946 32.652 20 30 20H20V0z" fill="#FF7262"/></svg>,
  Unity: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-black transition-transform group-hover:scale-110"><path d="M12 1.41l10.59 6.1v12.2L12 25.82 1.41 19.71V7.51zM12 3.8L3.8 8.53v9.42l8.2 4.71 8.2-4.71V8.53zM12 12.35l7-4.04-1.26-2.18-5.38 3.1-6.19-4.88-1.56 1.94 4.86 3.82-4.48 2.58L6.2 14.8l5.8-3.35z"/></svg>,
  ChatGPT: <svg viewBox="0 0 16 16" className="w-8 h-8 fill-current group-hover:text-[#10a37f] transition-colors"><path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z"/></svg>,
  Claude: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current group-hover:text-[#d97757] transition-colors"><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg>,
  Gemini: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current group-hover:text-[#4285f4] transition-colors"><path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>,
  Antigravity: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2 group-hover:text-[#0047BB] transition-colors"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7 12 12l8.7-5 M12 22V12"/></svg>,
};

interface ResumeProps {
  setView: (v: any) => void;
  onBack: () => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  data: ResumeData;
  setData: (d: ResumeData) => void;
  activeTab: 'resume' | 'cover-letter';
  setActiveTab: (tab: 'resume' | 'cover-letter') => void;
  isGeneratingPdf: boolean;
  setIsGeneratingPdf: (v: boolean) => void;
}

export const Resume = ({ setView, onBack, isEditing, setIsEditing, data, setData, activeTab, isGeneratingPdf, setIsGeneratingPdf }: ResumeProps) => {

  const handleDownload = () => {
    // 1) React Component를 순수 HTML 문자열로 렌더링
    const htmlString = renderToStaticMarkup(<PdfTemplate data={data} />);

    // 2) 새 창 열기 (격리된 환경)
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      alert('팝업 차단이 활성화되어 있습니다. 팝업을 허용해주세요.');
      return;
    }

    // 3) 현재 페이지의 스타일시트 복사
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(node => node.outerHTML)
      .join('\n');

    // 4) HTML 주입
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="utf-8">
          <title>조경환_게임기획자_포트폴리오</title>
          ${styles}
          <style>
            @page { 
              size: A4 portrait; 
              margin: 0; 
            }
            body { 
              margin: 0; 
              background: #f8f9fa;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .pdf-page { 
              page-break-after: always; 
              break-after: page; 
            }
            .pdf-page:last-child { 
              page-break-after: auto; 
              break-after: auto; 
            }
          </style>
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `);
    printWindow.document.close();

    // 5) 리소스 로드(폰트 및 이미지) 대기 후 인쇄
    printWindow.onload = () => {
      Promise.all([
        printWindow.document.fonts.ready,
        ...Array.from(printWindow.document.images).map(img =>
          img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
        )
      ]).then(() => {
        printWindow.focus();
        printWindow.print();
      });
    };

    // 6) 인쇄 후 새 창 닫기
    const handleAfterPrint = () => {
      printWindow.close();
      printWindow.removeEventListener('afterprint', handleAfterPrint);
    };
    printWindow.addEventListener('afterprint', handleAfterPrint);
  };


  // Navbar PDF 버튼 → CustomEvent 수신
  React.useEffect(() => {
    const handler = () => handleDownload();
    window.addEventListener('triggerPdfDownload', handler);
    return () => window.removeEventListener('triggerPdfDownload', handler);
  }, [activeTab, data]);

  return (
    <>
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        className="pt-28 pb-12 md:pb-20 px-6 md:px-12 max-w-[1300px] mx-auto w-full min-h-screen flex flex-col relative">

        <AnimatePresence mode="wait">
          {activeTab === 'resume' ? (
            /* ========================================================= */
            /* RESUME TAB (Top Profile + Bottom Grid)                    */
            /* ========================================================= */
            <motion.div 
              key="resume"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[1080px] mx-auto bg-white shadow-[0_40px_120px_rgba(0,0,0,0.1)] border border-black/5 rounded-sm overflow-hidden flex flex-col"
            >
              {/* 1. EDITORIAL HEADER SECTION */}
              <header className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 lg:p-12 bg-[#FAFAFA] border-b border-zinc-100">
                {/* Vertical Portrait Frame */}
                <div className="relative shrink-0">
                  <div className="w-48 lg:w-52 rounded-sm overflow-hidden border border-black/10 shadow-xl bg-white">
                    <img 
                      src={data.image || "https://picsum.photos/seed/profile/600/800"} 
                      alt="Profile" 
                      className="w-full h-auto object-contain block" 
                    />
                  </div>

                </div>

                {/* Identity & Summary */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
                  <h1 className="text-4xl lg:text-[56px] font-display font-bold text-[#1A1A1A] tracking-tighter leading-tight mb-2">
                    <EditableText value={data.name} onSave={(v) => setData({...data, name: v})} isEditing={isEditing} />
                  </h1>
                  <p className="text-[#0047BB] font-black font-mono tracking-[0.4em] text-[11px] lg:text-xs uppercase mb-6 pb-1 border-b-2 border-[#0047BB]">
                    <EditableText value={data.role} onSave={(v) => setData({...data, role: v})} isEditing={isEditing} />
                  </p>
                  
                  <div className="max-w-2xl text-[16px] lg:text-[17px] text-[#2C2C2C] leading-[1.75] font-medium [&_strong]:text-[#0047BB] [&_strong]:font-black [&_strong]:text-[17px] lg:[&_strong]:text-[18px] [&_strong]:bg-[#0047BB]/5 [&_strong]:px-1.5 [&_strong]:py-0.5 [&_strong]:rounded-md break-keep">
                    <EditableText value={data.summary} onSave={(v) => setData({...data, summary: v})} isEditing={isEditing} markdown={true} />
                  </div>

                  {/* Contact Info Grid - 2×N layout */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                    <div className="flex items-center gap-2.5 group">
                      <Mail className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">EMAIL</span>
                        <span className="text-[13px] text-[#1A1A1A] font-semibold lowercase">
                          <EditableText value={data.email} onSave={(v) => setData({...data, email: v})} isEditing={isEditing} />
                        </span>
                      </div>
                    </div>
                    {data.birthDate && (
                      <div className="flex items-center gap-2.5 group">
                        <Calendar className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">생년월일</span>
                          <span className="text-[13px] text-[#1A1A1A] font-semibold">{data.birthDate}</span>
                        </div>
                      </div>
                    )}
                    {(isEditing || isGeneratingPdf) && data.phone && (
                      <div className="flex items-center gap-2.5 group">
                        <Phone className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">연락처</span>
                          <span className="text-[13px] text-[#1A1A1A] font-semibold">
                            <EditableText value={data.phone} onSave={(v) => setData({...data, phone: v})} isEditing={isEditing} />
                          </span>
                        </div>
                      </div>
                    )}
                    {data.address && (
                      <div className="flex items-center gap-2.5 group">
                        <MapPin className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">주소</span>
                          <span className="text-[13px] text-[#1A1A1A] font-semibold">
                            <EditableText value={data.address} onSave={(v) => setData({...data, address: v})} isEditing={isEditing} />
                          </span>
                        </div>
                      </div>
                    )}
                    {data.military && (
                      <div className="flex items-center gap-2.5 group">
                        <Shield className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">병역</span>
                          <span className="text-[13px] text-[#1A1A1A] font-semibold">{data.military.branch} {data.military.rank} {data.military.status}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* 2. MAIN CONTENT GRID (High Legibility) */}
              <div className="grid lg:grid-cols-12 gap-0">
                
                {/* LEFT COLUMN (Sidebar info) */}
                <aside className="lg:col-span-4 p-8 lg:p-10 border-r border-zinc-100 bg-[#FCFCFC]">
                  <div className="flex flex-col gap-12">
                    {/* Education */}
                    <section>
                      <h3 className="text-[17px] font-bold mb-6 flex items-center gap-3 text-[#1A1A1A]">
                        <GraduationCap className="text-[#0047BB] w-5 h-5" /> 학력 및 교육
                      </h3>
                      <div className="space-y-8">
                        {data.education.map((edu, idx) => (
                          <div key={idx} className="relative pl-6 border-l-2 border-[#0047BB]/20">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-none bg-[#0047BB]/40"></div>
                            <div className="flex flex-col gap-1.5 mb-3">
                              <h4 className="font-bold text-[16px] text-[#1A1A1A] leading-snug">
                                <EditableText value={edu.title} onSave={(v) => { const e = [...data.education]; e[idx].title = v; setData({...data, education: e}); }} isEditing={isEditing} />
                              </h4>
                              <span className="text-[11px] font-mono font-bold text-zinc-400">
                                <EditableText value={edu.period} onSave={(v) => { const e = [...data.education]; e[idx].period = v; setData({...data, education: e}); }} isEditing={isEditing} />
                              </span>
                            </div>
                            <div className="text-[12px] text-zinc-600 leading-relaxed mb-3 font-medium">
                              <EditableText value={edu.description} onSave={(v) => { const e = [...data.education]; e[idx].description = v; setData({...data, education: e}); }} isEditing={isEditing} markdown={true} />
                            </div>
                            <ul className="text-[11px] text-zinc-500 space-y-1.5 list-none">
                              {edu.details.map((detail, dIdx) => <li key={dIdx} className="relative pl-3"><span className="absolute left-0 top-1.5 w-1 h-1 bg-zinc-300 rounded-full"></span>{detail}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Certificates */}
                    <section>
                      <h3 className="text-[17px] font-bold mb-5 flex items-center gap-3 text-[#1A1A1A]">
                        <Award className="text-[#0047BB] w-5 h-5" /> 자격증
                      </h3>
                      <div className="flex flex-col">
                        {data.certificates && data.certificates.map((cert, idx) => (
                          <div key={idx} className="py-3.5 border-b border-zinc-100 last:border-0">
                            {/* Name */}
                            <span className="font-semibold text-[14px] text-[#1A1A1A] leading-snug block mb-2">
                              <EditableText value={cert.name} onSave={(v) => { const c = [...(data.certificates||[])]; c[idx].name = v; setData({...data, certificates: c}); }} isEditing={isEditing} />
                            </span>
                            {/* Score + Year row */}
                            <div className="flex items-center gap-4">
                              {cert.score && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium">점수</span>
                                  <span className="text-[12px] text-[#0047BB] tabular-nums">{cert.score}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium">취득</span>
                                <span className="text-[12px] text-zinc-500">{cert.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </aside>

                {/* RIGHT COLUMN (Main details) */}
                <main className="lg:col-span-8 p-8 lg:p-10 bg-white">
                  {/* Project Experience */}
                  <section>
                    <h3 className="text-[19px] font-bold mb-8 flex items-center gap-3 text-[#1A1A1A]">
                      <Briefcase className="text-[#0047BB] w-6 h-6" /> 프로젝트 경험
                    </h3>
                    <div className="space-y-12">
                      {data.experience.map((exp, idx) => (
                        <div key={idx} className="relative pl-10 border-l-[3px] border-[#0047BB]/10">
                          <div className="absolute -left-[10px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-[#0047BB] shadow-sm"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <h4 className="font-bold text-[22px] text-[#1A1A1A] tracking-tight">
                              <EditableText value={exp.title} onSave={(v) => { const e = [...data.experience]; e[idx].title = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                            </h4>
                            <span className="text-[10px] font-mono font-black text-zinc-400 bg-zinc-50 px-3 py-1 rounded-sm border border-zinc-100">
                              <EditableText value={exp.period} onSave={(v) => { const e = [...data.experience]; e[idx].period = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                            </span>
                          </div>

                          <div className="text-[14px] text-[#0047BB] font-bold mb-3 bg-[#0047BB]/5 inline-block px-4 py-2 rounded-sm border-l-4 border-[#0047BB]">
                            <EditableText value={exp.description} onSave={(v) => { const e = [...data.experience]; e[idx].description = v; setData({...data, experience: e}); }} isEditing={isEditing} markdown={true} />
                          </div>
                          {exp.teamSize && (
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-[10px] font-bold text-white bg-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded-sm">팀 구성</span>
                              <span className="text-[12px] font-bold text-[#1A1A1A] bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-sm">{exp.teamSize}</span>
                            </div>
                          )}

                          <ul className="text-[14px] text-[#4A4A4A] space-y-3 list-none leading-relaxed font-medium">
                            {exp.details.map((detail, dIdx) => (
                              <li key={dIdx} className="relative pl-6">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 border border-[#0047BB] rounded-full"></span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Technical Proficiency - Categorized for Clarity */}
                  {data.tools && data.tools.length > 0 && (
                    <section className="mt-10 pt-10 border-t border-zinc-100">
                      <h3 className="text-[19px] font-bold mb-8 flex items-center gap-3 text-[#1A1A1A]">
                        <Wrench className="text-[#0047BB] w-6 h-6" /> 기술 역량 및 도구
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Group 1: Documentation & Office */}
                        <div className="space-y-5">
                          <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-2 mb-3">DOCUMENTATION & OFFICE</h4>
                          <div className="space-y-3">
                            {data.tools.filter(t => ["Excel", "PowerPoint", "Word", "Notion"].includes(t.name)).map((tool, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <div className="text-[#1A1A1A] shrink-0 pt-1">{TOOL_ICONS[tool.name] || <Wrench className="w-10 h-10" />}</div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[14px] font-bold text-[#1A1A1A]">{tool.name}</span>
                                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{tool.description}</p>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>

                        {/* Group 2: Creative & Engine */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-2 mb-4">CREATIVE & ENGINE</h4>
                          <div className="space-y-4">
                            {data.tools.filter(t => ["Figma", "Unity"].includes(t.name)).map((tool, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <div className="text-[#1A1A1A] shrink-0 pt-1">{TOOL_ICONS[tool.name] || <Wrench className="w-8 h-8" />}</div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[14px] font-bold text-[#1A1A1A]">{tool.name}</span>
                                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{tool.description}</p>
                                  </div>
                                </div>
                            ))}
                            {/* AI Assistants section */}
                            <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-2 mb-4 mt-8">AI ASSISTANTS</h4>
                            <div className="space-y-4">
                              {data.tools.filter(t => ["ChatGPT", "Claude", "Gemini", "Antigravity"].includes(t.name)).map((tool, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <div className="text-[#1A1A1A] shrink-0 pt-1">{TOOL_ICONS[tool.name] || <Wrench className="w-8 h-8" />}</div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[14px] font-bold text-[#1A1A1A]">{tool.name}</span>
                                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{tool.description}</p>
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
            </motion.div>
          ) : (
            /* ========================================================= */
            /* COVER LETTER TAB (Only the content takes full width/focus)*/
            /* ========================================================= */
            <motion.div 
              key="cover-letter"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <CoverLetter setView={setView} isEditing={isEditing} data={data} setData={setData} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

    </>
  );
};
