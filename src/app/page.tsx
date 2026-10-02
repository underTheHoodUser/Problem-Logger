import { ProblemCard, SeverityLevel } from '@/components/ProblemCard';
import { PAGE_STRINGS } from '@/constants/strings';

// Map dummy problems to the expected format
const MOCK_PROBLEMS = PAGE_STRINGS.HOME.DUMMY_PROBLEMS.map((prob, index) => {
  // Map index to severity for demo purposes
  const level: SeverityLevel = index === 0 ? 'dhoom' : index === 1 ? 'chuddi' : 'dhoom_chuddi';
  return {
    id: prob.id,
    content: prob.content,
    level,
    upvotes: Math.floor(Math.random() * 100) + 10,
    downvotes: Math.floor(Math.random() * 10),
    createdAt: prob.timeAgo
  };
});

export default function Home() {
  return (
    <div className="py-4 space-y-6">
      
      <div className="grid gap-6">
        {MOCK_PROBLEMS.map((problem, index) => (
          <ProblemCard 
            key={problem.id}
            index={index}
            {...problem}
          />
        ))}
      </div>
    </div>
  );
}
