import { avatarAccent, initials } from "@/lib/format";

type Props = {
  name: string;
  accent?: string;
  size?: "sm" | "md" | "lg";
};

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
};

export function Avatar({ name, accent = "indigo", size = "md" }: Props) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${SIZES[size]} ${avatarAccent(accent)}`}
    >
      {initials(name)}
    </span>
  );
}
