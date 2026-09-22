import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Star } from "lucide-react";
import { getGigCover } from "../lib/gigCovers.js";

const GigCard = ({ gig }) => {
  const coverImage = getGigCover(gig);
  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/70"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={gig.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/35 to-transparent" />
        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-sm transition group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
          {gig.category}
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900">
          {gig.title}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          by {gig.creatorName}
        </p>

        {/* Stats */}
        <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-500" />
            {Number(gig.rating || 0).toFixed(1)}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {gig.deliveryDays} days
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">
            Starting at
          </span>

          <span className="text-lg font-extrabold text-slate-950">
            ₹{Number(gig.price || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
