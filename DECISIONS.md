# CreatorGig product decisions

This document records the three required decision points for the CreatorGig marketplace.

## DP1 — Rejection: what happens after a creator declines?

The client sees the booking as **DECLINED** and can read the creator’s decline reason. They can revisit the original gig to understand the service and immediately receive recommended alternatives, including an AI-generated reason when OpenRouter is available.

This is more respectful of the client’s time than a silent rejection. It keeps the project moving while making the decision understandable, and the deterministic recommendation fallback still works if AI is unavailable.

## DP2 — Double booking: can a gig receive more than one pending request?

Yes. A creator may receive multiple **PENDING** requests for the same gig so they can compare scope, timing, and fit before committing to one client.

Once the creator accepts a request, the gig is atomically reserved and paused. Every other pending request for that gig becomes **DECLINED** with the reason: “The creator accepted another booking for this gig.” This preserves creator choice while preventing multiple accepted bookings for the same offering.

## DP3 — Discovery: how are gigs ranked?

CreatorGig always provides visible, explainable controls: newest, popularity, rating, price, category, and keyword search. These controls make it clear why a result moved and keep discovery usable even if AI is unavailable.

When AI intent search is enabled, the backend uses OpenRouter to classify the client’s natural-language intent and extracts useful terms before ranking relevant categories and gigs. If that call fails, it automatically falls back to deterministic intent/category and keyword ranking rather than leaving the marketplace unusable.
