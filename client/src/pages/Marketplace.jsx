import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import api from "../services/api.js";
import GigCard from "../components/GigCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

const categories = [
  "All",
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Graphic Design",
  "Video Editing",
  "Photography",
  "Content Writing",
  "Social Media",
  "Music",
  "Marketing",
];

const Marketplace = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [smartSearch, setSmartSearch] = useState(true);
  const [searchNote, setSearchNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchGigs = useCallback(async () => {
    const activeSearch = searchRef.current.trim();
    try {
      setLoading(true);
      setError("");
      setSearchNote("");

      if (smartSearch && activeSearch) {
        try {
          const response = await api.post("/ai/search", { query: activeSearch });
          setGigs(response.data.data);
          setSearchNote(response.data.meta.source === "openrouter" ? `AI understood your ${response.data.meta.category} intent and ranked the most relevant gigs.` : `Smart search matched ${response.data.meta.category} intent using explainable ranking.`);
          return;
        } catch {
          setSearchNote("Smart search is unavailable, so results use standard keyword search.");
        }
      }

      const params = {
        sort,
      };

      if (activeSearch) {
        params.search = activeSearch;
      }

      if (category !== "All") {
        params.category = category;
      }

      const response = await api.get("/gigs", {
        params,
      });

      setGigs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch gigs:", error);

      setError(
        "Unable to load gigs. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, [category, smartSearch, sort]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- The asynchronous request updates state after its response.
    fetchGigs();
  }, [fetchGigs]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchGigs();
  };

  return (
    <div className="min-h-screen bg-[#fafaff]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-fuchsia-200/40 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-indigo-700 shadow-sm">
              CREATOR MARKETPLACE
            </div>

            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-950 md:text-5xl">
              Find creators for your next project.
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Discover talented creators across development, design,
              content, video and more.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="relative mt-8 max-w-3xl"
          >
            <SearchBar
              value={search}
              onChange={setSearch}
            />
            <label className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/70 px-2 py-1 text-sm font-medium text-slate-600"><input type="checkbox" checked={smartSearch} onChange={(event) => setSmartSearch(event.target.checked)} className="accent-indigo-600" /> Use AI intent search</label>
          </form>
        </div>
      </section>

      {/* Marketplace */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3 px-1 lg:mt-0">
            <SlidersHorizontal className="h-4 w-4 text-indigo-500" />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-8">
          <p className="text-sm font-medium text-slate-500">
            {loading ? "Loading..." : `${gigs.length} gigs found`}
          </p>
          {searchNote && <p className="mt-1 inline-flex rounded-md bg-indigo-50 px-2 py-1 text-sm text-indigo-700">✦ {searchNote}</p>}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* Gigs */}
        {!loading && !error && gigs.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && gigs.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <div className="text-4xl">🔍</div>

            <h2 className="mt-4 text-xl font-semibold">
              No gigs found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Marketplace;
