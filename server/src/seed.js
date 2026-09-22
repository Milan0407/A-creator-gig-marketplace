import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import Gig from "./models/Gig.model.js";
import Booking from "./models/Booking.model.js";

dotenv.config();

const gigs = [
  { creatorName: "Milan Chauhan", title: "I will build a modern React website for your startup", category: "Web Development", price: 18000, deliveryDays: 7, rating: 4.9, reviewCount: 24, bookingsCount: 11, tags: ["React", "Tailwind CSS", "Responsive design", "Startup website"], description: "I will design and build a fast, polished React website that gives your startup a credible online presence. You will receive responsive pages, clean components, basic SEO setup and a handover walkthrough.", image: "" },
  { creatorName: "Milan Chauhan", title: "I will create an intuitive Figma UI/UX for your mobile app", category: "UI/UX Design", price: 12000, deliveryDays: 5, rating: 4.8, reviewCount: 18, bookingsCount: 9, tags: ["Figma", "Mobile UI", "UX flows", "Prototyping"], description: "Turn your app idea into a clear, elegant user experience. I will create user flows, high-fidelity screens and a clickable Figma prototype ready for development.", image: "" },
  { creatorName: "Milan Chauhan", title: "I will edit high-retention Instagram Reels and YouTube Shorts", category: "Video Editing", price: 4500, deliveryDays: 3, rating: 4.7, reviewCount: 31, bookingsCount: 20, tags: ["Short-form video", "Reels", "Captions", "YouTube Shorts"], description: "I will transform your raw clips into fast-paced short-form videos with clean cuts, captions, hooks and platform-ready exports that keep viewers watching.", image: "" },
  { creatorName: "Milan Chauhan", title: "I will design and build a conversion-focused one-page website", category: "Web Development", price: 14000, deliveryDays: 6, rating: 4.8, reviewCount: 12, bookingsCount: 6, tags: ["Landing page", "React", "Conversion design", "Responsive design"], description: "I will design and develop a focused one-page website for a launch, campaign or service business. You will receive a responsive page with strong calls to action and a clean, modern visual system.", image: "" },
  { creatorName: "Aarav Mehta", title: "I will design a memorable logo and mini brand kit", category: "Graphic Design", price: 6500, deliveryDays: 4, rating: 4.8, reviewCount: 42, bookingsCount: 26, tags: ["Logo design", "Brand identity", "Social kit", "Canva"], description: "Get a distinctive logo plus practical colors, typography and social profile assets. The result is a simple brand system you can confidently use from day one.", image: "" },
  { creatorName: "Zoya Khan", title: "I will write SEO blog posts that sound human", category: "Content Writing", price: 2800, deliveryDays: 3, rating: 4.9, reviewCount: 37, bookingsCount: 22, tags: ["SEO writing", "Blogs", "Research", "Content strategy"], description: "I write well-researched, reader-first blog content that supports your search goals without sounding robotic. Includes keyword-aware structure, research and an original draft.", image: "" },
  { creatorName: "Kabir Singh", title: "I will create a content calendar for your Instagram growth", category: "Social Media", price: 5500, deliveryDays: 5, rating: 4.6, reviewCount: 19, bookingsCount: 13, tags: ["Instagram", "Content calendar", "Reels strategy", "Growth"], description: "Receive a practical 30-day Instagram content plan with post ideas, hooks, formats and a posting rhythm built around your audience and goals.", image: "" },
  { creatorName: "Ananya Iyer", title: "I will shoot and edit clean product photos for your brand", category: "Photography", price: 9000, deliveryDays: 6, rating: 4.9, reviewCount: 28, bookingsCount: 16, tags: ["Product photography", "E-commerce", "Retouching", "Lifestyle"], description: "I create crisp product visuals for storefronts, launch campaigns and social media. You will get edited high-resolution images with a consistent visual style.", image: "" },
  { creatorName: "Rohan Das", title: "I will build a cross-platform Flutter app MVP", category: "App Development", price: 35000, deliveryDays: 18, rating: 4.7, reviewCount: 14, bookingsCount: 7, tags: ["Flutter", "Mobile app", "Firebase", "MVP"], description: "I will build a focused cross-platform mobile MVP with thoughtfully structured screens, core user journeys and Firebase integration where needed.", image: "" },
  { creatorName: "Meera Joshi", title: "I will compose a custom lo-fi track for your video", category: "Music", price: 3800, deliveryDays: 4, rating: 4.8, reviewCount: 21, bookingsCount: 12, tags: ["Lo-fi", "Original music", "YouTube", "Background score"], description: "I will compose an original, royalty-cleared lo-fi track tailored to your video’s pacing and mood, delivered as a high-quality audio file.", image: "" },
  { creatorName: "Dev Patel", title: "I will launch a focused Meta ads campaign for your business", category: "Marketing", price: 11000, deliveryDays: 7, rating: 4.6, reviewCount: 25, bookingsCount: 15, tags: ["Meta ads", "Campaign setup", "Audience research", "Analytics"], description: "I will set up a focused Meta advertising campaign with audience research, ad copy direction, creative recommendations and a simple performance plan.", image: "" },
  { creatorName: "Nisha Kapoor", title: "I will design a conversion-focused landing page in Figma", category: "UI/UX Design", price: 8500, deliveryDays: 4, rating: 5, reviewCount: 16, bookingsCount: 10, tags: ["Landing page", "Figma", "Conversion design", "SaaS"], description: "I will design a focused landing page that communicates your value clearly, guides visitors to action and gives developers a clean handoff file.", image: "" },
  { creatorName: "Ishaan Rao", title: "I will build a fast Shopify store for your product", category: "Web Development", price: 22000, deliveryDays: 10, rating: 4.8, reviewCount: 33, bookingsCount: 19, tags: ["Shopify", "E-commerce", "Storefront", "Payments"], description: "I will build a polished Shopify storefront with product setup, essential pages, a responsive theme and purchase-ready customer journeys.", image: "" },
  { creatorName: "Sana Ali", title: "I will edit a cinematic YouTube video with storytelling", category: "Video Editing", price: 7500, deliveryDays: 5, rating: 4.9, reviewCount: 29, bookingsCount: 18, tags: ["YouTube editing", "Storytelling", "Color grading", "Motion graphics"], description: "I will shape your footage into a compelling YouTube story with thoughtful pacing, sound design, color correction and graphics where they add value.", image: "" },
  { creatorName: "Vihaan Shah", title: "I will write product copy for your website launch", category: "Content Writing", price: 4200, deliveryDays: 3, rating: 4.7, reviewCount: 20, bookingsCount: 14, tags: ["Website copy", "Product messaging", "SaaS", "Conversion copy"], description: "I will write clear website copy that explains what you do, why it matters and what visitors should do next, with a voice that fits your brand.", image: "" },
  { creatorName: "Tara Menon", title: "I will create an influencer campaign concept for your launch", category: "Marketing", price: 8000, deliveryDays: 5, rating: 4.8, reviewCount: 17, bookingsCount: 8, tags: ["Influencer marketing", "Campaign strategy", "Creator outreach", "Launch"], description: "I will map a practical influencer campaign concept with target creator profiles, campaign themes, outreach angles and success metrics for your launch.", image: "" },
  { creatorName: "Arjun Batra", title: "I will create scroll-stopping carousel posts for LinkedIn", category: "Social Media", price: 3200, deliveryDays: 3, rating: 4.6, reviewCount: 23, bookingsCount: 17, tags: ["LinkedIn", "Carousel design", "Personal brand", "B2B"], description: "I will create polished LinkedIn carousel posts with a clear narrative, visual hierarchy and editable source files to help your ideas travel further.", image: "" },
];

const bookingSeeds = [
  { gigTitle: "I will build a modern React website for your startup", clientName: "Rahul Sharma", clientEmail: "rahul@creatorgig.demo", requirements: "Build a modern five-page startup website with a pricing page, contact form and mobile-first layout.", preferredDeliveryDate: "2026-10-12", status: "PENDING", additionalNotes: "We have a rough brand palette ready." },
  { gigTitle: "I will build a modern React website for your startup", clientName: "Aman Verma", clientEmail: "aman@creatorgig.demo", requirements: "Create a simple portfolio website for a new architecture practice with project case studies.", preferredDeliveryDate: "2026-10-18", status: "PENDING", additionalNotes: "Looking for a clean editorial feel." },
  { gigTitle: "I will create an intuitive Figma UI/UX for your mobile app", clientName: "Priya Singh", clientEmail: "priya@creatorgig.demo", requirements: "Design a mobile onboarding flow and dashboard for a student habit tracking application.", preferredDeliveryDate: "2026-10-10", status: "ACCEPTED", additionalNotes: "Our developer will need Figma inspect access." },
  { gigTitle: "I will edit high-retention Instagram Reels and YouTube Shorts", clientName: "Rahul Sharma", clientEmail: "rahul@creatorgig.demo", requirements: "Edit five short fitness coaching clips into vertical Reels with clear captions and strong hooks.", preferredDeliveryDate: "2026-10-08", status: "DECLINED", declineReason: "I am not available for the requested delivery window, but similar video editors are available.", additionalNotes: "Raw footage is already organized." },
  { gigTitle: "I will design and build a conversion-focused one-page website", clientName: "Aman Verma", clientEmail: "aman@creatorgig.demo", requirements: "Create a one-page launch website for a sustainable skincare brand with product highlights and a waitlist form.", preferredDeliveryDate: "2026-10-20", status: "PENDING", additionalNotes: "We have product photos and draft copy ready." },
  { gigTitle: "I will design and build a conversion-focused one-page website", clientName: "Priya Singh", clientEmail: "priya@creatorgig.demo", requirements: "Build a focused landing page for a student events platform with a clear event discovery flow.", preferredDeliveryDate: "2026-10-22", status: "PENDING", additionalNotes: "A simple email signup is needed." },
  { gigTitle: "I will design a memorable logo and mini brand kit", clientName: "Aman Verma", clientEmail: "aman@creatorgig.demo", requirements: "Create a playful but professional logo and palette for a sustainable stationery brand.", preferredDeliveryDate: "2026-10-15", status: "PENDING", additionalNotes: "The audience is university students and young professionals." },
];

const seed = async () => {
  await connectDB();
  let insertedGigs = 0;
  for (const gigData of gigs) {
    const existing = await Gig.findOne({ creatorName: gigData.creatorName, title: gigData.title });
    if (!existing) { await Gig.create(gigData); insertedGigs += 1; }
  }

  let insertedBookings = 0;
  for (const bookingData of bookingSeeds) {
    const gig = await Gig.findOne({ title: bookingData.gigTitle });
    if (!gig) continue;
    const existing = await Booking.findOne({ gigId: gig._id, clientEmail: bookingData.clientEmail, requirements: bookingData.requirements });
    if (!existing) {
      const { gigTitle, ...booking } = bookingData;
      await Booking.create({ ...booking, gigId: gig._id, creatorName: gig.creatorName });
      insertedBookings += 1;
    }
  }

  console.log(`Seed complete: ${insertedGigs} gigs and ${insertedBookings} bookings inserted.`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
