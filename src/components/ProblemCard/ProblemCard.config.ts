import { SeverityLevel } from '@/types/problem.type';

export const SEVERITY_CONFIG: Record<SeverityLevel, { color: string; text: string; border: string; shadow: string; bg: string }> = {
  dhoom: {
    color: "bg-green-400 text-black",
    text: "DHOOM",
    border: "border-green-500",
    shadow: "shadow-[8px_8px_0_0_#4ade80]",
    bg: "bg-green-50",
  },
  chuddi: {
    color: "bg-yellow-400 text-black",
    text: "CHUDDI",
    border: "border-yellow-500",
    shadow: "shadow-[8px_8px_0_0_#facc15]",
    bg: "bg-yellow-50",
  },
  dhoom_chuddi: {
    color: "bg-red-500 text-white",
    text: "DHOOM CHUDDI",
    border: "border-red-600",
    shadow: "shadow-[8px_8px_0_0_#ef4444]",
    bg: "bg-red-50",
  },
};

export const CARD_ROTATIONS = [
  "-rotate-1",
  "rotate-1",
  "-rotate-2",
  "rotate-0"
];
