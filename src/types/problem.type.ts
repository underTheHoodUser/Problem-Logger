export type SeverityLevel = 'dhoom' | 'chuddi' | 'dhoom_chuddi';

export interface Problem {
  id: string;
  content: string;
  level: SeverityLevel;
  upvotes: number;
  downvotes: number;
  is_approved: boolean;
  ip_address: string;
  author_name?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  problem_id: string;
  content: string;
  author_name: string;
  created_at: string;
}
