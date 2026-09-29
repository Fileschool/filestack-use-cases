import { SecureShare } from '@/components/features/SecureShare';
import { Shell } from '@/components/ui/Shell';

export default function DemoPage() {
  return (
    <Shell
      title="The client room"
      intro="Documents issued to you appear here. Each link is created for one named recipient and stops working at the time shown. Anything you send back is checked before it reaches a fee earner."
    >
      <SecureShare />
    </Shell>
  );
}
