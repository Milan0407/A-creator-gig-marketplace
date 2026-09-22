import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, Star, Tag } from "lucide-react";
import api from "../services/api.js";
import { getGigCover } from "../lib/gigCovers.js";

const GigDetails = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [error, setError] = useState("");
  const [brief, setBrief] = useState("");
  const [match, setMatch] = useState(null);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    api.get(`/gigs/${id}`).then((response) => setGig(response.data.data)).catch((requestError) => {
      setError(requestError.response?.data?.message || "We could not load this gig.");
    });
  }, [id]);

  if (error) return <PageMessage title="Gig unavailable" message={error} />;
  if (!gig) return <div className="mx-auto max-w-7xl px-6 py-20 text-gray-500">Loading gig details…</div>;
  const analyzeMatch = async () => {
    if (!brief.trim()) return;
    setMatching(true);
    try { const response = await api.post(`/ai/match/${gig._id}`, { brief }); setMatch(response.data.data); } catch { setMatch({ label: "Review match", factors: ["Match analysis is unavailable; compare this gig’s scope with your brief."] }); } finally { setMatching(false); }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"><ArrowLeft className="h-4 w-4" /> Back to marketplace</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="aspect-[16/8] bg-gradient-to-br from-indigo-100 via-white to-purple-100">
              <img src={getGigCover(gig)} alt={gig.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">{gig.category}</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">{gig.title}</h1>
              <p className="mt-4 text-gray-600">Created by <span className="font-semibold text-gray-900">{gig.creatorName}</span></p>
              <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-600">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {Number(gig.rating || 0).toFixed(1)} ({gig.reviewCount || 0} reviews)</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {gig.deliveryDays} day delivery</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Available to request</span>
              </div>
              <div className="mt-10 border-t border-gray-100 pt-8"><h2 className="text-xl font-bold">About this gig</h2><p className="mt-4 whitespace-pre-line leading-7 text-gray-600">{gig.description}</p></div>
              {gig.tags?.length > 0 && <div className="mt-8"><h2 className="text-xl font-bold">Skills & deliverables</h2><div className="mt-4 flex flex-wrap gap-2">{gig.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"><Tag className="h-3.5 w-3.5" />{tag}</span>)}</div></div>}
            </div>
          </article>
          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <p className="text-sm text-gray-500">Starting at</p><p className="mt-1 text-4xl font-bold">₹{Number(gig.price).toLocaleString("en-IN")}</p>
            <div className="my-6 border-t border-gray-100" />
            <p className="text-sm leading-6 text-gray-600">Send a project brief. The creator will review it before accepting your request.</p>
            <Link to={`/booking/${gig._id}`} className="mt-6 block rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-indigo-700">Book this gig</Link>
            <div className="mt-6 rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900"><p className="font-semibold">AI match analysis</p><p className="mt-1">Add a short project brief for transparent match factors.</p><textarea value={brief} onChange={(event) => setBrief(event.target.value)} rows="3" placeholder="I need a modern React website for my startup" className="mt-3 w-full rounded-xl border border-indigo-200 bg-white p-2 text-gray-800 outline-none focus:border-indigo-500" /><button onClick={analyzeMatch} disabled={matching || !brief.trim()} className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white disabled:opacity-60">{matching ? "Analyzing…" : "Analyze match"}</button>{match && <div className="mt-3 rounded-xl bg-white p-3 text-gray-700"><p className="font-semibold text-indigo-700">{match.label}</p><ul className="mt-1 list-disc space-y-1 pl-4">{match.factors.map((factor) => <li key={factor}>{factor}</li>)}</ul></div>}</div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const PageMessage = ({ title, message }) => <div className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="text-2xl font-bold">{title}</h1><p className="mt-3 text-gray-600">{message}</p><Link to="/marketplace" className="mt-6 inline-block text-indigo-600">Browse available gigs</Link></div>;
export default GigDetails;
