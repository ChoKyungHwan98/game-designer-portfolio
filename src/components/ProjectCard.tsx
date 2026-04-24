import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { EditableText } from './EditableText';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  idx: number;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  onProjectClick: (p: Project) => void;
  layout?: 'default' | 'featured' | 'supporting' | 'accordion-active' | 'accordion-inactive';
}

export const ProjectCard = ({ project, idx, isEditing, projects, setProjects, onProjectClick, layout = 'default' }: ProjectCardProps) => {
  const isActive = layout === 'accordion-active';
  const isInactive = layout === 'accordion-inactive';
  
  if (isActive || isInactive) {
    return (
      <div className="relative w-full h-full flex flex-col justify-end p-6 lg:p-10">
        <div className={`absolute inset-0 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'} transition-opacity duration-700`}>
          <img src={project.image} alt={project.title} className={`w-full h-full object-cover ${isInactive ? 'object-top' : ''}`} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"></div>
        </div>
        
        {isEditing && (
          <button onClick={(e) => { e.stopPropagation(); if (confirm("이 프로젝트를 삭제하시겠습니까?")) { setProjects(projects.filter(p => p.id !== project.id)); }}}
            className="absolute top-6 right-6 z-20 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-xl hover:scale-110" title="삭제">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className={`relative z-10 transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 lg:opacity-100 lg:translate-y-0'}`}>
          <div className={`flex gap-2 mb-4 ${isActive ? 'flex-wrap items-center' : 'flex-col items-start'}`}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-[10px] font-black text-white tracking-[0.1em] uppercase rounded-lg w-fit">
              <EditableText value={project.roles ? project.roles.join(', ') : ''} onSave={(v) => { const p = [...projects]; p[idx].roles = v.split(',').map(s=>s.trim()); setProjects(p); }} isEditing={isEditing} />
            </div>
            {project.status && (
              <div className={`px-3.5 py-1.5 text-[10px] font-black tracking-[0.1em] uppercase rounded-lg w-fit border backdrop-blur-md shadow-xl ${project.status === '미출시' ? 'bg-zinc-800/80 text-zinc-300 border-white/10' : 'bg-[#0047BB]/90 text-white border-white/20'}`}>
                <EditableText value={project.status} onSave={(v) => { const p = [...projects]; p[idx].status = v; setProjects(p); }} isEditing={isEditing} />
              </div>
            )}
          </div>
          <h3 className={`font-display font-black text-white mb-3 tracking-tighter leading-[1.1] ${isActive ? 'text-3xl lg:text-5xl' : 'text-xl lg:text-2xl'} line-clamp-2`}>
            <EditableText value={project.title} onSave={(v) => { const p = [...projects]; p[idx].title = v; setProjects(p); }} isEditing={isEditing} />
          </h3>
          
          {isActive && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
              <p className="text-white/70 line-clamp-2 mb-8 text-base lg:text-lg font-medium leading-relaxed max-w-2xl">
                <EditableText value={project.description} onSave={(v) => { const p = [...projects]; p[idx].description = v; setProjects(p); }} isEditing={isEditing} multiline />
              </p>
              <button onClick={(e) => { e.stopPropagation(); onProjectClick(project); }}
                className="group px-8 py-4 bg-white hover:bg-[#0047BB] text-[#1A1A1A] hover:text-white font-bold text-xs tracking-widest transition-all duration-500 flex items-center gap-3 rounded-full uppercase w-fit shadow-2xl hover:scale-105 active:scale-95">
                기획서 상세 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div className="group relative bg-white border border-zinc-100 rounded-[2rem] overflow-hidden hover:border-[#0047BB]/20 hover:shadow-[0_32px_64px_-16px_rgba(0,71,187,0.12)] transition-all duration-700 flex flex-col h-full">
      {isEditing && (
        <button onClick={(e) => { e.stopPropagation(); if (confirm("삭제하시겠습니까?")) { setProjects(projects.filter(p => p.id !== project.id)); }}}
          className="absolute top-5 right-5 z-20 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-xl hover:scale-110" title="삭제">
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="overflow-hidden relative bg-zinc-50 shrink-0 aspect-16/10 border-b border-zinc-100">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 absolute inset-0" referrerPolicy="no-referrer" />
        <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2 z-10">
          <div className="bg-white/90 backdrop-blur-md border border-black/5 rounded-lg px-3 py-1.5 text-[9px] font-black text-[#2C2C2C] tracking-[0.1em] uppercase shadow-sm w-fit">
            <EditableText value={project.roles ? project.roles.join(', ') : ''} onSave={(v) => { const p = [...projects]; p[idx].roles = v.split(',').map(s=>s.trim()); setProjects(p); }} isEditing={isEditing} />
          </div>
          {project.status && (
            <div className={`border rounded-lg px-3 py-1.5 text-[9px] font-black tracking-[0.1em] uppercase shadow-sm w-fit backdrop-blur-md transition-all duration-500 ${project.status === '미출시' ? 'bg-zinc-100/90 text-zinc-500 border-zinc-200 shadow-none' : 'bg-[#0047BB]/90 text-white border-white/10 shadow-lg shadow-[#0047BB]/20'}`}>
              <EditableText value={project.status} onSave={(v) => { const p = [...projects]; p[idx].status = v; setProjects(p); }} isEditing={isEditing} />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between p-8 pb-10">
        <div>
          <h3 className="text-2xl font-display font-black mb-3 text-zinc-900 group-hover:text-[#0047BB] transition-colors line-clamp-1 leading-tight tracking-tight">
            <EditableText value={project.title} onSave={(v) => { const p = [...projects]; p[idx].title = v; setProjects(p); }} isEditing={isEditing} />
          </h3>
          <p className="text-zinc-500 text-[14.5px] leading-relaxed mb-8 line-clamp-2 font-medium opacity-90 group-hover:opacity-100 transition-opacity">
            <EditableText value={project.description} onSave={(v) => { const p = [...projects]; p[idx].description = v; setProjects(p); }} isEditing={isEditing} multiline />
          </p>
          <div className="flex flex-wrap gap-1.5 mb-10">
            {project.tags.slice(0, 3).map((tag, tagIdx) => (
              <span key={tagIdx} className="text-[10px] font-bold px-2.5 py-1.2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-400 uppercase tracking-widest group-hover:border-zinc-200 group-hover:text-zinc-500 transition-all">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onProjectClick(project); }}
          className="w-full relative overflow-hidden group/btn py-4 bg-white border border-zinc-200 text-[#1A1A1A] font-bold text-xs tracking-widest transition-all duration-700 flex items-center justify-center gap-2 uppercase rounded-2xl hover:border-[#0047BB] hover:shadow-[0_20px_40px_-12px_rgba(0,71,187,0.2)]">
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-700 group-hover/btn:text-white">기획서 상세 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          <div className="absolute inset-0 bg-[#0047BB] scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-700" />
        </button>
      </div>
    </motion.div>
  );
};
