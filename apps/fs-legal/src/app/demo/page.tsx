import { SecureShare } from '@/components/features/SecureShare';
import { Shell } from '@/components/ui/Shell';
import type { Metadata } from 'next';
import { pageMetadata } from '@repo/seo';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(SITE, '/demo');

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
