/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';
import { ALL_GAMES } from './data/games';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { 
  Gamepad2, 
  Layers, 
  ScrollText, 
  Target, 
  Cpu, 
  Code2, 
  ExternalLink, 
  Mail, 
  Phone,
  ChevronRight,
  Terminal,
  Zap,
  ArrowUpRight,
  Sparkles,
  Gamepad,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  ArrowLeft,
  Menu,
  X,
  ArrowUp,
  Monitor,
  Smartphone,
  Package as PackageIcon,
  Clock,
  Save,
  Edit3,
  Lock,
  Plus,
  FileText,
  ArrowRight,
  FolderOpen,
  ChevronDown,
  Info,
  Figma,
  Sun,
  Moon
} from 'lucide-react';

// --- Types ---
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
  content: string;
  status?: string;
}

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
  caption?: string;
}

export interface GamePlay {
  id: string | number;
  genre?: string;
  name?: string;
  title?: string;
  platform?: string;
  playTime?: string;
  hours?: number;
}

export interface GameHistory {
  pc: GamePlay[];
  mobile: GamePlay[];
  console: GamePlay[];
}

interface ResumeData {
  name: string;
  role: string;
  email: string;
  phone: string;
  summary: string;
  selfIntroduction?: string;
  selfIntroductions?: {
    logline: string;
    content: string;
  }[];
  education: {
    title: string;
    period: string;
    description: string;
    details: string[];
  }[];
  experience: {
    title: string;
    period: string;
    description: string;
    details: string[];
  }[];
  awards: {
    title: string;
    organization: string;
    year: string;
  }[];
}

// --- Mock Data ---
const GAME_HISTORY: GameHistory = {
  pc: [
    ALL_GAMES.find(g => g.title === '메이플스토리') || ALL_GAMES[0],
    ALL_GAMES.find(g => g.title.includes('리그 오브 레전드')) || ALL_GAMES[25],
    ALL_GAMES.find(g => g.title === '던전앤파이터') || ALL_GAMES[5],
  ],
  mobile: [
    { id: 1001, genre: "수집형 RPG", title: "원신", platform: "호요버스", playTime: "" },
    { id: 1002, genre: "방치형 RPG", title: "버섯커 키우기", platform: "조이 나이스 게임즈", playTime: "" },
    { id: 1003, genre: "전략", title: "명일방주", platform: "하이퍼그리프", playTime: "" },
  ],
  console: [
    { id: 2001, genre: "액션 어드벤처", title: "젤다의 전설: 야생의 숨결", platform: "닌텐도 스위치", playTime: "" },
    { id: 2002, genre: "액션 RPG", title: "엘든 링", platform: "PS5", playTime: "" },
    { id: 2003, genre: "액션 어드벤처", title: "갓 오브 워: 라그나로크", platform: "PS5", playTime: "" },
  ]
};

const RESUME_DATA: ResumeData = {
  name: "조경환",
  role: "Game Designer",
  email: "kh980624@naver.com",
  phone: "010-4826-6256",
  summary: "기획 의도를 알고, 그것을 관통하는 목차를 작성할 줄 아는 게임 기획자 지망생입니다. 법학에서 단련한 논리적 구조 설계 능력을 게임 기획에 그대로 적용합니다.",
  selfIntroductions: [
    {
      logline: "14년간 달려온 꿈을 포기하게 만든 계기는 메이플스토리입니다.",
      content: "사람을 돕고 싶어 법학과에 진학했습니다. 12시간 이상 공부하며 한계에 부딪힐 때마다 그 이유를 되뇌며 버텼습니다.\n\n그러나 달리면 달릴수록 외면할 수 없는 사실과 마주했습니다. **하고 싶은 것, 좋아하는 것, 잘하는 것은 다르다는 것을.**\n\n법학으로 사람을 돕고 싶었지만, 그것이 제가 좋아하는 일이 아니라는 사실을 마주한 순간 더 이상 법학을 공부할 수 없게 되었습니다.\n\n> 대학교 마지막 학기였습니다. 졸업을 앞두고도 방향을 찾지 못한 채, 반년을 \"나는 어떻게 살아가야 하는가?\"라는 질문 하나에 매달렸습니다. 제 인생에서 가장 깊게 몰입했던 순간이었습니다.\n\n그러던 중 홀린 듯이 찾아간 **메이플 콘 오프라인 행사**에서 답을 찾았습니다. 쇼케이스가 시작되자 동시에 터지는 환호, 가족들이 함께 웃는 표정.\n\n그 장면을 보며 문득 떠올랐습니다. 나도 게임을 할 때 저렇게 기뻤었다는 것을. 학업에 치여 제대로 하지 못했지만, **게임 앞에서만큼은 언제나 진심이었다는 것을. '나는 게임을 진짜 좋아했구나.'**\n\n그 자리에서 확신했습니다. 법학이 '-에서 0으로 되돌리는 일'이라면, 게임은 누군가의 하루를 움직이는 **'0에서 +가 되는 경험'**을 만든다는 것. 저도 누군가의 하루를 움직이는 사람이 되고 싶었습니다.\n\n법학을 공부하며 배운 것이 있습니다. 모든 제도는 입법 **'의도'**를 바탕으로 **'구조화'**되고, 사회라는 하나의 **'시스템'**으로 작동한다는 것입니다. 저는 이 원리가 게임 기획과 같다고 생각합니다.\n\n저는 그 **+를 설계하는 기획자**가 되겠습니다."
    },
    {
      logline: "저는 기획 의도를 알고, 그것을 관통하는 목차를 작성할 줄 아는 사람입니다.",
      content: "저는 원래 논리적인 사람이 아니었습니다. 문학을 좋아하는 감성적인 학생이었고, 그것이 법학과에서 가장 큰 벽이 되었습니다.\n\n대학교 2학년 형법 시험에서 C학점을 받았습니다. 교수님께 피드백을 받으러 찾아갔고, 교수님은 말없이 1등 학생의 답안을 보여주셨습니다.\n\n그 답안에서 **목차**가 눈에 들어왔습니다. 대전제에서 소전제로, 논리의 위계가 한눈에 보였고, 내용이 그 구조에 따라 자연스럽게 읽혔습니다.\n\n부끄러웠습니다. 제 답안에는 목차가 없었습니다. 그날부터 **목차를 작성하는 훈련**을 시작했습니다.\n\n21살부터 7년간 반복했습니다. 법학 답안은 **문제상황 → 학설 → 판례 → 검토** 순으로 전개됩니다.\n\n- 매 시험마다 **핵심 주장을 한 문장으로 정한 뒤**, 모든 항목이 그것을 관통하는지 반복해서 검증했습니다.\n- 주장이 흔들리면 목차 전체가 무너졌고, 목차가 흔들리면 답안 전체가 설득력을 잃었습니다. 그 실패를 반복하며 구조를 다듬었습니다.\n\n그 훈련의 결과가 졸업 논문이었습니다. 동기들이 자료를 먼저 뒤지고 본문부터 채워나갈 때, 저는 **목차를 먼저 완성**했습니다.\n\n탄탄한 목차가 완성된 뒤 본문 작성은 그 내용을 채우는 일에 불과했고, 동기들보다 빠르게 논문을 마쳤습니다. 결과는 **96점**이었습니다.\n\n**설득력 있는 주장은 논리가 아니라, 그 논리를 담는 구조에서 나옵니다.** 기획 의도를 알고 목차를 작성하는 능력은, 7년간의 실패가 만들어준 저의 핵심 역량입니다."
    },
    {
      logline: "기획 의도를 알고 목차를 작성하는 능력은 AI 프롬프트 설계에서도 빛납니다.",
      content: "팀 프로젝트를 진행하며 회의록 작성이 매번 작업 시간을 빼앗는 문제가 발생했습니다.\n\n저는 AI봇 설계 도구인 Eve를 활용해 **LLM 기반 회의록 자동화 봇**을 직접 설계했습니다. 회의록에 필요한 양식을 지식팩으로 구성한 뒤, 다음과 같은 순서로 **프롬프트 구조를 설계**했습니다:\n\n- **Role** (역할 등 부여)\n- **Goals** (목표 설정)\n- **Behaviors** (행동 지침)\n- **Output** (출력 형식)\n\n정해진 양식을 채우는 것에 그치지 않고, 회의 내용을 설명하면 그 의도를 파악해 맥락에 맞는 문서를 스스로 구성하도록 했습니다.\n\n두 개의 팀 프로젝트에 걸쳐 총 **20건 이상의 회의록**을 생성했습니다. 회의록 작성에 소요되던 시간을 **1시간에서 3분으로 단축**하여, 확보된 시간을 다른 핵심 작업에 활용할 수 있었습니다.\n\n이 과정에서 **프롬프트 엔지니어링이 목차 작성과 본질적으로 같은 원리**임을 알게 되었습니다. 이 논리 구조 설계 능력이 AI 설계에도 그대로 통한다는 것을 현장에서 검증했습니다."
    }
  ],
  education: [
    {
      title: "생성형 AI를 활용한 게임 기획자 과정",
      period: "2025.09 - 2026.04",
      description: "실무 중심의 게임 기획 프로세스 전반을 이수했습니다.",
      details: [
        "시스템 기획: 코어 루프 설계, 경제 시스템 및 밸런싱",
        "팀 프로젝트 3회 진행 (전 프로젝트 팀장)",
        "AI 봇 설계 도구 Eve를 활용한 회의록 자동화 시스템 구축"
      ]
    },
    {
      title: "숭실대학교 법학과",
      period: "2017.02 - 2025.08",
      description: "법학 답안 작성 훈련을 통해 기획 의도를 먼저 세우고 목차를 설계하는 능력을 단련했습니다.",
      details: [
        "'의무이행소송의 성립여부 및 실익 검토' 논문 95점"
      ]
    },
    {
      title: "Shanghai Singapore International School",
      period: "2010.09 - 2014.01",
      description: "중학교 과정 이수",
      details: []
    }
  ],
  experience: [
    {
      title: "도로시아 (스팀펑크 판타지 방치형 RPG)",
      period: "2026.02 - 2026.04",
      description: "팀장 | 핵앤슬래시 방치형 RPG 전투 및 경제 밸런스 총괄 기획",
      details: [
        "전투력 비중 산정(캐릭터 35%, 장비 45%) 등 게임 전체 파워 밸런스 설계",
        "기준 TTK(Time to Kill) 및 PDPS 기반의 스테이지, 몬스터, 장비 성장 지수(1.022배) 설계",
        "인플레이션 제어를 위한 4종 재화(골드, 스크랩 등) 순환 구조 및 방치 보상 밸런싱"
      ]
    },
    {
      title: "2D 탑뷰 던전 크롤러 로그라이트",
      period: "2025.12 - 2026.01",
      description: "팀장 | 잠입 액션 로그라이트 게임 전체 룰 및 시스템 설계",
      details: [
        "무기 교체 시스템, 맵 프리팹 구조, MVP 사이클 기획"
      ]
    },
    {
      title: "침묵의 저택 (메이플월드 호러게임)",
      period: "2025.11",
      description: "팀장 | 술래잡기 기반 생존 공포 게임 전체 룰 및 시스템 설계",
      details: [
        "유령 AI 행동 패턴, 시야 축소 메카닉, 아이템 획득 및 탈출 구조 기획",
        "플레이어-유령 충돌 처리, 오브젝트 상호작용 규칙 정의"
      ]
    }
  ],
  awards: [
    { title: "글로벌 인디 게임 제작 경진대회 기획 부문 우수상", organization: "한국콘텐츠진흥원", year: "2023" },
    { title: "게임 기획 부트캠프 최우수 프로젝트 선정", organization: "OO 교육기관", year: "2024" }
  ]
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "도로시아 (Dorothia)",
    category: "밸런스 기획",
    description: "핵앤슬래시 방치형 RPG의 전체 게임 밸런스(전투/경제 수치)를 총괄했습니다. 디테일한 PDPS 기반 파워 구조를 정립하고 게임의 성장 곡선을 면밀히 설계했습니다.",
    tags: ["밸런싱", "전투 밸런스", "수치 설계"],
    image: "./images/dorothia.png",
    color: "from-zinc-500/20 to-zinc-400/20",
    status: "구글플레이스토어 출시",
    content: `# 도로시아 (Dorothia) 밸런스 기획서

## 1. 기획 개요
핵앤슬래시 방치형 RPG의 성패를 좌우하는 전투 수치와 경제 수치의 전체 밸런스 구조를 설계했습니다.

## 2. 주요 설계 내용
### 2.1 파워 밸런스 모델링 
- 기초 전투력 기여도: 캐릭터(35%), 장비(45%)의 명확한 비중 설정
- 추가 화력: 스킬(최대 +400%) 및 그렘린(+40%)에 따른 TTK 단축 목표 부여
- 방어력 공식(100/100+방어력)을 통한 피해 적용률 및 EHP 산정

### 2.2 스테이지 템포 및 성장 곡선
- 목표 템포: 일반 몬스터 기준 TTK를 1.35초, 보스는 35초로 세팅
- 레벨 배율: 스테이지마다 기하급수적으로 늘어나는 경험치 / 1.022 지수 배율을 가진 장비 성장 곡선 기획

### 2.3 정밀한 경제/재화 밸런스
- 골드, 스크랩 등 4종 재화의 인플레이션 방어 메카닉과 명확한 소모처(Sink) 모델링
- 오프라인 방치 보상 밸런싱 최적화`
  },
  {
    id: 2,
    title: "Digreed",
    category: "룰 기획",
    description: "잠입 액션 로그라이트 게임의 전체 룰 및 시스템을 설계했습니다. 무기 교체 시스템과 맵 프리팹 구조를 기획했습니다.",
    tags: ["로그라이트", "잠입 액션", "시스템 기획"],
    image: "./images/digreed.png",
    color: "from-emerald-500/20 to-teal-500/20",
    status: "미출시",
    content: `# Digreed 시스템 기획서\n\n## 1. 코어 루프 설계\n로그라이트 특유의 반복되는 도전과 성장 요소를 체계화했습니다.\n\n## 2. 주요 시스템\n### 2.1 무기 교체 시스템\n- 상황에 따른 무기 교체가 생존에 필수적인 메카닉으로 작용하도록 설계\n\n### 2.2 맵 프리팹 구조\n- 절차적 생성의 한계를 보완하는 수동 프리팹 블록화 기획`
  },
  {
    id: 3,
    title: "침묵의 저택",
    category: "레벨 디자인 & AI",
    description: "메이플월드 플랫폼을 기반으로 한 술래잡기형 생존 공포 게임입니다. 유령 AI 행동 패턴과 시야 축소 메카닉을 기획했습니다.",
    tags: ["공포 생존", "메이플월드", "시스템 설계"],
    image: "./images/silence.png",
    color: "from-orange-500/20 to-zinc-500/20",
    status: "메이플월드 출시",
    content: `# 침묵의 저택 기획서\n\n## 1. 기획 의도\n메이플월드 플랫폼 특성을 활용해 긴장감 넘치는 술래잡기 생존 공포를 구현합니다.\n\n## 2. 주요 메카닉\n### 2.1 유령 AI 설계\n- 플레이어의 행동을 분석하여 추적하는 패턴 정의\n\n### 2.2 시야 축소 시스템\n- 공포감을 극대화하기 위해 조건부로 시야가 좁아지는 메카닉 기획\n\n### 2.3 상호작용 규칙\n- 공간 내 숨기, 아이템 획득 및 탈출 로직 기획`
  }
];

const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 101,
    title: "모바일 RPG 경제 시스템 밸런싱",
    category: "시스템 기획",
    description: "인게임 재화의 인플레이션을 방지하고 유저의 지속적인 플레이를 유도하는 경제 밸런싱 모델입니다.",
    tags: ["경제 시스템", "밸런싱", "엑셀"],
    image: "https://picsum.photos/seed/economy/800/600",
    color: "from-zinc-500/10 to-zinc-500/10",
    content: "# 경제 시스템 밸런싱 상세..."
  },
  {
    id: 102,
    title: "신규 캐릭터 전투 기획서",
    category: "전투 기획",
    description: "스팀펑크 세계관의 기계공 캐릭터 스킬 메커니즘 및 데미지 공식 기획서입니다.",
    tags: ["전투 기획", "스킬 디자인", "GDD"],
    image: "https://picsum.photos/seed/steampunk/800/600",
    color: "from-amber-500/10 to-orange-500/10",
    content: "# 캐릭터 전투 기획 상세..."
  },
  {
    id: 103,
    title: "매치3 퍼즐 레벨 디자인",
    category: "레벨 디자인",
    description: "난이도 곡선을 고려한 매치3 퍼즐 게임의 1~50 스테이지 레벨 디자인 문서입니다.",
    tags: ["레벨 디자인", "난이도 곡선", "퍼즐"],
    image: "https://picsum.photos/seed/puzzle/800/600",
    color: "from-emerald-500/10 to-teal-500/10",
    content: "# 레벨 디자인 상세..."
  },
  {
    id: 104,
    title: "퀘스트 스크립트 샘플",
    category: "내러티브",
    description: "다중 선택지에 따른 분기형 퀘스트 스크립트 및 대사 연출 가이드입니다.",
    tags: ["스크립트", "내러티브", "분기"],
    image: "https://picsum.photos/seed/book/800/600",
    color: "from-zinc-500/10 to-zinc-500/10",
    content: "# 퀘스트 스크립트 상세..."
  }
];

const SKILLS: Skill[] = [
  { name: "시스템 기획", level: 95, icon: <Cpu className="w-5 h-5" />, caption: "코어 루프 설계 및 모듈형 시스템 구조화" },
  { name: "경제 밸런싱", level: 90, icon: <ScrollText className="w-5 h-5" />, caption: "재화 인플레이션 제어 및 보상 루프 설계" },
  { name: "레벨 디자인", level: 85, icon: <Layers className="w-5 h-5" />, caption: "동선 설계, 기믹 배치 및 난이도 곡선 조정" },
  { name: "GDD 작성", level: 95, icon: <Target className="w-5 h-5" />, caption: "개발팀과의 협업을 위한 명확한 기획 문서화" },
  { name: "프로토타이핑", level: 80, icon: <Code2 className="w-5 h-5" />, caption: "엔진(UE5/Unity) 및 Figma를 활용한 검증" },
];

// --- Editable Content Hook (Supabase-backed) ---
const useEditableContent = (initialData: any, key: string) => {
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const { data: row, error } = await supabase
          .from('portfolio_content')
          .select('content')
          .eq('key', key)
          .maybeSingle();
        if (!error && row?.content) {
          setData(row.content);
        }
      } catch (e) {
        console.warn(`Supabase load failed for key "${key}", using defaults.`);
      } finally {
        setLoaded(true);
      }
    };
    loadFromSupabase();
  }, [key]);

  const saveToSupabase = useCallback(async (newData: any) => {
    try {
      await supabase
        .from('portfolio_content')
        .upsert({ key, content: newData }, { onConflict: 'key' });
    } catch (e) {
      console.error(`Supabase save failed for key "${key}":`, e);
    }
  }, [key]);

  const updateData = useCallback((newData: any) => {
    setData(newData);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveToSupabase(newData);
    }, 500);
  }, [saveToSupabase]);

  return [data, updateData, loaded];
};

// --- Components ---

const EditableText = ({ 
  value, 
  onSave, 
  isEditing, 
  className = "",
  multiline = false,
  markdown = false
}: { 
  value: string, 
  onSave: (v: string) => void, 
  isEditing: boolean, 
  className?: string,
  multiline?: boolean,
  markdown?: boolean
}) => {
  if (!isEditing) {
    if (markdown) {
      return (
        <div className={`markdown-body !text-inherit !p-0 !bg-transparent !border-none [&>p]:!mb-0 ${className}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
      );
    }
    return <span className={className}>{value}</span>;
  }

  const baseClasses = "bg-[#1a1a1a] border-[#2a2a2a] text-[#e8e4dc] focus:border-[#800020]";

  return multiline || markdown ? (
    <textarea
      className={`w-full max-w-full border rounded-lg p-3 focus:outline-none font-mono text-[13px] leading-relaxed resize-y ${markdown ? 'min-h-[120px]' : ''} ${baseClasses} ${className}`}
      value={value}
      onChange={(e) => onSave(e.target.value)}
      rows={Math.max(3, value.split('\n').length)}
      placeholder={markdown ? "마크다운 문법을 지원합니다 (*볼드*, - 리스트 등)" : ""}
    />
  ) : (
    <input
      className={`w-full max-w-full border rounded-lg px-2 py-1 focus:outline-none font-sans ${baseClasses} ${className}`}
      value={value}
      onChange={(e) => onSave(e.target.value)}
    />
  );
};

const PasswordModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (pw: string) => void }) => {
  const [password, setPassword] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#2a2a2a] p-8 max-w-sm w-full shadow-xl rounded-2xl">
        <h3 className="text-xl font-display font-bold text-[#e8e4dc] mb-4 tracking-tight">관리자 로그인</h3>
        <p className="text-[#888] text-sm mb-6">내용을 수정하려면 비밀번호를 입력하세요.</p>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(password); }}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] p-3 text-[#e8e4dc] focus:outline-none focus:border-[#800020] mb-6 font-mono rounded-lg"
          placeholder="••••"
          autoFocus
        />
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-[#888] font-medium hover:text-[#e8e4dc] transition-colors rounded-xl">취소</button>
          <button onClick={() => onConfirm(password)} className="flex-1 py-3 bg-[#800020] text-[#e8e4dc] font-bold hover:bg-[#9a0028] transition-colors rounded-xl">확인</button>
        </div>
      </div>
    </div>
  );
};

// --- Navbar (Premium Floating Pill Design - BOLD SCALED) ---
const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing, activeSection, theme, setTheme }: { setView: (v: 'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects' | 'game-history') => void, currentView: string, onNavClick: (id: string) => void, isEditing: boolean, setIsEditing: (v: boolean) => void, activeSection: string, theme: string, setTheme: (v: string) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onNavClick(id);
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isEditing) {
      setIsEditing(false);
      alert("관리자 모드가 비활성화되었습니다.");
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordConfirm = (pw: string) => {
    if (pw === '9806') {
      setIsEditing(true);
      setIsPasswordModalOpen(false);
      alert("관리자 모드가 활성화되었습니다. 내용을 클릭하여 수정하세요.");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const isDark = theme === 'dark';
  const navContainerClass = scrolledPastHero 
    ? 'py-4' 
    : 'py-8';
    
  const navBgClass = scrolledPastHero
    ? 'bg-white/85 dark:bg-[#0a0a0a]/85 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
    : 'bg-transparent border border-transparent';

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 transition-all duration-500 pointer-events-none print:hidden ${navContainerClass}`}>
        <nav className={`pointer-events-auto w-[98%] max-w-[1440px] rounded-full transition-all duration-500 flex items-center justify-between px-6 lg:px-10 py-3 lg:py-3.5 ${navBgClass}`}>
          
          {/* Left: Logo */}
          <div className="flex shrink-0 items-center gap-3 md:gap-4 cursor-pointer group" onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#800020] to-[#500014] text-white flex items-center justify-center font-display font-black tracking-tighter text-base md:text-lg shadow-lg shadow-[#800020]/30 transition-transform group-hover:scale-105">
              조
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display font-bold tracking-tight text-[16px] md:text-[18px] text-[#2C2C2C] dark:text-[#e8e4dc] group-hover:text-[#800020] transition-colors leading-none">조경환</span>
              <span className="text-[10px] md:text-[11px] font-mono tracking-widest uppercase text-zinc-500 dark:text-[#666] mt-1.5 leading-none hidden sm:block">Game Designer</span>
            </div>
            {isEditing && (
              <span className="ml-3 px-2 py-1 bg-[#800020]/10 border border-[#800020]/30 rounded text-[10px] text-[#800020] font-bold uppercase tracking-wider">
                Edit
              </span>
            )}
          </div>

          {/* Center: Anchor Links */}
          <div className="hidden lg:flex items-center justify-center gap-2 mx-6">
            {[
              { id: 'about', label: '소개', num: '01' },
              { id: 'projects', label: '프로젝트', num: '02' },
              { id: 'skills', label: '핵심역량', num: '03' },
              { id: 'play-history', label: '플레이 이력', num: '04' }
            ].map(({ id, label, num }) => (
              <a 
                key={id}
                href={`#${id}`}
                onClick={(e) => handleLinkClick(e, id)}
                className={`relative px-5 py-3 rounded-full text-[15px] font-bold transition-all flex items-center gap-2.5 group overflow-hidden ${activeSection === id ? 'text-[#800020] bg-[#800020]/5 dark:bg-[#800020]/10' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#2C2C2C] dark:hover:text-[#e8e4dc] hover:bg-zinc-100 dark:hover:bg-white/5'}`}
              >
                <span className={`text-[12px] font-mono uppercase tracking-widest transition-colors duration-300 ${activeSection === id ? 'text-[#800020]/70' : 'text-zinc-400'}`}>{num}</span>
                <span className="tracking-wide">{label}</span>
              </a>
            ))}
          </div>

          {/* Right: Utilities */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            <div className="hidden xl:flex bg-zinc-100/80 dark:bg-white/5 p-1.5 rounded-full border border-black/5 dark:border-white/5 shadow-inner">
              {[
                { key: 'resume', label: '이력서', icon: <FileText className="w-4 h-4" /> },
                { key: 'portfolio', label: '포트폴리오', icon: <FolderOpen className="w-4 h-4" /> },
                { key: 'game-history', label: '플레이 이력', icon: <Gamepad2 className="w-4 h-4" /> },
              ].map(item => (
                <button key={item.key} onClick={() => { setView(item.key as any); window.scrollTo(0,0); }} 
                  className={`px-5 py-2.5 rounded-full text-[14px] font-bold tracking-wide transition-all flex items-center gap-2 ${currentView === item.key ? 'bg-white dark:bg-[#222] text-[#800020] shadow-md' : 'text-zinc-500 hover:text-[#2C2C2C] dark:hover:text-[#e8e4dc]'}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="hidden xl:block w-px h-8 bg-black/10 dark:bg-white/10 mx-1.5"></div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-12 h-12 rounded-full transition-all flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-[#2C2C2C] dark:hover:text-white"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-[20px] h-[20px]" /> : <Moon className="w-[20px] h-[20px]" />}
              </button>
              <button 
                onClick={handleAdminClick}
                className="w-12 h-12 rounded-full transition-all flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-[#2C2C2C] dark:hover:text-white"
                title="Admin Mode"
              >
                <Lock className={`w-[18px] h-[18px] ${isEditing ? 'text-[#800020]' : 'opacity-80'}`} />
              </button>
              
              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-white/5 text-[#2C2C2C] dark:text-[#e8e4dc] ml-1">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/95 flex items-center justify-center pt-20 pb-10"
          >
            <div className="w-[90%] max-w-md bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col gap-8 max-h-[90vh] overflow-y-auto">
              
              {/* Document Nav Inside Mobile */}
              <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Documents</span>
                {[
                  { key: 'resume', label: '이력서 보기', icon: <FileText className="w-4 h-4" /> },
                  { key: 'portfolio', label: '포트폴리오 갤러리', icon: <FolderOpen className="w-4 h-4" /> },
                  { key: 'game-history', label: '플레이 이력 보기', icon: <Gamepad2 className="w-4 h-4" /> },
                ].map(item => (
                  <button key={item.key} onClick={() => { setView(item.key as any); setIsMenuOpen(false); window.scrollTo(0,0); }} 
                    className={`text-left font-bold text-[14px] flex items-center gap-3 p-3 rounded-xl transition-colors ${currentView === item.key ? 'bg-white dark:bg-[#222] text-[#800020] shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-[#222] hover:text-[#2C2C2C] dark:hover:text-white'}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>

              {/* Anchor Nav Inside Mobile */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 px-4 mb-1">Navigation</span>
                {[
                  { id: 'about', label: '소개', num: '01' },
                  { id: 'projects', label: '프로젝트', num: '02' },
                  { id: 'skills', label: '핵심역량', num: '03' },
                  { id: 'contact', label: '문의하기', num: '04' } /* Optional info link added per current structure */
                ].map(({ id, label, num }) => (
                  <a key={id} href={`#${id}`} onClick={(e) => handleLinkClick(e, id)}
                    className="group relative font-bold flex items-center gap-4 py-3 px-4 rounded-xl text-[#2C2C2C] dark:text-[#e8e4dc] hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-xs font-mono opacity-40 text-zinc-500 group-hover:text-[#800020] transition-colors">{num}</span>
                    <span className="text-base tracking-wide">{label}</span>
                  </a>
                ))}
              </div>
              
              {/* Close Button Bottom */}
              <button onClick={() => setIsMenuOpen(false)} className="mt-auto w-full py-4 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">
                닫기 <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isPasswordModalOpen && (
        <PasswordModal isOpen={isPasswordModalOpen} onConfirm={handlePasswordConfirm} onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </>
  );
};

// --- Hero ---
const Hero = ({ onPortfolioClick, onResumeClick, isEditing, content, setContent }: { onPortfolioClick: () => void, onResumeClick: () => void, isEditing: boolean, content: any, setContent: (c: any) => void }) => (
  <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-12 py-[120px] overflow-hidden bg-transparent border-b border-black/10 dark:border-[#1e1e1e] transition-colors duration-500">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="z-10 text-center max-w-5xl relative w-full mx-auto flex flex-col items-center pb-24"
    >
      <h1 className="mb-10 flex flex-col items-center gap-3">
        <div className="text-xl md:text-2xl lg:text-3xl font-display font-medium text-zinc-500 dark:text-zinc-400 tracking-tight transition-colors">
          <EditableText value={content.titleLine1 || "기획의도를 알고"} onSave={(v) => setContent({...content, titleLine1: v})} isEditing={isEditing} />
        </div>
        <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-[#2C2C2C] dark:text-[#e8e4dc] tracking-[-0.04em] leading-[1.1] break-keep drop-shadow-sm transition-colors">
          <EditableText value={content.titleLine2 || "목차를 쓸줄 아는 기획자"} onSave={(v) => setContent({...content, titleLine2: v})} isEditing={isEditing} />
        </div>
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto transition-colors">
        <EditableText value={content.description} onSave={(v) => setContent({...content, description: v})} isEditing={isEditing} multiline />
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <motion.button 
          whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
          onClick={onResumeClick}
          className="px-10 py-5 bg-[#800020] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#a10028] transition-all duration-500 text-sm tracking-widest w-full sm:w-auto rounded-full uppercase shadow-lg shadow-[#800020]/20 hover:shadow-xl"
        >
          이력서 보기 <ChevronRight className="w-4 h-4" />
        </motion.button>
        <motion.button 
          whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
          onClick={onPortfolioClick}
          className="px-10 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-[#e8e4dc] font-bold hover:border-zinc-300 hover:text-[#2C2C2C] hover:bg-zinc-50 dark:hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-3 text-sm tracking-widest w-full sm:w-auto rounded-full uppercase shadow-sm dark:shadow-none hover:shadow-md"
        >
          포트폴리오 보기 <ArrowUpRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-16 flex flex-col items-center gap-4">
      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Scroll to explore</span>
      <div className="w-[1px] h-16 bg-zinc-200 dark:bg-white/10 relative overflow-hidden transition-colors">
        <motion.div animate={{ y: [-64, 64] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute top-0 left-0 w-full h-1/2 bg-[#800020]" />
      </div>
    </motion.div>
  </section>
);

// --- About ---
const About = ({ isEditing, content, setContent }: { isEditing: boolean, content: any, setContent: (c: any) => void }) => (
  <section id="about" className="scroll-mt-20 py-[120px] px-6 md:px-12 relative border-t border-black/5 min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    
    <div className="max-w-5xl mx-auto w-full relative z-10">
      <div className="text-center mb-16">
        <span className="text-[#800020] font-mono text-xs uppercase tracking-[0.25em] font-bold mb-6 block">01. About</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-[-0.03em] text-[#2C2C2C] leading-[1.15] mb-10">
          <EditableText value={content.title || "안녕하세요."} onSave={(v) => setContent({...content, title: v})} isEditing={isEditing} />
        </h2>
        <div className="space-y-5 text-zinc-600 font-normal text-base md:text-lg leading-[1.85] max-w-2xl mx-auto">
          <p><EditableText value={content.p1} onSave={(v) => setContent({...content, p1: v})} isEditing={isEditing} multiline /></p>
          <p><EditableText value={content.p2} onSave={(v) => setContent({...content, p2: v})} isEditing={isEditing} multiline /></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {content.stats.slice(0, 3).map((stat: any, idx: number) => (
          <div key={idx} className="group flex flex-col items-center justify-center gap-2 bg-[#F6F6F3] border border-black/5 rounded-3xl p-10 hover:border-[#800020]/20 hover:shadow-md hover:-translate-y-1 transition-all duration-500">
            <div className="text-5xl font-display font-bold text-[#2C2C2C] tracking-tighter group-hover:text-[#800020] transition-colors">
              <EditableText value={stat.value} onSave={(v) => { const s = [...content.stats]; s[idx].value = v; setContent({...content, stats: s}); }} isEditing={isEditing} />
            </div>
            <div className="text-sm font-bold text-zinc-500 tracking-widest uppercase">
              <EditableText value={stat.label} onSave={(v) => { const s = [...content.stats]; s[idx].label = v; setContent({...content, stats: s}); }} isEditing={isEditing} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- ProjectCard ---
const ProjectCard = ({ project, idx, isEditing, projects, setProjects, onProjectClick, layout = 'default' }: { project: Project, idx: number, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, onProjectClick: (p: Project) => void, layout?: 'default' | 'featured' | 'supporting' | 'accordion-active' | 'accordion-inactive' }) => {
  const isActive = layout === 'accordion-active';
  const isInactive = layout === 'accordion-inactive';
  
  if (isActive || isInactive) {
    return (
      <div className="relative w-full h-full flex flex-col justify-end p-6 lg:p-8">
        <div className={`absolute inset-0 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'} transition-opacity duration-500`}>
          <img src={project.image} alt={project.title} className={`w-full h-full object-cover ${isInactive ? 'object-top' : ''}`} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>
        
        {isEditing && (
          <button onClick={(e) => { e.stopPropagation(); if (confirm("이 프로젝트를 삭제하시겠습니까?")) { setProjects(projects.filter(p => p.id !== project.id)); }}}
            className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg" title="삭제">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className={`relative z-10 transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 lg:opacity-100 lg:translate-y-0'}`}>
          <div className={`flex gap-2 mb-4 ${isActive ? 'flex-wrap items-center' : 'flex-col items-start'}`}>
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-sans font-bold text-[#2C2C2C] tracking-tight rounded-md w-fit">
              <EditableText value={project.category} onSave={(v) => { const p = [...projects]; p[idx].category = v; setProjects(p); }} isEditing={isEditing} />
            </div>
            {project.status && (
              <div className={`px-3 py-1.5 text-[11px] font-sans font-bold tracking-tight rounded-md w-fit border backdrop-blur-sm ${project.status === '미출시' ? 'bg-zinc-800/80 text-zinc-300 border-zinc-600' : 'bg-[#800020] text-white border-[#800020] shadow-lg shadow-[#800020]/30'}`}>
                <EditableText value={project.status} onSave={(v) => { const p = [...projects]; p[idx].status = v; setProjects(p); }} isEditing={isEditing} />
              </div>
            )}
          </div>
          <h3 className={`font-bold text-white mb-2 ${isActive ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'} line-clamp-2`}>
            <EditableText value={project.title} onSave={(v) => { const p = [...projects]; p[idx].title = v; setProjects(p); }} isEditing={isEditing} />
          </h3>
          
          {isActive && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
              <p className="text-zinc-300 line-clamp-2 mb-6 text-sm lg:text-base">
                <EditableText value={project.description} onSave={(v) => { const p = [...projects]; p[idx].description = v; setProjects(p); }} isEditing={isEditing} multiline />
              </p>
              <button onClick={(e) => { e.stopPropagation(); onProjectClick(project); }}
                className="px-6 py-3 bg-white text-[#2C2C2C] font-bold text-xs tracking-widest hover:bg-[#800020] hover:text-white transition-colors flex items-center gap-2 rounded-full uppercase w-fit">
                기획서 보기 <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="group relative bg-white border border-black/5 rounded-2xl overflow-hidden hover:border-black/10 hover:shadow-lg transition-all duration-500 flex flex-col">
      {isEditing && (
        <button onClick={(e) => { e.stopPropagation(); if (confirm("삭제하시겠습니까?")) { setProjects(projects.filter(p => p.id !== project.id)); }}}
          className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg" title="삭제">
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="overflow-hidden relative bg-zinc-100 shrink-0 aspect-[16/10] border-b border-black/5">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0" referrerPolicy="no-referrer" />
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <div className="bg-white/90 backdrop-blur-sm border border-black/10 rounded-md px-3 py-1.5 text-[11px] font-sans font-bold text-[#2C2C2C] tracking-tight shadow-sm w-fit">
            <EditableText value={project.category} onSave={(v) => { const p = [...projects]; p[idx].category = v; setProjects(p); }} isEditing={isEditing} />
          </div>
          {project.status && (
            <div className={`border rounded-md px-3 py-1.5 text-[11px] font-sans font-bold tracking-tight shadow-sm w-fit backdrop-blur-sm ${project.status === '미출시' ? 'bg-zinc-100/90 text-zinc-500 border-zinc-200' : 'bg-[#800020] text-white border-[#800020] shadow-md shadow-[#800020]/20'}`}>
              <EditableText value={project.status} onSave={(v) => { const p = [...projects]; p[idx].status = v; setProjects(p); }} isEditing={isEditing} />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between p-8">
        <div>
          <h3 className="text-xl font-bold mb-3 text-[#2C2C2C] group-hover:text-[#800020] transition-colors line-clamp-1">
            <EditableText value={project.title} onSave={(v) => { const p = [...projects]; p[idx].title = v; setProjects(p); }} isEditing={isEditing} />
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2">
            <EditableText value={project.description} onSave={(v) => { const p = [...projects]; p[idx].description = v; setProjects(p); }} isEditing={isEditing} multiline />
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.slice(0, 3).map((tag, tagIdx) => (
              <span key={tagIdx} className="text-[10px] font-sans font-bold px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-500 flex items-center gap-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onProjectClick(project); }}
          className="w-full relative overflow-hidden group/btn py-4 bg-white border border-black/10 text-[#2C2C2C] font-bold text-xs tracking-widest transition-all duration-500 flex items-center justify-center gap-2 uppercase rounded-xl hover:shadow-[0_4px_16px_rgba(128,0,32,0.15)] hover:border-[#800020]">
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-white">기획서 보기 <ArrowRight className="w-4 h-4" /></span>
          <div className="absolute inset-0 bg-[#800020] scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-500" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Projects ---
const Projects = ({ onProjectClick, isEditing, projects, setProjects, limit, setView }: { onProjectClick: (p: Project) => void, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, limit?: number, setView?: (v: any) => void }) => {
  const [featuredId, setFeaturedId] = useState<number | null>(null);
  const actualFeaturedId = featuredId || (projects[0] ? projects[0].id : null);
  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="projects" className="scroll-mt-20 py-[120px] px-6 md:px-12 relative min-h-screen flex flex-col items-center justify-center bg-[#F6F6F3] overflow-hidden border-t border-black/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-20">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[#800020] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-6 block">02. Projects</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-[-0.03em] text-[#2C2C2C] leading-tight mb-8">주요 프로젝트.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-[1.9]">
            시스템 기획 및 레벨 디자인, 프로토타입 개발 결과물입니다.
          </motion.p>
        </div>

        {limit ? (
          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px]">
            {displayedProjects.map((project, idx) => {
              const isActive = project.id === actualFeaturedId;
              return (
                <motion.div key={project.id} layout onClick={() => setFeaturedId(project.id)}
                  className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 ease-in-out border border-black/5 hover:border-black/10 shadow-sm hover:shadow-lg flex flex-col bg-white ${
                    isActive ? 'lg:grow-[3] lg:basis-0 h-[500px] lg:h-full' : 'lg:grow-[1] lg:basis-0 h-[150px] lg:h-full'
                  }`}>
                  <ProjectCard project={project} idx={idx} isEditing={isEditing} projects={projects} setProjects={setProjects} onProjectClick={onProjectClick} layout={isActive ? 'accordion-active' : 'accordion-inactive'} />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} idx={idx} isEditing={isEditing} projects={projects} setProjects={setProjects} onProjectClick={onProjectClick} layout="default" />
            ))}
          </div>
        )}

        {limit && setView && (
          <div className="mt-20 text-center">
            <button onClick={() => setView('portfolio')}
              className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-white border border-black/10 text-[#2C2C2C] font-bold tracking-widest text-sm rounded-full uppercase overflow-hidden shadow-sm transition-all duration-500 hover:shadow-[0_8px_24px_rgba(128,0,32,0.15)] hover:-translate-y-1 hover:border-[#800020]">
              <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-white">
                전체 포트폴리오 보기 <ArrowRight className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-[#800020] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Portfolio ---
const Portfolio = ({ onProjectClick, isEditing, projects, setProjects, setView }: { onProjectClick: (p: Project) => void, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, setView: (v: any) => void }) => {
  const categories = Array.from(new Set(projects.map(p => p.category)));
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-[160px] pb-[120px] px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <button onClick={() => setView('home')} className="flex items-center gap-2 text-zinc-500 hover:text-[#800020] transition-colors mb-6 group font-sans tracking-tight text-sm uppercase font-bold">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Home
          </button>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-zinc-400 font-mono text-sm uppercase tracking-widest font-bold">DOC. 02</span>
            <div className="w-12 h-px bg-zinc-300"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tighter text-[#2C2C2C] leading-tight">포트폴리오 갤러리.</h2>
        </div>
      </div>
      <div className="space-y-24">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-[#2C2C2C] border-b border-black/5 pb-4">
              <FileText className="w-5 h-5 text-[#800020]" /> {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.category === category).map((project, idx) => (
                <motion.div key={project.id} whileHover={{ y: -4 }} className="group relative flex flex-col bg-white border border-black/5 rounded-xl overflow-hidden hover:border-black/10 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden relative border-b border-black/5 bg-zinc-100">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                    {project.status && (
                      <div className={`absolute top-4 left-4 border rounded-md px-3 py-1 text-[10px] font-sans font-bold tracking-tight shadow-sm ${project.status === '미출시' ? 'bg-zinc-100/90 text-zinc-500 border-zinc-200' : 'bg-[#800020]/90 text-white border-[#800020]'}`}>
                        <EditableText value={project.status} onSave={(v) => { const p = [...projects]; const i = p.findIndex(pp => pp.id === project.id); p[i].status = v; setProjects(p); }} isEditing={isEditing} />
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-xl font-bold mb-3 text-[#2C2C2C] group-hover:text-[#800020] transition-colors">
                      <EditableText value={project.title} onSave={(v) => { const p = [...projects]; const i = p.findIndex(pp => pp.id === project.id); p[i].title = v; setProjects(p); }} isEditing={isEditing} />
                    </h4>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1">
                      <EditableText value={project.description} onSave={(v) => { const p = [...projects]; const i = p.findIndex(pp => pp.id === project.id); p[i].description = v; setProjects(p); }} isEditing={isEditing} multiline />
                    </p>
                    <button onClick={() => onProjectClick(project)}
                      className="w-full py-4 bg-white border border-black/10 text-[#2C2C2C] font-bold text-xs tracking-widest hover:border-[#800020] hover:text-[#800020] transition-colors flex items-center justify-center gap-2 uppercase rounded-xl">
                      자세히 보기 <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

// --- ICON_OPTIONS ---
const ICON_OPTIONS = [
  { name: 'Cpu', icon: <Cpu className="w-5 h-5" /> },
  { name: 'Layers', icon: <Layers className="w-5 h-5" /> },
  { name: 'ScrollText', icon: <ScrollText className="w-5 h-5" /> },
  { name: 'Target', icon: <Target className="w-5 h-5" /> },
  { name: 'Code2', icon: <Code2 className="w-5 h-5" /> },
  { name: 'Zap', icon: <Zap className="w-5 h-5" /> },
  { name: 'Monitor', icon: <Monitor className="w-5 h-5" /> },
  { name: 'Smartphone', icon: <Smartphone className="w-5 h-5" /> },
  { name: 'Gamepad2', icon: <Sparkles className="w-5 h-5" /> },
  { name: 'Wrench', icon: <Wrench className="w-5 h-5" /> }
];

// --- Skills ---
const Skills = ({ isEditing, skills, setSkills }: { isEditing: boolean, skills: Skill[], setSkills: (s: Skill[]) => void }) => {
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);

  return (
    <section id="skills" className="scroll-mt-20 py-[120px] px-6 md:px-12 relative min-h-screen flex flex-col items-center justify-center bg-[#F6F6F3] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-20">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[#800020] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-6 block">03. Skills</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-[-0.03em] text-[#2C2C2C] leading-tight mb-8">핵심 역량.</motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className="relative group/skill flex flex-col gap-6 bg-white border border-black/5 rounded-2xl p-8 hover:border-black/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              {/* Card top edge glow (light version) */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.03] to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover/skill:w-1/2 h-px bg-gradient-to-r from-transparent via-[#800020]/30 to-transparent transition-all duration-700" />
              {isEditing && (
                <button onClick={() => { const s = [...skills]; s.splice(idx, 1); setSkills(s); }}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm z-10" title="삭제">
                  <X className="w-3 h-3" />
                </button>
              )}
              
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#2C2C2C] shrink-0 border border-black/5 group-hover/skill:bg-[#800020] group-hover/skill:border-[#800020] group-hover/skill:text-white transition-colors duration-500`}>
                  {skill.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#2C2C2C] truncate">
                    <EditableText value={skill.name} onSave={(v) => { const s = [...skills]; s[idx].name = v; setSkills(s); }} isEditing={isEditing} />
                  </h3>
                  <p className="text-sm font-medium text-zinc-500 mt-1 truncate">
                    <EditableText value={skill.caption || ""} onSave={(v) => { const s = [...skills]; s[idx].caption = v; setSkills(s); }} isEditing={isEditing} />
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-400 tracking-[0.2em] uppercase">Proficiency</span>
                  <span className="text-sm font-bold text-[#2C2C2C] group-hover/skill:text-[#800020] transition-colors duration-500">{skill.level}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden relative border border-black/[0.03]">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-zinc-300 to-zinc-400 group-hover/skill:from-[#800020] group-hover/skill:to-[#c80032] transition-colors duration-500 rounded-full group-hover/skill:shadow-[0_0_8px_rgba(128,0,32,0.3)]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- PlayHistory ---
const PlayHistory = ({ isEditing, history, setHistory, onViewAll }: { isEditing: boolean, history: GameHistory, setHistory: (h: GameHistory) => void, onViewAll: () => void }) => {
  const renderCategory = (title: string, icon: React.ReactNode, dataKey: keyof GameHistory) => {
    const items = history[dataKey] || [];
    const displayItems = items.slice(0, 3);
    const hiddenCount = items.length - 3;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="group flex flex-col bg-[#F6F6F3] border border-black/5 rounded-2xl p-8 hover:border-[#800020]/20 hover:-translate-y-2 transition-all duration-500 h-full relative overflow-hidden shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.03] to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-px bg-gradient-to-r from-transparent via-[#800020]/30 to-transparent transition-all duration-700" />
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5 relative z-10">
          <div className="flex items-center gap-4 text-[#2C2C2C]">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2C2C2C] border border-black/5 group-hover:bg-[#800020] group-hover:border-[#800020] group-hover:text-white transition-all duration-500 shadow-sm">
              {icon}
            </div>
            <span className="font-bold tracking-tight text-xl group-hover:text-[#800020] transition-colors duration-500">{title}</span>
          </div>
          {isEditing && (
            <button onClick={() => { const h = {...history}; h[dataKey].push({ id: Date.now().toString(), name: "새 항목", hours: 0 }); setHistory(h); }}
              className="p-2 bg-white border border-black/10 text-zinc-500 hover:bg-zinc-50 transition-colors rounded-full">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-6 flex-1">
          {displayItems.map((game, idx) => (
            <div key={game.id} className="group/item flex flex-col gap-1 p-3 -mx-3 rounded-2xl hover:bg-white transition-colors relative shadow-transparent hover:shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                {isEditing && (
                  <button onClick={() => { const h = {...history}; h[dataKey].splice(idx, 1); setHistory(h); }} className="absolute -left-4 text-zinc-400 hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="px-2 py-0.5 bg-[#800020]/10 text-[#800020] rounded-sm text-[10px] font-bold tracking-widest">{game.genre}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#2C2C2C] font-bold text-lg truncate">
                  <EditableText value={game.title || ""} onSave={(v) => { const h = {...history}; h[dataKey][idx].title = v; setHistory(h); }} isEditing={isEditing} />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-xs mt-0.5">
                <Gamepad2 className="w-3.5 h-3.5" /> 
                <span className="flex items-center">
                  <EditableText value={game.platform || ""} onSave={(v) => { const h = {...history}; h[dataKey][idx].platform = v; setHistory(h); }} isEditing={isEditing} />
                  {game.playTime && <span className="ml-2 pl-2 border-l border-zinc-300 text-zinc-500">{game.playTime}</span>}
                </span>
              </div>
            </div>
          ))}
          {hiddenCount > 0 && !isEditing && (
            <div className="pt-4 mt-4 border-t border-dashed border-black/10 text-center">
              <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">+ {hiddenCount} More Entries</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section id="play-history" className="scroll-mt-20 py-[120px] px-6 md:px-12 relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden border-t border-black/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-20">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[#800020] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-6 block">04. Play History</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-[-0.03em] text-[#2C2C2C] leading-tight mb-8">게임 플레이 이력.</motion.h2>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-8">
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-[1.9]">
              다양한 장르와 플랫폼을 아우르는 게임 플레이 경험이 <br className="hidden md:block" />
              폭넓은 시야와 차별화된 레벨 디자인의 밑거름이 됩니다.
            </p>
            {!isEditing && (
              <button onClick={onViewAll}
                className="group relative px-8 py-4 bg-white text-zinc-600 rounded-full text-xs font-bold tracking-widest uppercase border border-black/10 hover:border-[#800020] transition-all duration-500 overflow-hidden flex items-center gap-3">
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500">
                  전체 플레이 이력 보기 <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-[#800020] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
              </button>
            )}
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {renderCategory("PC / 메인라인", <Monitor className="w-6 h-6" />, "pc")}
          {renderCategory("모바일 / 휴대용", <Smartphone className="w-6 h-6" />, "mobile")}
          {renderCategory("콘솔 / 패키지", <Gamepad2 className="w-6 h-6" />, "console")}
        </div>
      </div>
    </section>
  );
};

const TOOL_ICONS: Record<string, React.ReactNode> = {
  Word: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-80 group-hover:opacity-100 group-hover:text-[#2b579a] transition-colors"><path d="M4.17 6.43l7.33-1.07v13.28l-7.33-1.07V6.43zm8.33-1.25V18.82l7.33 1.07V4.11L12.5 5.18zM6.5 8.79l1.19.12.8 4.23.95-4.23h1.05l.93 4.23.77-4.23 1.25.12-1.39 6.27h-1.12l-.98-4.32-.98 4.32H8l-1.5-6.51z"/></svg>,
  Powerpoint: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-80 group-hover:opacity-100 group-hover:text-[#d24726] transition-colors"><path d="M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zM8.38 8.81h2.24c1.17 0 1.95.73 1.95 1.83 0 1.1-.78 1.83-1.95 1.83H9.4v3.23H8.38V8.81zm1.02.83v2.09h1.16c.55 0 .9-.36.9-.99 0-.64-.35-1.1-.9-1.1H9.4z"/></svg>,
  Excel: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-80 group-hover:opacity-100 group-hover:text-[#217346] transition-colors"><path d="M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zm-5.74 3.73l1.14.15.82 2.37.89-2.37h1.02l-1.36 3.19 1.48 3.32h-1.14l-1.01-2.43-1 2.43H6.42l1.52-3.32-1.42-3.34z"/></svg>,
  Notion: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-80 group-hover:opacity-100 transition-colors"><path d="M4.459 4.208c-.755 0-1.282.49-1.282 1.17v13.244c0 .679.527 1.17 1.282 1.17h15.082c.755 0 1.282-.491 1.282-1.17V5.378c0-.68-.527-1.17-1.282-1.17H4.459zM2.8 5.378c0-1.27 1.013-2.301 2.261-2.301h13.878C20.187 3.077 21.2 4.108 21.2 5.378v13.244c0 1.27-1.013 2.301-2.261 2.301H5.06A2.28 2.28 0 012.8 18.622V5.378zm5.553 10.603V8.895l4.896 6.945V8.125h1.196v7.856l-4.896-6.945v6.945H8.353z"/></svg>,
  Figma: <Figma className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 group-hover:text-[#f24e1e] transition-colors" />,
  Unity: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-80 group-hover:opacity-100 transition-colors"><path d="M12 1.41l10.59 6.1v12.2L12 25.82 1.41 19.71V7.51zM12 3.8L3.8 8.53v9.42l8.2 4.71 8.2-4.71V8.53zM12 12.35l7-4.04-1.26-2.18-5.38 3.1-6.19-4.88-1.56 1.94 4.86 3.82-4.48 2.58L6.2 14.8l5.8-3.35z"/></svg>,
  Git: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-80 group-hover:opacity-100 group-hover:text-[#f14e32] transition-colors"><path d="M23.546 10.93L13.067.452a1.43 1.43 0 00-2.022 0L8.52 2.977l3.208 3.208c.523-.211 1.137-.101 1.554.316.51.51.602 1.28.261 1.884l3.111 3.111c.603-.341 1.373-.249 1.884.261s.602 1.28.261 1.884l1.378 1.378a1.393 1.393 0 011.83-.263c.692.692.692 1.815 0 2.507-.692.692-1.815.692-2.507 0a1.393 1.393 0 01-.263-1.83l-1.378-1.378c-.604.341-1.374.249-1.884-.261-.417-.417-.527-1.031-.316-1.554l-3.111-3.111c-.604.341-1.374.249-1.884-.261-.51-.51-.602-1.28-.261-1.884l-3.208-3.208-5.508 5.508a1.43 1.43 0 000 2.022l10.478 10.478a1.43 1.43 0 002.022 0l7.51-7.51a1.43 1.43 0 000-2.022zM10.158 9.387c-.692.692-1.815.692-2.507 0s-.692-1.815 0-2.507c.692-.692 1.815-.692 2.507 0s.692 1.815 0 2.507z"/></svg>
};

// --- Resume ---
interface ResumeProps {
  setView: (v: 'home' | 'resume' | 'project-detail') => void;
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

const Resume = ({ setView, isEditing, data, setData }: ResumeProps) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!printRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const element = printRef.current;
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `${data.name || '이력서'}_이력서.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'], before: '.pdf-page-break' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-12 md:pt-[160px] md:pb-20 px-6 md:px-12 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-zinc-500 hover:text-[#800020] transition-colors group font-sans tracking-tight text-sm">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> RETURN TO HOME
        </button>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleDownload}
          disabled={isGeneratingPdf}
          className="px-8 py-4 bg-white border border-black/10 rounded-xl text-[#2C2C2C] font-bold flex items-center justify-center gap-3 hover:border-[#800020] hover:text-[#800020] transition-all duration-300 text-sm tracking-widest shadow-sm w-full sm:w-auto disabled:opacity-50">
          {isGeneratingPdf ? (
            <><span className="animate-spin inline-block w-4 h-4 border-2 border-[#800020] border-t-transparent rounded-full" /> PDF 생성 중...
            </>
          ) : (
            <><ScrollText className="w-4 h-4 text-[#800020]" /> PDF 다운로드</>
          )}
        </motion.button>
      </div>

      {/* --- SINGLE COLUMN LAYOUT --- */}
      <div className="max-w-[800px] mx-auto w-full space-y-20 print:space-y-16">
        
        {/* 1. HERO PROFILE */}
        <div className="flex flex-col items-center text-center border-b border-black/10 dark:border-[#1e1e1e] pb-16">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden mb-6 mx-auto border-4 border-white dark:border-[#111] shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <img src="https://picsum.photos/seed/profile/400/400" alt="Profile" className="w-full h-full object-cover grayscale opacity-90" />
          </div>
          <h1 className="text-4xl md:text-5xl print:text-4xl font-display font-black text-[#2C2C2C] dark:text-[#e8e4dc] tracking-tight mb-3">
            <EditableText value={data.name} onSave={(v) => setData({...data, name: v})} isEditing={isEditing} />
          </h1>
          <p className="text-[#800020] font-bold mb-6 font-mono tracking-[0.2em] text-sm md:text-[15px] uppercase">
            <EditableText value={data.role} onSave={(v) => setData({...data, role: v})} isEditing={isEditing} />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-2 text-[15px] text-zinc-600 dark:text-[#888] font-medium">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span><EditableText value={data.email} onSave={(v) => setData({...data, email: v})} isEditing={isEditing} /></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400" />
              <span><EditableText value={data.phone} onSave={(v) => setData({...data, phone: v})} isEditing={isEditing} /></span>
            </div>
          </div>
        </div>

        {/* 2. SUMMARY */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold text-zinc-400 dark:text-[#555] tracking-widest uppercase flex items-center gap-2 justify-center md:justify-start"><User className="w-4 h-4 text-[#800020]" /> 소개</h3>
          <div className="text-[#2C2C2C] dark:text-[#888] leading-[2.2] font-medium text-[16px] md:text-[17px] text-justify md:text-left">
            <EditableText value={data.summary} onSave={(v) => setData({...data, summary: v})} isEditing={isEditing} markdown={true} />
          </div>
        </section>

        {/* 3. SKILLS & COMPETENCIES */}
        <section className="grid md:grid-cols-2 gap-12 print:gap-8 border-y border-black/5 dark:border-[#1e1e1e] py-12">
          {/* Tech Stack */}
          <div>
            <h3 className="text-xs font-bold text-[#800020] tracking-widest uppercase mb-6 flex items-center gap-2"><Wrench className="w-4 h-4" /> 기술 스택</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold text-zinc-400 dark:text-[#666] uppercase mb-3">기획 및 문서화</p>
                <div className="flex flex-wrap gap-2">
                  {['Word', 'Powerpoint', 'Excel', 'Notion', 'Figma'].map(tool => (
                    <span key={tool} className="px-3 py-1.5 bg-zinc-50 dark:bg-white/5 rounded-md text-[12px] font-bold text-zinc-700 dark:text-[#aaa] border border-black/5 dark:border-[#2a2a2a] flex items-center gap-2">
                      {TOOL_ICONS[tool]}
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-400 dark:text-[#666] uppercase mb-3">엔진 및 개발</p>
                <div className="flex flex-wrap gap-2">
                  {['Unity', 'Git'].map(tool => (
                    <span key={tool} className="px-3 py-1.5 bg-zinc-50 dark:bg-white/5 rounded-md text-[12px] font-bold text-zinc-700 dark:text-[#aaa] border border-black/5 dark:border-[#2a2a2a] flex items-center gap-2">
                      {TOOL_ICONS[tool]}
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Core Competencies */}
          <div>
            <h3 className="text-xs font-bold text-[#800020] tracking-widest uppercase mb-6 flex items-center gap-2"><Zap className="w-4 h-4" /> 핵심 역량</h3>
            <ul className="space-y-4 text-[15px] text-zinc-700 dark:text-[#888] font-medium leading-relaxed">
              {["기획 의도를 먼저 세우고 목차로 증명하는 문서 설계", "법학적 사고 기반 시스템 정합성 확보", "AI 프롬프트 설계를 통한 업무 자동화"].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-[#444] mt-2.5 shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. EXPERIENCE */}
        <section>
          <h3 className="text-sm font-bold text-zinc-400 dark:text-[#555] tracking-widest uppercase mb-10 flex items-center gap-2 justify-center md:justify-start"><Briefcase className="w-4 h-4 text-[#800020]" /> 프로젝트 경험</h3>
          <div className="space-y-16 pl-2 md:pl-0">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="relative border-l border-zinc-200 dark:border-[#2a2a2a] pl-6 md:pl-8 print:break-inside-avoid">
                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-zinc-300 dark:bg-[#444] ring-4 ring-white dark:ring-[#111]"></div>
                
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-3 gap-2">
                  <h4 className="font-bold text-2xl text-[#2C2C2C] dark:text-[#e8e4dc] tracking-tight">
                    <EditableText value={exp.title} onSave={(v) => { const e = [...data.experience]; e[idx].title = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                  </h4>
                  <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    <EditableText value={exp.period} onSave={(v) => { const e = [...data.experience]; e[idx].period = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                  </span>
                </div>
                
                <div className="text-[15px] font-bold text-[#800020] mb-5">
                  <EditableText value={exp.description} onSave={(v) => { const e = [...data.experience]; e[idx].description = v; setData({...data, experience: e}); }} isEditing={isEditing} markdown={true} />
                </div>
                
                <ul className="text-[15px] text-zinc-600 dark:text-[#999] space-y-3 list-none leading-[1.8] bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-[#2a2a2a] p-6 rounded-2xl">
                  {exp.details.map((detail, dIdx) => (
                    <li key={dIdx} className="relative pl-4"><span className="absolute left-0 top-[0.65em] w-1 h-1 rounded-full bg-zinc-400 dark:bg-[#555]"></span>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 5. EDUCATION & AWARDS */}
        <section className="grid md:grid-cols-2 gap-16 print:gap-8 pt-6">
          {/* Education */}
          <div>
            <h3 className="text-sm font-bold text-zinc-400 dark:text-[#555] tracking-widest uppercase mb-10 flex items-center gap-2 justify-center md:justify-start"><GraduationCap className="w-4 h-4 text-[#800020]" /> 학력 및 교육</h3>
            <div className="space-y-12">
              {data.education.map((edu, idx) => (
                <div key={idx} className="print:break-inside-avoid">
                  <span className="text-[11px] font-mono font-bold text-zinc-400 dark:text-[#666] uppercase tracking-widest block mb-2">
                    <EditableText value={edu.period} onSave={(v) => { const e = [...data.education]; e[idx].period = v; setData({...data, education: e}); }} isEditing={isEditing} />
                  </span>
                  <h4 className="font-bold text-lg text-[#2C2C2C] dark:text-[#e8e4dc] tracking-tight mb-2">
                    <EditableText value={edu.title} onSave={(v) => { const e = [...data.education]; e[idx].title = v; setData({...data, education: e}); }} isEditing={isEditing} />
                  </h4>
                  <div className="text-[14px] font-medium text-zinc-600 dark:text-[#888] leading-relaxed mb-3">
                    <EditableText value={edu.description} onSave={(v) => { const e = [...data.education]; e[idx].description = v; setData({...data, education: e}); }} isEditing={isEditing} markdown={true} />
                  </div>
                  <ul className="text-[13px] text-zinc-500 space-y-1 list-disc list-inside">
                    {edu.details.map((detail, dIdx) => <li key={dIdx}>{detail}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div>
            <h3 className="text-sm font-bold text-zinc-400 dark:text-[#555] tracking-widest uppercase mb-10 flex items-center gap-2 justify-center md:justify-start"><Award className="w-4 h-4 text-[#800020]" /> 자격 및 수상</h3>
            <div className="space-y-6">
              {data.awards.map((award, idx) => (
                <div key={idx} className="pb-6 border-b border-black/5 dark:border-[#2a2a2a] last:border-0 last:pb-0">
                  <p className="text-[11px] font-mono font-bold text-[#800020] dark:text-[#ff3b6b] uppercase tracking-widest mb-2">{award.organization} <span className="opacity-40 px-1">|</span> {award.year}</p>
                  <h4 className="font-bold text-[16px] text-[#2C2C2C] dark:text-[#e8e4dc] leading-tight">
                    <EditableText value={award.title} onSave={(v) => { const a = [...data.awards]; a[idx].title = v; setData({...data, awards: a}); }} isEditing={isEditing} />
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FULL-WIDTH COVER LETTER SECTION */}
        <div className="mt-24 pt-24 border-t border-black/10 dark:border-[#1e1e1e] print:break-before-page">
            <div className="text-center mb-16">
              <span className="text-[#800020] font-mono text-sm uppercase tracking-[0.25em] font-bold block mb-4">자기소개서 전문</span>
              <h3 className="text-3xl md:text-5xl font-display font-bold text-[#2C2C2C] dark:text-[#e8e4dc] tracking-[-0.03em]">기획의 이유.</h3>
            </div>
            
            {data.selfIntroductions ? (
              <div className="flex flex-col gap-16 md:gap-24">
                {data.selfIntroductions.map((intro, idx) => (
                  <div key={idx} className="relative group">
                    {isEditing && (
                      <button onClick={() => { if (confirm("삭제하시겠습니까?")) { const n = [...(data.selfIntroductions || [])]; n.splice(idx, 1); setData({...data, selfIntroductions: n}); }}}
                        className="absolute top-0 right-0 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg" title="삭제">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Logline header */}
                    <div className="mb-8 pb-8 border-b border-black/10 dark:border-[#2a2a2a]">
                      <span className="inline-block text-[#800020] font-mono text-[11px] font-bold tracking-[0.2em] uppercase mb-4 bg-[#800020]/5 px-3 py-1 rounded-md">
                        CHAPTER {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-[#e8e4dc] leading-[1.4] tracking-tight">
                        <EditableText value={intro.logline} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].logline = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} multiline />
                      </h4>
                    </div>
                    
                    {/* Content body */}
                    <div className="text-zinc-700 dark:text-[#999] leading-[2.1] md:leading-[2.2] text-[16px] md:text-[17px] font-medium text-justify [&_p]:mb-8 [&_strong]:text-[#800020] dark:[&_strong]:text-[#ff3b6b] [&_strong]:font-bold [&_ul]:mb-8 [&_li]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#800020] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-zinc-500 [&_blockquote]:bg-zinc-50 dark:[&_blockquote]:bg-white/5 [&_blockquote]:py-4 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-xl">
                      <EditableText value={intro.content} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].content = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={true} />
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <button onClick={() => { const n = [...(data.selfIntroductions || [])]; n.push({ logline: "새로운 항목의 로그라인을 입력하세요.", content: "내용을 입력하세요." }); setData({...data, selfIntroductions: n}); }}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-black/10 dark:border-[#2a2a2a] hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[200px] cursor-pointer rounded-3xl mt-8">
                    <Plus className="w-8 h-8 text-zinc-400 mb-2" />
                    <span className="text-zinc-500 font-bold">새 자기소개 항목 추가</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 md:p-12 markdown-body">
                {isEditing ? (
                  <textarea className="w-full h-[400px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 text-[#e8e4dc] font-sans text-sm focus:outline-none focus:border-[#800020]"
                    value={data.selfIntroduction || ''} onChange={(e) => setData({...data, selfIntroduction: e.target.value})} />
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.selfIntroduction || ''}</ReactMarkdown>
                )}
              </div>
            )}
        </div>
      </div> {/* END SINGLE COLUMN LAYOUT */}
    </motion.section>

    {/* Off-screen PDF source (html2pdf.js captures this) */}
    <div ref={printRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', background: '#fff', color: '#000', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", fontSize: '12px', lineHeight: '1.6' }}>
      
      {/* Page 1 */}
      <div style={{ padding: '28px 32px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>{data.name}</h1>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#666', letterSpacing: '3px', textTransform: 'uppercase', margin: '4px 0 0' }}>{data.role}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#555', lineHeight: '1.8' }}>
            <p style={{ margin: 0 }}>✉ {data.email}</p>
            {data.phone && <p style={{ margin: 0 }}>☎ {data.phone}</p>}
          </div>
        </div>

        {/* Summary + Skills Row */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '22px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', color: '#222' }}>자기소개</h3>
            <div style={{ fontSize: '11.5px', color: '#333', lineHeight: '1.7' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.summary}</ReactMarkdown>
            </div>
          </div>
          <div style={{ width: '170px', flexShrink: 0, fontSize: '11px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px' }}>핵심 역량</h3>
            <ul style={{ margin: 0, paddingLeft: '16px', color: '#555', lineHeight: '1.6' }}>
              <li>기획 의도를 먼저 세우고 증명하는 전략 설계</li>
              <li>법학적 사고 기반 시스템 정합성 디자인</li>
              <li>생성 AI 응용 및 워크플로우 최적화</li>
            </ul>
            <h3 style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #ccc', paddingBottom: '4px', margin: '14px 0 8px' }}>활용 툴</h3>
            <p style={{ color: '#555', margin: 0 }}>Word, PPT, Excel, Figma, Notion, Unity, Git</p>
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px', color: '#222' }}>프로젝트 경험</h3>
          {data.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 700, margin: 0 }}>{exp.title}</h4>
                <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{exp.period}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#333', marginBottom: '4px', lineHeight: '1.6' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{exp.description || ''}</ReactMarkdown>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '10.5px', color: '#555', lineHeight: '1.5' }}>
                {exp.details.map((detail, dIdx) => <li key={dIdx}>{detail}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Education & Awards */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px', color: '#222' }}>학력</h3>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11.5px', marginBottom: '2px' }}>
                  <span>{edu.title}</span><span style={{ color: '#666', fontSize: '10px' }}>{edu.period}</span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#555', lineHeight: '1.5' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{edu.description || ''}</ReactMarkdown>
                </div>
                <ul style={{ margin: '2px 0 0', paddingLeft: '14px', fontSize: '10px', color: '#666' }}>
                  {edu.details.map((detail, dIdx) => <li key={dIdx}>{detail}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px', color: '#222' }}>자격 및 수상</h3>
            {data.awards.map((award, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '11.5px' }}>{award.title}</div>
                <div style={{ fontSize: '10.5px', color: '#666' }}>{award.organization} — {award.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page 2+: Cover Letter */}
      <div className="pdf-page-break" style={{ padding: '28px 32px 16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '20px' }}>자기소개서</h3>
        {data.selfIntroductions?.map((intro, idx) => (
          <div key={idx} style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', borderLeft: '3px solid #800020', paddingLeft: '10px' }}>
              <span style={{ fontFamily: 'monospace', color: '#800020', fontWeight: 700, fontSize: '13px' }}>{String(idx + 1).padStart(2, '0')}</span>
              <h4 style={{ fontWeight: 700, fontSize: '13px', margin: 0 }}>{intro.logline}</h4>
            </div>
            <div style={{ fontSize: '11.5px', color: '#333', lineHeight: '1.9', textAlign: 'justify', paddingLeft: '24px' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

    </div>
    </>
  );
};

// --- Contact ---
const Contact = () => (
  <section id="contact" className="scroll-mt-20 py-[120px] px-6 md:px-12 relative border-t border-black/5 min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    
    <div className="max-w-4xl mx-auto w-full text-center relative z-10">
      <span className="text-[#800020] font-mono text-xs uppercase tracking-[0.25em] font-bold mb-8 block">05. Contact</span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-[-0.03em] text-[#2C2C2C] leading-[1.15] mb-8">
        저는 <br/><span className="text-zinc-400">준비되었습니다.</span>
      </h2>
      <p className="text-zinc-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
        새로운 프로젝트나 협업 제안은 언제나 환영입니다. <br className="hidden md:block" />
        아래 이메일로 연락 주시면 빠르게 답변 드리겠습니다.
      </p>
      
      <a href="mailto:kh980624@naver.com" 
        className="group inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#800020] text-white font-bold hover:bg-[#a10028] transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-1 tracking-widest text-sm rounded-full uppercase overflow-hidden relative">
        <span className="relative z-10 flex items-center gap-3">
          <Mail className="w-5 h-5" /> 이메일 보내기
        </span>
      </a>
    </div>
  </section>
);

// --- Footer ---
const Footer = () => (
  <footer className="py-12 px-6 md:px-12 text-center bg-transparent">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-black/5 pt-8">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#2C2C2C] flex items-center justify-center rounded-md">
          <FileText className="text-white w-3 h-3" />
        </div>
        <span className="font-bold text-zinc-600 font-sans">지망생 조경환</span>
      </div>
      <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">© 2026 GAME DESIGNER PORTFOLIO. All rights reserved.</p>
    </div>
  </footer>
);

// --- RightRail (Dot Navigation) ---
const RightRail = ({ view, onNavClick, activeSection }: { view: string, onNavClick: (id: string) => void, activeSection: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sections = [
    { id: 'about', label: '01' },
    { id: 'projects', label: '02' },
    { id: 'skills', label: '03' },
    { id: 'play-history', label: '04' },
    { id: 'contact', label: '05' }
  ];

  useEffect(() => {
    const handleScroll = () => { setIsVisible(window.pageYOffset > 500); };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      {view === 'home' && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-6 print:hidden">
          <div className="w-px h-24 bg-zinc-200"></div>
          <div className="flex flex-col gap-5">
            {sections.map(section => {
              const isActive = activeSection === section.id;
              return (
                <button key={section.id} onClick={() => onNavClick(section.id)} className="group relative flex items-center justify-center w-6 h-6" aria-label={`Scroll to ${section.id}`}>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-[#800020] scale-150' : 'bg-zinc-300 group-hover:bg-zinc-400'}`}></div>
                  <span className={`absolute right-8 text-[10px] font-mono tracking-widest transition-all duration-300 ${isActive ? 'text-[#800020] font-bold opacity-100 translate-x-0' : 'text-zinc-400 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="w-px h-24 bg-zinc-200"></div>
          <div className="absolute top-full mt-6">
            <AnimatePresence>
              {isVisible && (
                <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onClick={scrollToTop} className="group w-8 h-8 flex items-center justify-center border border-black/10 bg-white hover:bg-zinc-50 hover:border-[#800020] transition-all rounded-full shadow-sm" aria-label="Back to top">
                  <ArrowUp className="w-3 h-3 text-zinc-500 group-hover:text-[#800020] group-hover:-translate-y-0.5 transition-all" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/90 backdrop-blur-md border border-black/10 rounded-xl flex items-center justify-center text-[#2C2C2C] hover:bg-zinc-50 hover:border-[#800020] transition-all shadow-md ${view === 'home' ? 'xl:hidden' : ''} print:hidden`}>
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

// --- ProjectDetail ---
const ProjectDetail = ({ project, onBack, isEditing, onSaveContent }: { project: Project, onBack: () => void, isEditing: boolean, onSaveContent: (content: string) => void }) => {
  const headings = project.content.match(/^##\s+(.*)/gm)?.map(h => h.replace(/^##\s+/, '')) || [];
  const generateId = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-가-힣]/g, '');

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-[160px] pb-[120px] px-6 md:px-12 max-w-7xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-[#800020] transition-colors mb-12 group font-sans text-sm tracking-tight font-bold">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 프로젝트 목록으로 돌아가기
      </button>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 pb-4 border-b border-black/5">Table of Contents</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-500">
              {headings.map((heading, idx) => (
                <li key={idx}><a href={`#${generateId(heading)}`} className="hover:text-[#800020] transition-colors block leading-snug">{heading}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-16">
            <div className="aspect-[21/9] relative group mb-10 border border-black/5 rounded-xl overflow-hidden bg-zinc-100 shadow-sm">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-white border border-black/10 px-3 py-1 rounded-md text-[10px] font-bold text-zinc-600 tracking-tight font-sans shadow-sm">{project.category}</span>
              <div className="flex gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-zinc-50 border border-black/5 rounded-md text-zinc-500 font-sans">#{tag}</span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] leading-tight tracking-tight">{project.title}</h1>
          </div>

          <div className="markdown-body bg-white border border-black/5 rounded-xl shadow-sm p-8 md:p-16">
            {isEditing ? (
              <textarea className="w-full h-[600px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-6 text-[#e8e4dc] font-sans text-sm focus:outline-none focus:border-[#800020]"
                value={project.content} onChange={(e) => onSaveContent(e.target.value)} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({node, ...props}) => {
                    const extractText = (children: any): string => {
                      if (typeof children === 'string') return children;
                      if (Array.isArray(children)) return children.map(extractText).join('');
                      if (children?.props?.children) return extractText(children.props.children);
                      return '';
                    };
                    const text = extractText(props.children);
                    return <h2 id={generateId(text)} className="scroll-mt-32" {...props} />;
                  }
                }}>
                {project.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// --- Game History View ---
const GameHistoryView = ({ setView }: { setView: (v: any) => void }) => {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-[160px] pb-[120px] px-6 md:px-12 max-w-5xl mx-auto flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-zinc-500 hover:text-[#800020] transition-colors group font-sans tracking-tight text-sm font-bold uppercase">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> RETURN TO HOME
        </button>
      </div>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-[#2C2C2C] mb-4">전체 플레이 이력.</h2>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          다양한 게임을 깊게 파고들며 쌓아온 인사이트입니다.<br className="hidden md:block" />
          장르와 플랫폼을 가리지 않는 폭넓은 레퍼런스를 갖추고 있습니다.
        </p>
      </div>

      <div className="bg-white border border-black/5 rounded-3xl overflow-hidden flex-1 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F6F6F3] border-b border-black/5 text-zinc-500 text-xs font-bold uppercase tracking-widest text-center">
                <th className="p-5 font-bold w-16">#</th>
                <th className="p-5 text-left">타이틀</th>
                <th className="p-5 w-32">장르</th>
                <th className="p-5 w-40">플랫폼</th>
                <th className="p-5 w-32">플레이 타임</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600 font-medium text-sm align-middle text-center">
              {ALL_GAMES.map((game, idx) => (
                <tr key={idx} className="border-b border-black/5 hover:bg-zinc-50 transition-colors group">
                  <td className="p-5 font-mono text-zinc-400">{idx + 1}</td>
                  <td className="p-5 font-bold text-[#2C2C2C] text-left text-base">{game.title}</td>
                  <td className="p-5"><span className="px-3 py-1 bg-[#800020]/10 text-[#800020] rounded-md text-[11px] font-bold tracking-widest whitespace-nowrap">{game.genre}</span></td>
                  <td className="p-5 font-mono text-xs">{game.platform}</td>
                  <td className="p-5 text-zinc-500 whitespace-nowrap">{game.playTime || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
};

// --- Main App ---
export default function App() {
  const [view, setView] = useState<'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects' | 'game-history'>('home');
  const [prevView, setPrevView] = useState<'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects' | 'game-history'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const changeView = (newView: 'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects' | 'game-history') => {
    setPrevView(view);
    setView(newView);
  };

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollTargetRef = useRef<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      if (view === 'home') {
        const sections = ['about', 'projects', 'skills', 'play-history', 'contact'];
        let current = '';
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
              current = section;
              break;
            }
          }
        }
        setActiveSection(current);
      } else {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  // --- Edit Mode Logic ---
  const [isEditing, setIsEditing] = useState(false);
  const [inputSequence, setInputSequence] = useState('');

  // --- Persistent Content ---
  const [heroContent, setHeroContent, heroLoaded] = useEditableContent({
    titleLine1: "기획 의도를 알고",
    titleLine2: "목차를 작성할 줄 아는 기획자",
    description: "사용자의 경험을 논리적으로 설계하고, 명확한 문서화를 통해 팀의 비전을 구체화합니다. 데이터와 심리학을 기반으로 한 깊이 있는 기획을 지향합니다."
  }, 'hero_content');

  const [aboutContent, setAboutContent, aboutLoaded] = useEditableContent({
    title: "논리와 감성의 균형으로",
    subtitle: "최고의 재미를 설계합니다.",
    p1: "게임이 '작동'하는 원리를 깊이 있게 학습했습니다. 단순한 아이디어를 넘어, 수치로 증명되는 밸런싱과 플레이어의 심리를 관통하는 내러티브 설계를 지향합니다.",
    p2: "훌륭한 게임 디자인은 보이지 않아야 한다고 믿습니다. 플레이어가 자연스럽게 몰입하고, 성취감을 느끼며, 그 세계의 일부가 된 듯한 경험을 제공하는 것이 저의 목표입니다.",
    stats: [
      { label: "제작 프로토타입", value: "12+" },
      { label: "QA 테스트 시간", value: "200+" },
      { label: "최대 기획서 분량", value: "50p" }
    ]
  }, 'about_content');

  const [projectsData, setProjectsData, projectsLoaded] = useEditableContent(PROJECTS, 'projects_data');
  const [portfolioData, setPortfolioData, portfolioLoaded] = useEditableContent(PORTFOLIO_PROJECTS, 'portfolio_data');
  const [skillsData, setSkillsData, skillsLoaded] = useEditableContent(SKILLS, 'skills_data');
  const [historyData, setHistoryData, historyLoaded] = useEditableContent(GAME_HISTORY, 'history_data');
  const [resumeData, setResumeData, resumeLoaded] = useEditableContent(RESUME_DATA, 'resume_data');

  const isDataLoaded = heroLoaded && aboutLoaded && projectsLoaded && portfolioLoaded && skillsLoaded && historyLoaded && resumeLoaded;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSeq = (inputSequence + e.key).slice(-4);
      setInputSequence(newSeq);
      if (newSeq === '9806') {
        setIsEditing(!isEditing);
        setInputSequence('');
        if (!isEditing) {
          alert("관리자 모드가 활성화되었습니다.");
        } else {
          alert("관리자 모드가 비활성화되었습니다.");
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputSequence, isEditing]);

  useEffect(() => {
    if (view === 'home' && scrollTargetRef.current) {
      const target = scrollTargetRef.current;
      scrollTargetRef.current = null;
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(target);
        if (el) {
          const offset = 64;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else if (attempts < 30) {
          attempts++;
          requestAnimationFrame(tryScroll);
        }
      };
      const timer = setTimeout(tryScroll, 600);
      return () => clearTimeout(timer);
    } else if (view !== 'home') {
      window.scrollTo(0, 0);
    }
  }, [view]);

  const handleNavClick = (id: string) => {
    if (view !== 'home') {
      scrollTargetRef.current = id;
      changeView('home');
    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = 64;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    changeView('project-detail');
  };

  if (!isDataLoaded) {
    return <div className="min-h-screen bg-[#F6F6F3] dark:bg-[#0a0a0a] flex items-center justify-center transition-colors duration-500" />;
  }

  return (
    <div className="min-h-screen selection:bg-[#800020]/20 flex flex-col relative">
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F6F6F3] dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(128,0,32,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.01),transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(128,0,32,0.03),transparent_50%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/50 dark:bg-[#800020]/5 rounded-full blur-[120px] mix-blend-overlay dark:mix-blend-lighten"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/50 dark:bg-[#800020]/5 rounded-full blur-[120px] mix-blend-overlay dark:mix-blend-lighten"></div>
      </div>

      <Navbar setView={changeView} currentView={view} onNavClick={handleNavClick} isEditing={isEditing} setIsEditing={setIsEditing} activeSection={activeSection} theme={theme} setTheme={setTheme} />
      <main className="flex-1 w-full min-w-0 relative z-10 transition-all duration-300">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onPortfolioClick={() => changeView('portfolio')} onResumeClick={() => changeView('resume')} isEditing={isEditing} content={heroContent} setContent={setHeroContent} />
              <About isEditing={isEditing} content={aboutContent} setContent={setAboutContent} />
              <Projects onProjectClick={handleProjectClick} isEditing={isEditing} projects={projectsData} setProjects={setProjectsData} limit={3} setView={changeView} />
              <Skills isEditing={isEditing} skills={skillsData} setSkills={setSkillsData} />
              <PlayHistory isEditing={isEditing} history={historyData} setHistory={setHistoryData} />
              <Contact />
            </motion.div>
          )}

          {view === 'resume' && (
            <Resume key="resume" setView={changeView} isEditing={isEditing} data={resumeData} setData={setResumeData} />
          )}

          {view === 'portfolio' && (
            <Portfolio key="portfolio" onProjectClick={handleProjectClick} isEditing={isEditing} projects={portfolioData} setProjects={setPortfolioData} setView={changeView} />
          )}

          {view === 'project-detail' && selectedProject && (
            <ProjectDetail key="project-detail" project={selectedProject} onBack={() => changeView(prevView === 'project-detail' ? 'home' : prevView)} isEditing={isEditing}
              onSaveContent={(content) => {
                const np = [...projectsData];
                const idx = np.findIndex(p => p.id === selectedProject.id);
                if (idx !== -1) { np[idx].content = content; setProjectsData(np); setSelectedProject({...selectedProject, content}); }
                else {
                  const npp = [...portfolioData];
                  const pIdx = npp.findIndex(p => p.id === selectedProject.id);
                  if (pIdx !== -1) { npp[pIdx].content = content; setPortfolioData(npp); setSelectedProject({...selectedProject, content}); }
                }
              }} />
          )}

          {view === 'game-history' && (
            <GameHistoryView key="game-history" setView={changeView} />
          )}
        </AnimatePresence>
        <Footer />
      </main>
      <RightRail view={view} onNavClick={handleNavClick} activeSection={activeSection} />
      
      {isEditing && (
        <div className="fixed bottom-24 left-8 z-50 flex flex-col gap-2 print:hidden">
          <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 border border-black/10 shadow-xl">
            <div className="w-10 h-10 bg-[#800020] rounded-xl flex items-center justify-center text-white">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2C2C2C] tracking-tight font-sans">ADMIN MODE</p>
              <p className="text-[10px] text-[#888] font-sans">내용을 클릭하여 직접 수정하세요. 자동 저장됩니다.</p>
            </div>
            <button onClick={() => setIsEditing(false)} className="ml-4 p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors">
              <Lock className="w-4 h-4 text-[#888]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
