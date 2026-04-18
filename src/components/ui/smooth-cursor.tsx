import React, { FC, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, useMotionValue } from "motion/react"
import { Search, Loader2, Move, Copy, HelpCircle, XCircle, Hand, Grab, ChevronsLeftRight, ChevronsUpDown } from "lucide-react"

// 1. Logic Helpers
function mapCssCursorToLogicalState(rawCursor: string): string {
  const cursor = (rawCursor || '').split(',')[0].trim().toLowerCase();
  switch (cursor) {
    case 'text': case 'vertical-text': return 'text';
    case 'pointer': return 'pointer';
    case 'wait': case 'progress': return 'wait';
    case 'help': return 'help';
    case 'move': case 'all-scroll': return 'move';
    case 'grab': return 'grab';
    case 'grabbing': return 'grabbing';
    case 'none': return 'none';
    default: return 'default';
  }
}

// 2. SVG Sub-components
const DefaultCursorSVG = () => (
  <svg width={50} height={54} viewBox="0 0 50 54" fill="none" style={{ scale: 0.5 }}>
    <path d="M42.68 41.15L27.51 6.8c-.8-1.77-3.3-1.77-4.11 0L7.6 41.15c-.84 1.83.93 3.74 2.81 3.05l13.97-5.15c.5-.18 1.05-.18 1.56 0l13.88 5.15c1.87.69 3.67-1.22 2.86-3.05z" fill="black" stroke="white" strokeWidth="2" />
  </svg>
)

const TextCursorSVG = () => <div className="w-[3px] h-6 bg-black rounded-full border border-white/50 shadow-sm" />
const PointerCursorSVG = () => <div className="w-5 h-5 rounded-full bg-black border-2 border-white shadow-lg flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>
const WaitCursorSVG = () => <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center"><Loader2 size={16} className="text-black animate-spin" /></div>

// 3. Main Component (RENAMED to bypass HMR ghosts)
export function MagicCursor() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorState, setCursorState] = useState('default')
  
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const isVisibleRef = useRef(false);
  const cursorStateRef = useRef('default');

  useEffect(() => {
    const mq = window.matchMedia("(any-hover: hover) and (any-pointer: fine)")
    setIsEnabled(mq.matches)
    
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
      
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      
      const target = e.target as HTMLElement
      let detected = 'default';
      if (target) {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.closest('.cursor-text')) {
          detected = 'text';
        } else if (target.closest('.cursor-pointer, a, button, [role="button"], label, select, summary, [tabindex]:not([tabindex="-1"])')) {
          const closestBtn = target.closest('button, input, select, textarea');
          if (closestBtn && (closestBtn as HTMLButtonElement).disabled) {
            detected = 'default';
          } else {
            detected = 'pointer';
          }
        } else if (target.closest('.cursor-wait')) {
          detected = 'wait';
        } else if (target.closest('.cursor-move')) {
          detected = 'move';
        } else if (target.closest('.cursor-grab')) {
          detected = 'grab';
        } else if (target.closest('.cursor-grabbing')) {
          detected = 'grabbing';
        } else if (target.closest('.cursor-help')) {
          detected = 'help';
        } else if (target.closest('.cursor-none')) {
          detected = 'none';
        }
      }
      
      if (detected !== cursorStateRef.current) {
        cursorStateRef.current = detected;
        setCursorState(detected);
      }
    }

    const onMqChange = (e: MediaQueryListEvent) => setIsEnabled(e.matches)

    window.addEventListener("pointermove", onMove, { passive: true })
    mq.addEventListener("change", onMqChange)

    return () => {
      window.removeEventListener("pointermove", onMove)
      mq.removeEventListener("change", onMqChange)
    }
  }, [cursorX, cursorY]) 

  if (!isEnabled) return null

  const getIcon = () => {
    if (cursorState === 'none') return null;
    switch (cursorState) {
      case 'text': return <TextCursorSVG />
      case 'pointer': return <PointerCursorSVG />
      case 'wait': return <WaitCursorSVG />
      case 'move': return <Move size={20} className="text-black" />
      case 'grab': return <Hand size={20} className="text-black" />
      case 'grabbing': return <Grab size={20} className="text-black" />
      default: return <DefaultCursorSVG />
    }
  }

  return createPortal(
    <>
      <style>{`
        * { cursor: none !important; }
        a, button, input, textarea, select, [role="button"] { cursor: none !important; }
      `}</style>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          pointerEvents: "none",
          zIndex: 9999999,
          opacity: isVisible ? 1 : 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {getIcon()}
      </motion.div>
    </>,
    document.body
  )
}
