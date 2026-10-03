export type SeverityLevel = 'dhoom' | 'chuddi' | 'dhoom chuddi';

export interface Problem {
  id: string;
  content: string;
  level: SeverityLevel;
  upvotes: number;
  downvotes: number;
  is_approved: boolean;
  ip_address: string;
  created_at: string;
}
