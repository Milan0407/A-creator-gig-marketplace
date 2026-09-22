import Gig from "../models/Gig.model.js";
import Booking from "../models/Booking.model.js";
import { analyzeGigMatch, createCreatorInsights, generateGigDraft, recommendAlternatives, understandSearchQuery } from "../services/ai/ai.service.js";

export const generateGig = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ success: false, message: "A short description is required." });
  const result = await generateGigDraft(prompt);
  return res.json({ success: true, data: result.data, meta: { source: result.source } });
};

export const smartSearch = async (req, res) => {
  const { query } = req.body;
  if (!query?.trim()) return res.status(400).json({ success: false, message: "A search query is required." });
  const intent = await understandSearchQuery(query);
  const gigs = await Gig.find({ status: "ACTIVE" }).sort({ rating: -1, bookingsCount: -1 }).limit(50);
  const ranked = gigs.map((gig) => { const text = `${gig.title} ${gig.description} ${gig.category} ${(gig.tags || []).join(" ")}`.toLowerCase(); const keywordScore = intent.terms.filter((term) => text.includes(term)).length; return { gig, score: keywordScore + (gig.category === intent.category ? 3 : 0) }; }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).map(({ gig }) => gig);
  return res.json({ success: true, data: ranked, meta: { category: intent.category, source: intent.source } });
};

export const getMatch = async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ success: false, message: "Gig not found" });
  const result = await analyzeGigMatch(gig, req.body.brief);
  return res.json({ success: true, data: result.data, meta: { source: result.source } });
};

export const getRecommendations = async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId).populate("gigId");
  if (!booking || booking.status !== "DECLINED" || !booking.gigId) return res.status(400).json({ success: false, message: "A declined booking with an available gig is required." });
  const originalGig = booking.gigId;
  const candidates = await Gig.find({ status: "ACTIVE", category: originalGig.category, _id: { $ne: originalGig._id } }).sort({ rating: -1, bookingsCount: -1 }).limit(8);
  const result = await recommendAlternatives({ booking, originalGig, candidates });
  return res.json({ success: true, data: result.data, meta: { source: result.source } });
};

export const getCreatorInsights = async (req, res) => {
  const { creatorName } = req.query;
  if (!creatorName?.trim()) return res.status(400).json({ success: false, message: "Creator name is required." });
  const [gigs, bookings] = await Promise.all([Gig.find({ creatorName: creatorName.trim() }), Booking.find({ creatorName: creatorName.trim() })]);
  const result = await createCreatorInsights({ creatorName: creatorName.trim(), gigs, bookings });
  return res.json({ success: true, data: result.data, meta: { source: result.source } });
};
