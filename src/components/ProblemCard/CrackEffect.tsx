import { SeverityLevel } from '@/types/problem.type';

export function CrackEffect({ level }: { level: SeverityLevel }) {
  if (level === 'dhoom') {
    return (
      <svg className="absolute top-0 right-10 w-24 h-24 opacity-15 pointer-events-none text-black" viewBox="0 0 100 100">
        <path d="M 50 0 L 40 20 L 55 35 L 45 60 L 50 80" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  if (level === 'chuddi') {
    return (
      <>
        <svg className="absolute top-0 left-1/2 w-32 h-40 opacity-20 pointer-events-none text-black" viewBox="0 0 100 100">
          <path d="M 50 0 L 30 20 L 45 40 L 20 60 L 35 80 L 10 100" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 45 40 L 60 50 L 55 70" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </>
    );
  }

  // DHOOM CHUDDI - Realistic Shattered Glass / Earth Crack
  return (
    <>
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none text-black" preserveAspectRatio="none" viewBox="0 0 400 300">
        <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Main deep fractures originating from right-center impact (320, 100) */}
          <path d="M 320 100 L 270 110 L 220 140 L 150 130 L 80 180 L 0 170" strokeWidth="4" />
          <path d="M 320 100 L 290 150 L 300 220 L 250 280 L 220 300" strokeWidth="4" />
          <path d="M 320 100 L 350 160 L 330 240 L 370 300" strokeWidth="3" />
          <path d="M 320 100 L 360 60 L 400 80" strokeWidth="3" />
          <path d="M 320 100 L 280 50 L 250 0" strokeWidth="3.5" />
          <path d="M 320 100 L 200 70 L 120 40 L 50 0" strokeWidth="3" />
          
          {/* Secondary branching fractures */}
          <path d="M 270 110 L 250 80 L 200 70" strokeWidth="2" />
          <path d="M 220 140 L 200 190 L 140 220 L 100 300" strokeWidth="2.5" />
          <path d="M 150 130 L 130 90 L 120 40" strokeWidth="1.5" />
          <path d="M 290 150 L 240 160 L 200 190" strokeWidth="2" />
          <path d="M 300 220 L 330 240" strokeWidth="1.5" />
          <path d="M 250 280 L 280 300" strokeWidth="1" />
          <path d="M 80 180 L 50 240 L 0 260" strokeWidth="2" />
          
          {/* Micro shattered webs around the impact zone */}
          <path d="M 300 90 L 295 125 L 325 130 L 335 110 Z" strokeWidth="1" />
          <path d="M 325 130 L 350 160" strokeWidth="1.5" />
          <path d="M 295 125 L 270 110" strokeWidth="1.5" />
          <path d="M 300 90 L 280 50" strokeWidth="1" />
          <path d="M 335 110 L 360 60" strokeWidth="1" />
          <path d="M 220 140 L 240 160" strokeWidth="1" />
          <path d="M 150 130 L 140 170 L 80 180" strokeWidth="1" />
        </g>
      </svg>
    </>
  );
}
