const categorySignals = {
  "Web Development": ["website", "web", "react", "landing page", "frontend", "backend", "startup", "ecommerce"],
  "App Development": ["app", "mobile", "android", "ios", "flutter"],
  "UI/UX Design": ["ui", "ux", "figma", "prototype", "user experience"],
  "Graphic Design": ["logo", "branding", "poster", "graphic", "illustration"],
  "Video Editing": ["video", "reel", "youtube", "short-form", "editing"],
  Photography: ["photo", "photography", "product shoot"],
  "Content Writing": ["writing", "article", "blog", "copy", "seo"],
  "Social Media": ["social", "instagram", "linkedin", "content calendar"],
  Music: ["music", "song", "audio", "voiceover"],
  Marketing: ["marketing", "ads", "campaign", "growth"],
};

const categories = Object.keys(categorySignals);

const parseJsonResponse = (content) => {
  try {
    const cleanContent = content.replace(/^```json\s*|^```\s*|\s*```$/g, "").trim();
    return JSON.parse(cleanContent);
  } catch {
    return null;
  }
};

const requestOpenRouterJson = async ({ system, user, maxTokens = 500 }) => {
  if (!process.env.OPENROUTER_API_KEY) return null;

  const timeoutMs = Math.min(Math.max(Number(process.env.OPENROUTER_TIMEOUT_MS) || 30000, 5000), 60000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
        "X-OpenRouter-Title": "CreatorGig",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openrouter/free",
        temperature: 0.3,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      console.warn(`OpenRouter request failed with status ${response.status}`);
      return null;
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    return typeof content === "string" ? parseJsonResponse(content) : null;
  } catch (error) {
    console.warn(`OpenRouter request failed: ${error.name}`);
    return null;
  }
};

export const inferCategory = (prompt = "") => {
  const query = prompt.toLowerCase();
  return Object.entries(categorySignals)
    .map(([category, signals]) => ({ category, score: signals.filter((signal) => query.includes(signal)).length }))
    .sort((a, b) => b.score - a.score)[0] || { category: "Other", score: 0 };
};

export const createGigDraft = (prompt) => {
  const { category } = inferCategory(prompt);
  const defaults = {
    "Web Development": { title: "I will build a modern website for your business", price: 15000, deliveryDays: 7, tags: ["Responsive design", "Modern UI", "Web development"] },
    "App Development": { title: "I will build a polished mobile app experience", price: 25000, deliveryDays: 14, tags: ["Mobile app", "User flows", "App development"] },
    "UI/UX Design": { title: "I will design an intuitive UI/UX for your product", price: 10000, deliveryDays: 5, tags: ["Figma", "UX research", "Interface design"] },
    "Video Editing": { title: "I will edit engaging short-form videos for your brand", price: 5000, deliveryDays: 3, tags: ["Reels", "Video editing", "Social content"] },
    "Content Writing": { title: "I will write clear, conversion-focused content", price: 3000, deliveryDays: 3, tags: ["SEO", "Copywriting", "Content strategy"] },
    Other: { title: "I will create a high-quality solution for your project", price: 5000, deliveryDays: 5, tags: ["Creative services", "Client collaboration"] },
  };
  const draft = defaults[category] || defaults.Other;
  return { ...draft, category, description: `${prompt.trim()}\n\nI’ll tailor the final deliverables to your goals, share clear progress updates and deliver polished work on the agreed timeline.` };
};

export const generateGigDraft = async (prompt) => {
  const fallback = createGigDraft(prompt);
  const result = await requestOpenRouterJson({
    system: `You create concise, realistic creator-service gig drafts. Return only valid JSON with title, description, category, price, deliveryDays, and tags. category must be one of: ${categories.join(", ")}. price is an integer in INR. deliveryDays is an integer from 1 to 30. tags is an array of 3 to 6 short strings.`,
    user: `Create an editable gig draft from this creator description: ${prompt}`,
  });

  if (!result || !categories.includes(result.category) || !Number.isFinite(Number(result.price)) || !Number.isFinite(Number(result.deliveryDays)) || !Array.isArray(result.tags)) {
    return { data: fallback, source: "fallback" };
  }

  return {
    data: {
      title: String(result.title || fallback.title).slice(0, 150),
      description: String(result.description || fallback.description).slice(0, 2000),
      category: result.category,
      price: Math.max(1, Math.round(Number(result.price))),
      deliveryDays: Math.min(365, Math.max(1, Math.round(Number(result.deliveryDays)))),
      tags: result.tags.map(String).map((tag) => tag.trim()).filter(Boolean).slice(0, 6),
    },
    source: "openrouter",
  };
};

export const understandSearchQuery = async (query) => {
  const fallback = inferCategory(query);
  const result = await requestOpenRouterJson({
    system: `Classify creator marketplace search intent. Return only valid JSON with category and terms. category must be one of: ${categories.join(", ")}, Other. terms is an array of up to 8 useful lowercase search terms.`,
    user: `Understand this client search: ${query}`,
    maxTokens: 180,
  });

  if (!result || ![...categories, "Other"].includes(result.category) || !Array.isArray(result.terms)) {
    return { category: fallback.category, terms: query.toLowerCase().split(/\W+/).filter((word) => word.length > 2), source: "fallback" };
  }

  return { category: result.category, terms: result.terms.map(String).map((term) => term.toLowerCase().trim()).filter(Boolean).slice(0, 8), source: "openrouter" };
};

export const matchGig = (gig, brief = "") => {
  const query = brief.toLowerCase();
  const matches = [gig.title, gig.description, ...(gig.tags || []), gig.category].filter(Boolean).filter((value) => query.includes(String(value).toLowerCase()) || String(value).toLowerCase().split(" ").some((word) => word.length > 3 && query.includes(word)));
  const factors = [];
  if (matches.length) factors.push("Your brief overlaps with this creator’s services and skills.");
  if (gig.deliveryDays <= 7) factors.push(`Fast ${gig.deliveryDays}-day delivery window.`);
  if (gig.rating >= 4) factors.push(`Strong marketplace rating of ${gig.rating.toFixed(1)}.`);
  return { label: matches.length >= 2 ? "Strong match" : matches.length ? "Potential match" : "Review match", factors: factors.length ? factors : ["Compare this gig’s skills, price and delivery time with your brief."] };
};

export const analyzeGigMatch = async (gig, brief) => {
  const fallback = matchGig(gig, brief);
  const result = await requestOpenRouterJson({
    system: "Compare a client brief to a creator gig. Return only valid JSON with label and factors. label must be Strong match, Potential match, or Review match. factors must be an array of 2 to 4 brief, evidence-based strings. Do not invent capabilities, ratings, prices, or delivery details.",
    user: `Client brief: ${brief}\n\nGig: ${JSON.stringify({ title: gig.title, category: gig.category, description: gig.description, tags: gig.tags, price: gig.price, deliveryDays: gig.deliveryDays, rating: gig.rating })}`,
    maxTokens: 220,
  });

  if (!result || !["Strong match", "Potential match", "Review match"].includes(result.label) || !Array.isArray(result.factors)) {
    return { data: fallback, source: "fallback" };
  }

  return { data: { label: result.label, factors: result.factors.map(String).map((factor) => factor.trim()).filter(Boolean).slice(0, 4) }, source: "openrouter" };
};

export const recommendAlternatives = async ({ booking, originalGig, candidates }) => {
  const fallback = candidates.slice(0, 3).map((gig) => ({ gig, reason: `Similar ${gig.category} service with ${gig.deliveryDays}-day delivery.` }));
  if (!candidates.length) return { data: fallback, source: "fallback" };

  const result = await requestOpenRouterJson({
    system: "Recommend alternatives for a declined creator booking. Return only valid JSON with recommendations: an array of up to 3 objects containing id and reason. Only use IDs from the provided candidate list. Reasons must be concise and evidence-based using the candidate data. Do not invent availability or capabilities.",
    user: `Original gig: ${JSON.stringify({ title: originalGig.title, category: originalGig.category, price: originalGig.price, tags: originalGig.tags })}\nClient brief: ${booking.requirements}\nCandidate gigs: ${JSON.stringify(candidates.map((gig) => ({ id: String(gig._id), title: gig.title, creatorName: gig.creatorName, category: gig.category, price: gig.price, deliveryDays: gig.deliveryDays, rating: gig.rating, tags: gig.tags })))}`,
    maxTokens: 300,
  });

  if (!result || !Array.isArray(result.recommendations)) return { data: fallback, source: "fallback" };
  const candidateMap = new Map(candidates.map((gig) => [String(gig._id), gig]));
  const data = result.recommendations.map(({ id, reason }) => ({ gig: candidateMap.get(String(id)), reason: String(reason || "Similar service for your project.").trim() })).filter(({ gig, reason }) => gig && reason).slice(0, 3);
  return data.length ? { data, source: "openrouter" } : { data: fallback, source: "fallback" };
};

export const createCreatorInsights = async ({ creatorName, gigs, bookings }) => {
  const pending = bookings.filter((booking) => booking.status === "PENDING").length;
  const accepted = bookings.filter((booking) => booking.status === "ACCEPTED").length;
  const fallback = [
    pending ? `${pending} request${pending === 1 ? " is" : "s are"} waiting for your review.` : "Keep your active gigs visible to attract new requests.",
    gigs.length ? `You have ${gigs.length} active gig${gigs.length === 1 ? "" : "s"}; clear titles and specific tags improve discovery.` : "Publish a focused first gig to start receiving requests.",
    accepted ? `${accepted} booking${accepted === 1 ? " has" : "s have"} been accepted—pause or update gigs when your availability changes.` : "Review your price and delivery promise before accepting a request.",
  ];
  const result = await requestOpenRouterJson({
    system: "Create three concise, practical creator marketplace insights. Return only valid JSON with insights, an array of exactly 3 strings. Base every statement only on supplied data. Do not claim market-wide facts or make up performance data.",
    user: `Creator: ${creatorName}\nGigs: ${JSON.stringify(gigs.map((gig) => ({ title: gig.title, category: gig.category, price: gig.price, tags: gig.tags, rating: gig.rating, bookingsCount: gig.bookingsCount })))}\nBookings summary: ${JSON.stringify({ pending, accepted, declined: bookings.filter((booking) => booking.status === "DECLINED").length })}`,
    maxTokens: 220,
  });
  if (!result || !Array.isArray(result.insights) || result.insights.length !== 3) return { data: fallback, source: "fallback" };
  return { data: result.insights.map(String).map((insight) => insight.trim()).filter(Boolean).slice(0, 3), source: "openrouter" };
};
