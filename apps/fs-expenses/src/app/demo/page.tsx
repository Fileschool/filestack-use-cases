import { ReceiptReader } from '@/components/features/ReceiptReader';
import { Shell } from '@/components/ui/Shell';

export default function DemoPage() {
  return (
    <Shell
      title="Capture a receipt"
      intro="Photograph a receipt the way your team actually would, at an angle, on a dark table, slightly creased. It will be straightened, corrected and read, with every figure marked on the image where we found it."
    >
      <ReceiptReader />
    </Shell>
  );
}
