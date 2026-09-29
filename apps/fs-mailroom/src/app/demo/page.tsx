import { Mailroom } from '@/components/features/Mailroom';
import { Shell } from '@/components/ui/Shell';

export default function DemoPage() {
  return (
    <Shell
      title="This morning's post"
      intro="Envelopes scanned at the Leeds facility appear here as they are processed. Each one is read, matched against your staff list and filed. Anything we cannot match is held for a supervisor rather than guessed at."
    >
      <Mailroom />
    </Shell>
  );
}
