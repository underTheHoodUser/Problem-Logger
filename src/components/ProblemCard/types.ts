export type SeverityLevel = 'dhoom' | 'chuddi' | 'dhoom_chuddi';

export interface ProblemCardProps {
  id?: string | number;
  content: string;
  level: SeverityLevel;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  index: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
}
