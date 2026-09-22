import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import api from "../services/api.js";
import { useDemoUser } from "../context/useDemoUser.js";

const categories = ["Web Development", "App Development", "UI/UX Design", "Graphic Design", "Video Editing", "Photography", "Content Writing", "Social Media", "Music", "Marketing", "Other"];
const PostGig = () => {
  const { currentUser } = useDemoUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "Web Development", price: "", deliveryDays: "", tags: "", image: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const response = await api.post("/gigs", { ...form, creatorName: currentUser.name, price: Number(form.price), deliveryDays: Number(form.deliveryDays), tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
      navigate(`/gigs/${response.data.data._id}`);
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to publish your gig. Please check the details and try again."); }
    finally { setSaving(false); }
  };
  const generate = async () => { if (!aiPrompt.trim()) return; setGenerating(true); setError(""); try { const response = await api.post("/ai/generate-gig", { prompt: aiPrompt }); const draft = response.data.data; setForm({ ...form, ...draft, tags: draft.tags.join(", ") }); } catch { setError("AI assist is unavailable. You can still complete the form manually."); } finally { setGenerating(false); } };
  return <div className="bg-gray-50 py-12"><div className="mx-auto max-w-3xl px-6"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Creator studio</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Publish a service clients can book.</h1><p className="mt-3 text-gray-600">Posting as {currentUser.name}. This is a demo identity, not a login.</p></div><form onSubmit={submit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"><div className="mb-6 rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0" /><div><strong>AI gig generator</strong><p className="mt-1">Describe your service and get an editable first draft. This explainable fallback works even without an external AI key.</p></div></div><div className="mt-3 flex flex-col gap-2 sm:flex-row"><input value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="I create short-form videos for Instagram and YouTube" className="min-w-0 flex-1 rounded-xl border border-indigo-200 bg-white px-3 py-2 outline-none focus:border-indigo-500" /><button type="button" onClick={generate} disabled={generating || !aiPrompt.trim()} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{generating ? "Generating…" : "Generate"}</button></div></div>{error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="grid gap-5"><Field label="Gig title" name="title" value={form.title} onChange={update} placeholder="I will build a polished React landing page" minLength="5" required /><label className="grid gap-2 text-sm font-medium text-gray-800">Description<textarea name="description" value={form.description} onChange={update} required minLength="20" rows="6" placeholder="Explain what clients receive, your process and the kind of projects you do." className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-gray-800">Category<select name="category" value={form.category} onChange={update} className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><Field label="Starting price (₹)" name="price" type="number" min="1" value={form.price} onChange={update} required /></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Delivery days" name="deliveryDays" type="number" min="1" max="365" value={form.deliveryDays} onChange={update} required /><Field label="Tags (comma separated)" name="tags" value={form.tags} onChange={update} placeholder="React, UI design, startup" /></div><Field label="Cover image URL (optional)" name="image" type="url" value={form.image} onChange={update} placeholder="https://..." /></div><button disabled={saving} className="mt-8 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Publishing…" : "Publish gig"}</button></form></div></div>;
};
const Field = ({ label, ...props }) => <label className="grid gap-2 text-sm font-medium text-gray-800">{label}<input {...props} className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" /></label>;
export default PostGig;
