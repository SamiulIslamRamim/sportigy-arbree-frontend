import { Heart, Play, Share2 } from "lucide-react";
import type { PlayerVideo } from "../types";



function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerVideoCard({ video }: { video: PlayerVideo }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <button
          type="button"
          aria-label="Play video"
          className="absolute inset-0 grid place-items-center"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-background/90 text-primary shadow-lg transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </button>

        <div className="absolute right-2 top-2 flex gap-1.5">
          <button
            type="button"
            aria-label="Favorite"
            className="grid h-8 w-8 place-items-center rounded-full bg-background/85 text-foreground/70 backdrop-blur transition-colors hover:text-primary"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Share"
            className="grid h-8 w-8 place-items-center rounded-full bg-background/85 text-foreground/70 backdrop-blur transition-colors hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {formatDuration(video.durationSec)}
        </span>
      </div>
    </article>
  );
}
