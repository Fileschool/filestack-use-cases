import { PhotoRescue } from '@/components/features/PhotoRescue';
import { Shell } from '@/components/ui/Shell';

export default function DemoPage() {
  return (
    <Shell
      title="List an item"
      intro="Upload the photo you already have. We will correct the colour, bring it up to size if it is small, and show you how it will appear across the market before you publish."
    >
      <PhotoRescue />
    </Shell>
  );
}
