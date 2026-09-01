import { Button } from "@/components/ui/button";
import { IconCamera, IconFile } from "@/components/ui/icons";
import type { Upload } from "@/lib/types";

interface UploadFieldProps {
  label: string;
  upload: Upload;
  onCapture: () => void;
  onRetry: () => void;
  onReplace: () => void;
}

/** The four states an ID photo upload moves through: empty, uploading, done, failed. */
export function UploadField({ label, upload, onCapture, onRetry, onReplace }: UploadFieldProps) {
  return (
    <div>
      <div className="mb-2 text-[11px] tracking-widest uppercase text-ink/65">{label}</div>

      {upload.status === "empty" && (
        <div className="grid gap-2.5 border-2 border-dashed border-neutral-500 p-4">
          <p className="m-0 text-sm text-neutral-800">
            A clear photo of the document. Glare is fine as long as the number is readable.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="primary" block className="min-h-12" onClick={onCapture}>
              <IconCamera />
              Take photo
            </Button>
            <Button variant="secondary" block className="min-h-12" onClick={onCapture}>
              <IconFile />
              Choose file
            </Button>
          </div>
        </div>
      )}

      {upload.status === "uploading" && (
        <div className="border border-ink/40 bg-panel p-3.5">
          <div className="mb-2 flex justify-between text-sm">
            <span>Uploading id-page.jpg</span>
            <span className="text-neutral-700">{upload.pct}%</span>
          </div>
          <div className="h-2 bg-neutral-400">
            <div className="h-2 bg-accent transition-[width]" style={{ width: `${upload.pct}%` }} />
          </div>
        </div>
      )}

      {upload.status === "done" && (
        <div className="flex items-start gap-3 border border-ink/40 bg-panel p-3">
          <div className="grid h-11 w-16 flex-none place-items-center bg-neutral-800 text-[9px] tracking-widest text-neutral-200">
            ID PAGE
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{upload.fileName ?? "id-page.jpg"}</div>
            <div className="text-xs text-neutral-700">1.2 MB · uploaded</div>
          </div>
          <Button variant="ghost" className="flex-none text-[13px]" onClick={onReplace}>
            Replace
          </Button>
        </div>
      )}

      {upload.status === "failed" && (
        <div className="border-2 border-accent p-3.5">
          <div className="mb-1 font-heading text-sm font-extrabold text-accent-700">
            Upload stopped at {upload.pct}%
          </div>
          <p className="m-0 mb-2.5 text-sm">
            The connection dropped. Nothing was saved. Try again, or send a smaller photo if
            you&apos;re on a weak connection.
          </p>
          <div className="flex gap-2">
            <Button variant="primary" className="min-h-11" onClick={onRetry}>
              Try again
            </Button>
            <Button variant="secondary" className="min-h-11" onClick={onCapture}>
              Take a new photo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
