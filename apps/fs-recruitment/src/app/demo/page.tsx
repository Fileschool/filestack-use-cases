import { CandidateReview } from '@/components/features/CandidateReview';
import { Shell } from '@/components/ui/Shell';

export default function DemoPage() {
  return (
    <Shell
      title="Review an application"
      intro="Add a candidate's CV to the pipeline. The attachment stays locked until screening reports back, then opens in the browser without downloading anything to your machine."
    >
      <CandidateReview />
    </Shell>
  );
}
