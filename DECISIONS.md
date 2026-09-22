# Product decisions

## DP1 — Rejection

Clients see a declined status and the creator’s decline reason so that they are not left guessing about an outcome. They can revisit the original gig and see similar available gigs, helping them continue their project rather than restarting their search. The current recommendations use a transparent category-based fallback and can be upgraded to AI recommendations later.

## DP2 — Double booking

Multiple clients may submit pending requests for the same gig so a creator can compare opportunities before committing. Once the creator accepts one request, all other pending requests for that gig are automatically declined with a clear explanation. This prevents a creator from accidentally accepting overlapping work.

## DP3 — Discovery

Marketplace discovery supports newest, popularity, rating and price sorting, alongside keyword search and category filtering. These controls are visible and explainable, so users understand why results move. The planned AI layer will add semantic relevance while keeping these core controls available as a fallback.
