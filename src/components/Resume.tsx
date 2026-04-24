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
  Word: (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-110">
      <path d="M18.536,2.323V4.868c3.4.019,7.12-.035,10.521.019a.783.783,0,0,1,.912.861c.054,6.266-.013,12.89.032,19.157-.02.4.009,1.118-.053,1.517-.079.509-.306.607-.817.676-.286.039-.764.034-1.045.047-2.792-.014-5.582-.011-8.374-.01l-1.175,0v2.547L2,27.133Q2,16,2,4.873L18.536,2.322" fill="#283c82"/>
      <path d="M18.536,5.822h10.5V26.18h-10.5V23.635h8.27V22.363h-8.27v-1.59h8.27V19.5h-8.27v-1.59h8.27V16.637h-8.27v-1.59h8.27V13.774h-8.27v-1.59h8.27V10.911h-8.27V9.321h8.27V8.048h-8.27V5.822" fill="#fff"/>
      <path d="M8.573,11.443c.6-.035,1.209-.06,1.813-.092.423,2.147.856,4.291,1.314,6.429.359-2.208.757-4.409,1.142-6.613.636-.022,1.272-.057,1.905-.1-.719,3.082-1.349,6.19-2.134,9.254-.531.277-1.326-.013-1.956.032-.423-2.106-.916-4.2-1.295-6.314C8.99,16.1,8.506,18.133,8.08,20.175q-.916-.048-1.839-.111c-.528-2.8-1.148-5.579-1.641-8.385.544-.025,1.091-.048,1.635-.067.328,2.026.7,4.043.986,6.072.448-2.08.907-4.161,1.352-6.241" fill="#fff"/>
    </svg>
  ),
  PowerPoint: (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-110">
      <path d="M18.536,2.321V5.184c3.4.019,7.357-.035,10.754.016.642,0,.67.568.678,1.064.054,5.942-.013,12.055.032,18-.012.234-.006,1.1-.013,1.346-.022.823-.434.859-1.257.884-.132,0-.52.006-.648.012-3.181-.016-6.362-.009-9.546-.009v3.182L2,27.134Q2,16,2,4.873L18.536,2.322" fill="#d33922"/>
      <path d="M18.536,6.138h10.5v19.4h-10.5V23H26.17V21.725H18.536V20.135H26.17V18.863H18.539c0-.624,0-1.247-.006-1.87a4.467,4.467,0,0,0,3.82-.375,4.352,4.352,0,0,0,1.959-3.474c-1.4-.01-2.793-.006-4.186-.006,0-1.384.016-2.767-.029-4.148-.522.1-1.043.21-1.562.321V6.139" fill="#fff"/>
      <path d="M20.766,8.324a4.476,4.476,0,0,1,4.186,4.167c-1.4.016-2.793.01-4.189.01,0-1.393,0-2.787,0-4.177" fill="#d33922"/>
      <path d="M7.1,10.726c1.727.083,3.82-.684,5.252.611,1.371,1.664,1.008,4.724-1.024,5.719A4.7,4.7,0,0,1,9,17.348c0,1.244-.006,2.488,0,3.731-.63-.054-1.263-.108-1.893-.159-.029-3.4-.035-6.8,0-10.2" fill="#fff"/>
      <path d="M8.993,12.446c.627-.029,1.4-.143,1.826.445a2.308,2.308,0,0,1,.041,2.087c-.363.655-1.183.592-1.816.668-.067-1.066-.06-2.131-.051-3.2" fill="#d33922"/>
    </svg>
  ),
  Excel: (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-110">
      <path d="M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z" fill="#20744a" fillRule="evenodd"/>
      <rect x="22.487" y="7.439" width="4.323" height="2.2" fill="#20744a"/>
      <rect x="22.487" y="10.94" width="4.323" height="2.2" fill="#20744a"/>
      <rect x="22.487" y="14.441" width="4.323" height="2.2" fill="#20744a"/>
      <rect x="22.487" y="17.942" width="4.323" height="2.2" fill="#20744a"/>
      <rect x="22.487" y="21.443" width="4.323" height="2.2" fill="#20744a"/>
      <polygon points="6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673" fill="#ffffff" fillRule="evenodd"/>
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-110">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.716 29.2178L2.27664 24.9331C1.44913 23.9023 1 22.6346 1 21.3299V5.81499C1 3.86064 2.56359 2.23897 4.58071 2.10125L20.5321 1.01218C21.691 0.933062 22.8428 1.24109 23.7948 1.8847L29.3992 5.67391C30.4025 6.35219 31 7.46099 31 8.64426V26.2832C31 28.1958 29.4626 29.7793 27.4876 29.9009L9.78333 30.9907C8.20733 31.0877 6.68399 30.4237 5.716 29.2178Z" fill="white"/>
      <path d="M11.2481 13.5787V13.3756C11.2481 12.8607 11.6605 12.4337 12.192 12.3982L16.0633 12.1397L21.417 20.0235V13.1041L20.039 12.9204V12.824C20.039 12.303 20.4608 11.8732 20.9991 11.8456L24.5216 11.6652V12.1721C24.5216 12.41 24.3446 12.6136 24.1021 12.6546L23.2544 12.798V24.0037L22.1906 24.3695C21.3018 24.6752 20.3124 24.348 19.8036 23.5803L14.6061 15.7372V23.223L16.2058 23.5291L16.1836 23.6775C16.1137 24.1423 15.7124 24.4939 15.227 24.5155L11.2481 24.6926C11.1955 24.1927 11.5701 23.7456 12.0869 23.6913L12.6103 23.6363V13.6552L11.2481 13.5787Z" fill="#000000"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M20.6749 2.96678L4.72347 4.05585C3.76799 4.12109 3.02734 4.88925 3.02734 5.81499V21.3299C3.02734 22.1997 3.32676 23.0448 3.87843 23.7321L7.3178 28.0167C7.87388 28.7094 8.74899 29.0909 9.65435 29.0352L27.3586 27.9454C28.266 27.8895 28.9724 27.1619 28.9724 26.2832V8.64426C28.9724 8.10059 28.6979 7.59115 28.2369 7.27951L22.6325 3.49029C22.0613 3.10413 21.3702 2.91931 20.6749 2.96678ZM5.51447 6.057C5.29261 5.89274 5.3982 5.55055 5.6769 5.53056L20.7822 4.44711C21.2635 4.41259 21.7417 4.54512 22.1309 4.82088L25.1617 6.96813C25.2767 7.04965 25.2228 7.22563 25.0803 7.23338L9.08387 8.10336C8.59977 8.12969 8.12193 7.98747 7.73701 7.7025L5.51447 6.057ZM8.33357 10.8307C8.33357 10.311 8.75341 9.88177 9.29027 9.85253L26.203 8.93145C26.7263 8.90296 27.1667 9.30534 27.1667 9.81182V25.0853C27.1667 25.604 26.7484 26.0328 26.2126 26.0633L9.40688 27.0195C8.8246 27.0527 8.33357 26.6052 8.33357 26.0415V10.8307Z" fill="#000000"/>
    </svg>
  ),
  Figma: (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-110" fill="none">
      <path fill="#1ABCFE" d="M8.55 8c0-1.289 1.019-2.333 2.275-2.333C12.082 5.667 13.1 6.71 13.1 8c0 1.289-1.018 2.333-2.275 2.333C9.57 10.333 8.55 9.29 8.55 8z"/>
      <path fill="#0ACF83" d="M4 12.667c0-1.289 1.019-2.334 2.275-2.334H8.55v2.334C8.55 13.955 7.531 15 6.275 15S4 13.955 4 12.667z"/>
      <path fill="#FF7262" d="M8.55 1v4.667h2.275c1.257 0 2.275-1.045 2.275-2.334C13.1 2.045 12.082 1 10.825 1H8.55z"/>
      <path fill="#F24E1E" d="M4 3.333c0 1.289 1.019 2.334 2.275 2.334H8.55V1H6.275C5.019 1 4 2.045 4 3.333z"/>
      <path fill="#A259FF" d="M4 8c0 1.289 1.019 2.333 2.275 2.333H8.55V5.667H6.275C5.019 5.667 4 6.71 4 8z"/>
    </svg>
  ),
  Unity: (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-black transition-transform group-hover:scale-110">
      <path d="M25.94 25.061l-5.382-9.060 5.382-9.064 2.598 9.062-2.599 9.060zM13.946 24.191l-6.768-6.717h10.759l5.38 9.061-9.372-2.342zM13.946 7.809l9.371-2.342-5.379 9.061h-10.761zM30.996 12.917l-3.282-11.913-12.251 3.193-1.812 3.112-3.68-0.027-8.966 8.719 8.967 8.72 3.678-0.029 1.817 3.112 12.246 3.192 3.283-11.908-1.864-3.087z"/>
    </svg>
  ),
  ChatGPT: <svg viewBox="0 0 16 16" className="w-8 h-8 fill-current group-hover:text-[#10a37f] transition-colors"><path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z"/></svg>,
  Claude: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-110">
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fill="#D97757" fillRule="nonzero"/>
    </svg>
  ),
  Gemini: (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65" className="w-8 h-8 transition-transform group-hover:scale-110">
      <mask id="maskme" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="65" height="65">
        <path d="M32.447 0c.68 0 1.273.465 1.439 1.125a38.904 38.904 0 001.999 5.905c2.152 5 5.105 9.376 8.854 13.125 3.751 3.75 8.126 6.703 13.125 8.855a38.98 38.98 0 005.906 1.999c.66.166 1.124.758 1.124 1.438 0 .68-.464 1.273-1.125 1.439a38.902 38.902 0 00-5.905 1.999c-5 2.152-9.375 5.105-13.125 8.854-3.749 3.751-6.702 8.126-8.854 13.125a38.973 38.973 0 00-2 5.906 1.485 1.485 0 01-1.438 1.124c-.68 0-1.272-.464-1.438-1.125a38.913 38.913 0 00-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973 38.973 0 00-5.905-2A1.485 1.485 0 010 32.448c0-.68.465-1.272 1.125-1.438a38.903 38.903 0 005.905-2c5-2.151 9.376-5.104 13.125-8.854 3.75-3.749 6.703-8.125 8.855-13.125a38.972 38.972 0 001.999-5.905A1.485 1.485 0 0132.447 0z" fill="#000"/>
      </mask>
      <g mask="url(#maskme)">
        <g filter="url(#prefix__filter0_f_2001_67)"><path d="M-5.859 50.734c7.498 2.663 16.116-2.33 19.249-11.152 3.133-8.821-.406-18.131-7.904-20.794-7.498-2.663-16.116 2.33-19.25 11.151-3.132 8.822.407 18.132 7.905 20.795z" fill="#FFE432"/></g>
        <g filter="url(#prefix__filter1_f_2001_67)"><path d="M27.433 21.649c10.3 0 18.651-8.535 18.651-19.062 0-10.528-8.35-19.062-18.651-19.062S8.78-7.94 8.78 2.587c0 10.527 8.35 19.062 18.652 19.062z" fill="#FC413D"/></g>
        <g filter="url(#prefix__filter2_f_2001_67)"><path d="M20.184 82.608c10.753-.525 18.918-12.244 18.237-26.174-.68-13.93-9.95-24.797-20.703-24.271C6.965 32.689-1.2 44.407-.519 58.337c.681 13.93 9.95 24.797 20.703 24.271z" fill="#00B95C"/></g>
        <g filter="url(#prefix__filter5_f_2001_67)"><path d="M67.391 42.993c10.132 0 18.346-7.91 18.346-17.666 0-9.757-8.214-17.667-18.346-17.667s-18.346 7.91-18.346 17.667c0 9.757 8.214 17.666 18.346 17.666z" fill="#3186FF"/></g>
        <g filter="url(#prefix__filter7_f_2001_67)"><path d="M34.74 51.43c11.135 7.656 25.896 5.524 32.968-4.764 7.073-10.287 3.779-24.832-7.357-32.488C49.215 6.52 34.455 8.654 27.382 18.94c-7.072 10.288-3.779 24.833 7.357 32.49z" fill="#3186FF"/></g>
      </g>
      <defs>
        <filter id="prefix__filter0_f_2001_67" x="-19.824" y="13.152" width="39.274" height="43.217" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="2.46" result="effect1_foregroundBlur_2001_67"/></filter>
        <filter id="prefix__filter1_f_2001_67" x="-15.001" y="-40.257" width="84.868" height="85.688" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="11.891" result="effect1_foregroundBlur_2001_67"/></filter>
        <filter id="prefix__filter2_f_2001_67" x="-20.776" y="11.927" width="79.454" height="90.916" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="10.109" result="effect1_foregroundBlur_2001_67"/></filter>
        <filter id="prefix__filter5_f_2001_67" x="29.832" y="-11.552" width="75.117" height="73.758" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="9.606" result="effect1_foregroundBlur_2001_67"/></filter>
        <filter id="prefix__filter7_f_2001_67" x="8.107" y="-5.966" width="78.877" height="77.539" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="7.775" result="effect1_foregroundBlur_2001_67"/></filter>
      </defs>
    </svg>
  ),
  Antigravity: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-110">
      <mask height="23" id="lobe-icons-antigravity-0-_R_0_" maskUnits="userSpaceOnUse" width="24" x="0" y="1"><path d="M21.751 22.607c1.34 1.005 3.35.335 1.508-1.508C17.73 15.74 18.904 1 12.037 1 5.17 1 6.342 15.74.815 21.1c-2.01 2.009.167 2.511 1.507 1.506 5.192-3.517 4.857-9.714 9.715-9.714 4.857 0 4.522 6.197 9.714 9.715z" fill="#fff"/></mask>
      <g mask="url(#lobe-icons-antigravity-0-_R_0_)">
        <g filter="url(#lobe-icons-antigravity-1-_R_0_)"><path d="M-1.018-3.992c-.408 3.591 2.686 6.89 6.91 7.37 4.225.48 7.98-2.043 8.387-5.633.408-3.59-2.686-6.89-6.91-7.37-4.225-.479-7.98 2.043-8.387 5.633z" fill="#FFE432"/></g>
        <g filter="url(#lobe-icons-antigravity-2-_R_0_)"><path d="M15.269 7.747c1.058 4.557 5.691 7.374 10.348 6.293 4.657-1.082 7.575-5.653 6.516-10.21-1.058-4.556-5.691-7.374-10.348-6.292-4.657 1.082-7.575 5.653-6.516 10.21z" fill="#FC413D"/></g>
        <g filter="url(#lobe-icons-antigravity-6-_R_0_)"><path d="M9.932 27.617c1.04 4.482 5.384 7.303 9.7 6.3 4.316-1.002 6.971-5.448 5.93-9.93-1.04-4.483-5.384-7.304-9.7-6.301-4.316 1.002-6.971 5.448-5.93 9.93z" fill="#3186FF"/></g>
        <g filter="url(#lobe-icons-antigravity-7-_R_0_)"><path d="M2.572-8.185C.392-3.329 2.778 2.472 7.9 4.771c5.122 2.3 11.042.227 13.222-4.63 2.18-4.855-.205-10.656-5.327-12.955-5.122-2.3-11.042-.227-13.222 4.63z" fill="#FBBC04"/></g>
      </g>
      <defs>
        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="17.587" id="lobe-icons-antigravity-1-_R_0_" width="19.838" x="-3.288" y="-11.917"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_977_115" stdDeviation="1.117"/></filter>
        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="38.565" id="lobe-icons-antigravity-2-_R_0_" width="38.9" x="4.251" y="-13.493"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_977_115" stdDeviation="5.4"/></filter>
        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="34.087" id="lobe-icons-antigravity-6-_R_0_" width="33.533" x=".981" y="8.758"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_977_115" stdDeviation="4.363"/></filter>
        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="35.276" id="lobe-icons-antigravity-7-_R_0_" width="35.978" x="-6.143" y="-21.659"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_977_115" stdDeviation="3.954"/></filter>
      </defs>
    </svg>
  ),
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
