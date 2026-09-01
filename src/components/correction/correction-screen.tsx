import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { HOST } from "@/lib/constants";

/** Shown when the host reopens a single step and asks the guest to fix it. */
export function CorrectionScreen() {
  const hostFirstName = HOST.name.split(" ")[0];

  return (
    <div className="grid max-w-140 gap-4 px-4 pt-5.5 pb-6 sm:px-0 sm:py-0 sm:gap-5">
      <Tag variant="solid" className="w-fit">
        One fix needed
      </Tag>
      <h3 className="m-0 text-[26px] sm:text-[32px]">{hostFirstName} needs a clearer photo</h3>

      <div className="border-l-2 border-accent bg-panel px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="mb-1 text-[11px] tracking-widest uppercase text-ink/65">
          {HOST.name} wrote
        </div>
        <p className="m-0 text-[13.5px] sm:text-sm">
          &ldquo;The passport photo is cut off at the bottom — I can&apos;t read the number
          line. Could you retake it in better light?&rdquo;
        </p>
      </div>

      <p className="m-0 text-[13px] text-neutral-800 sm:text-sm">
        Only the ID step is open. Everything else stays as you sent it.
      </p>

      <div className="border-t-2 border-ink/40 pt-2.5">
        <div className="flex justify-between py-2">
          <span className="text-[13px] sm:text-sm">Step 3 · Your ID</span>
          <span className="text-xs text-accent-700">Reopened</span>
        </div>
        <div className="flex justify-between py-2 opacity-50">
          <span className="text-[13px] sm:text-sm">Steps 1, 2, 4, 5</span>
          <span className="text-xs">Locked · accepted</span>
        </div>
      </div>

      <Link href="/" className="sm:w-fit">
        <Button variant="primary" block className="min-h-12">
          Retake the passport photo
        </Button>
      </Link>
    </div>
  );
}
