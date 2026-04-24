import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, MousePointer2 } from 'lucide-react';
import { EditableText } from './EditableText';
import { ProjectDetail } from './ProjectDetail';
import type { Project } from '../types';

interface PortfolioProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  setView: (v: any) => void;
  onBack: () => void;
  initialProjectId?: number | null;
}

export const Portfolio = ({ isEditing, projects, setProjects, onBack, initialProjectId }: PortfolioProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (initialProjectId != null) {
      const target = projects.find(p => p.id === initialProjectId);
      if (target) setSelectedProject(target);
    }
    window.scrollTo(0, 0);
  }, [initialProjectId, projects]);

  const categories = ['전체', ...Array.from(new Set(projects.flatMap(p => p.roles)))];
  const [activeCategory, setActiveCategory] = useState('전체');

  const filteredProjects = activeCategory === '전체'
    ? projects
    : projects.filter(p => p.roles && p.roles.includes(activeCategory));

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{background: 'rgba(0,71,187,0.04)'}}></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full blur-[100px]" style={{background: 'rgba(80,0,20,0.03)'}}></div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-4xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-black/5 p-8 md:p-12 lg:p-16 min-h-[80vh]">

        {/* Polished Filter Bar with Sliding Indicator */}
        <div className="flex flex-col items-center mb-16 relative">
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-zinc-100/50 backdrop-blur-xl rounded-[2rem] border border-black/5">
            {categories.map((category) => {
              const count = category === '전체' 
                ? projects.length 
                : projects.filter(p => p.roles && p.roles.includes(category)).length;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-6 py-3 rounded-[1.5rem] transition-all duration-500 group flex items-center gap-2.5 overflow-hidden min-w-fit ${
                    isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#0047BB] shadow-lg shadow-[#0047BB]/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 text-[14px] font-bold tracking-tight leading-none transition-colors">
                    {category}
                  </span>
                  <span className={`relative z-10 text-[9px] font-black px-1.5 py-0.5 rounded-md transition-colors duration-300 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-200/50 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-500'
                  }`}>
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Polished Project Grid with Refined Hierarchy */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-zinc-100 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#0047BB]/20 hover:shadow-[0_40px_80px_-24px_rgba(0,71,187,0.12)] transition-all duration-700"
              >
                {/* Card Image with Depth Overlay */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-50 shrink-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 font-bold text-sm">
                      <MousePointer2 className="w-4 h-4" /> 상세 내용 보기
                    </div>
                  </div>
                  
                  {/* Status Overlay for instant visibility */}
                  {project.status && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border backdrop-blur-md shadow-xl leading-tight transition-all duration-500 ${
                         project.status === '미출시' 
                           ? 'bg-zinc-800/80 text-white border-white/10' 
                           : 'bg-[#0047BB]/90 text-white border-white/20'
                       }`}>
                        {project.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Refined Content Structure */}
                <div className="p-8 pb-10 flex-1 flex flex-col bg-white relative z-10">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.roles.map(role => (
                        <span key={role} className="text-[9px] font-black text-[#0047BB] uppercase tracking-[0.15em] opacity-80">{role}</span>
                      ))}
                    </div>
                    <h4 className="text-2xl font-display font-black tracking-tight text-zinc-900 transition-colors leading-[1.1] group-hover:text-[#0047BB]">
                      {project.title}
                    </h4>
                  </div>

                  <p className="text-zinc-500 text-[14.5px] leading-relaxed mb-8 line-clamp-3 font-medium opacity-90 group-hover:opacity-100 transition-opacity">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2.5 py-1.2 rounded-lg border border-zinc-100 group-hover:border-zinc-200 group-hover:text-zinc-600 transition-all">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        </div>
      </motion.section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-100">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
              <div className="absolute inset-0 flex items-center justify-center p-0 md:p-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.97 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                  className="w-[98vw] md:w-[95vw] h-[98vh] md:h-[95vh] max-w-[1600px] bg-bg-main md:rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden relative pointer-events-auto flex flex-col"
                >

                {/* Content - height fills modal, scroll managed per-tab */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <ProjectDetail
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                    isEditing={isEditing}
                    onSaveContent={(c) => {
                      const p = [...projects];
                      const i = p.findIndex(pp => pp.id === selectedProject.id);
                      if (i !== -1) { p[i].content = c; setProjects(p); setSelectedProject({ ...selectedProject, content: c }); }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
