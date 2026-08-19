import { Heart, Star } from "lucide-react";
import type { PlayerCardT } from "../types";
import { countryFlagEmoji } from "../utils/flag";

export function PlayerCard({ player }: { player: PlayerCardT }) {
  return (
    // <Link
    //   to="/org-dashboard"
    //   className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    // >
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={player.imageUrl}
          alt={player.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Favorite player"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/85 text-foreground/70 backdrop-blur transition-colors hover:text-primary"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
          <span className="mr-1">{countryFlagEmoji(player.countryCode)}</span>
          {player.country}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{player.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            {player.rating.toFixed(1)}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {player.playingRole} · {player.experienceYears} yrs
        </p>
      </div>
      </div>
    // </Link>
  );
}

// export function PlayerCard({ player }: { player: PlayerCardT }) {
//   return (
//     <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
//       <Link
//         to="/org-dashboard"
//         className="relative aspect-[4/5] overflow-hidden bg-muted"
//       >
//       </Link>
//         <img
//           src={player.imageUrl}
//           alt={player.name}
//           loading="lazy"
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />
      
//       <button
//         type="button"
//         aria-label="Favorite player"
//         onClick={(e) => {
//           e.preventDefault();
//         }}
//         className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/85 text-foreground/70 backdrop-blur transition-colors hover:text-primary"
//       >
//         <Heart className="h-4 w-4" />
//       </button>
      
//       <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
//         <span className="mr-1">{countryFlagEmoji(player.countryCode)}</span>
//         {player.country}
//       </span>
      
//       <div className="flex flex-1 flex-col gap-1 p-3">
//         <div className="flex items-start justify-between gap-2">
//           <h3 className="truncate text-sm font-semibold">{player.name}</h3>
//           <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-amber-500">
//             <Star className="h-3 w-3 fill-current" />
//             {player.rating.toFixed(1)}
//           </span>
//         </div>
//         <p className="truncate text-xs text-muted-foreground">
//           {player.playingRole} · {player.experienceYears} yrs
//         </p>
//       </div>
//     </div>
//   );
// }