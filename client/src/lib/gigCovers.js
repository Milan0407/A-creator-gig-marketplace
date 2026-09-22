import contentMarketingCover from "../assets/gig-covers/content-marketing.png";
import designProductCover from "../assets/gig-covers/design-product.png";
import videoEditingCover from "../assets/gig-covers/video-editing.png";
import webDevelopmentCover from "../assets/gig-covers/web-development.png";

const categoryCovers = {
  "Web Development": webDevelopmentCover,
  "App Development": designProductCover,
  "UI/UX Design": designProductCover,
  "Graphic Design": designProductCover,
  Photography: designProductCover,
  "Video Editing": videoEditingCover,
  "Content Writing": contentMarketingCover,
  "Social Media": contentMarketingCover,
  Marketing: contentMarketingCover,
  Music: videoEditingCover,
  Other: designProductCover,
};

export const getGigCover = (gig) => gig.image || categoryCovers[gig.category] || designProductCover;
