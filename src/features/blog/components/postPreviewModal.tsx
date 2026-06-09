import React from "react";
import { X, Monitor, Tablet, Smartphone, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/features/blog/types/types";

type PreviewDevice = "desktop" | "tablet" | "mobile";

interface PostPreviewModalProps {
  post: BlogPost;
  device: PreviewDevice;
  onDeviceChange: (d: PreviewDevice) => void;
  onClose: () => void;
}

const DEVICE_CONFIG: Record<PreviewDevice, { width: string; label: string; icon: React.ReactNode }> = {
  desktop: { width: "100%",   label: "Escritorio", icon: <Monitor    className="w-4 h-4" /> },
  tablet:  { width: "768px",  label: "Tablet",  icon: <Tablet     className="w-4 h-4" /> },
  mobile:  { width: "390px",  label: "Móvil",  icon: <Smartphone className="w-4 h-4" /> },
};

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  post,
  device,
  onDeviceChange,
  onClose,
}) => {
  const cfg = DEVICE_CONFIG[device];

  // Estimate reading time
  const wordCount = post.postContent.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = new Date(post.postDate || Date.now()).toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f1f1f1] dark:bg-zinc-900 animate-in fade-in duration-150">

      {/* ── Top bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-12 bg-white dark:bg-zinc-950 border-b shadow-sm flex-shrink-0">
        {/* Left: title */}
        <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase truncate max-w-xs">
          {post.postTitle || "Sin título"}
        </span>

        {/* Center: device switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((d) => {
            const { icon, label } = DEVICE_CONFIG[d];
            return (
              <button
                key={d}
                type="button"
                title={label}
                onClick={() => onDeviceChange(d)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${device === d
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
                {device === d && <Check className="w-3 h-3 text-primary hidden sm:block" />}
              </button>
            );
          })}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs hidden sm:flex"
            onClick={() => post.postName && window.open(`/blog/${post.postName}`, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Nueva pestaña
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Cerrar preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Preview canvas ────────────────────────────────── */}
      <div className="flex-1 overflow-auto flex justify-center items-start py-6 px-4">
        <div
          className="bg-white dark:bg-zinc-950 shadow-xl rounded-lg overflow-hidden transition-all duration-300 w-full"
          style={{ maxWidth: cfg.width }}
        >
          {/* Featured image */}
          {post.seoData?.ogImage && (
            <div className="w-full aspect-video overflow-hidden">
              <img
                src={post.seoData.ogImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article content */}
          <article className="px-8 py-10 max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{readingTime} min de lectura</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-6 text-foreground">
              {post.postTitle || <span className="text-muted-foreground italic">Sin título</span>}
            </h1>

            {/* Excerpt */}
            {post.postExcerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary/30 pl-4 italic">
                {post.postExcerpt}
              </p>
            )}

            {/* Body HTML */}
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-p:leading-relaxed prose-p:text-base
                prose-img:rounded-xl prose-img:shadow-lg prose-img:w-full prose-img:aspect-square prose-img:object-cover
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: post.postContent || "<p class='text-muted-foreground italic'>Sin contenido aún...</p>" }}
            />
          </article>
        </div>
      </div>
    </div>
  );
};
