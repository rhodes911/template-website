import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface AboutData {
  name: string;
  title: string;
  subtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  profileImage: string;
  profileImageFocus?: { x?: number; y?: number; zoom?: number };
  rating: number;
  totalClients: string;
  ctaTitle: string;
  ctaDescription: string;
  testimonialCaseStudies?: string[];
  content: string;
  // Structured story
  storyApproachTitle?: string;
  storyApproachIcon?: string;
  storyApproachTagline?: string;
  storyApproachBody?: string;
  storyDifferentiators?: { title: string; description?: string; icon?: string }[];
  storyDifferentiatorsTitle?: string;
  storyMissionTitle?: string;
  storyMissionIcon?: string;
  storyMissionBody?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    keywords?: string[];
    targetKeywords?: { primary?: string[]; secondary?: string[] };
    openGraph?: { ogTitle?: string; ogDescription?: string; ogImage?: string };
  };
}

export function getAboutData(): AboutData {
  const aboutPath = path.join(process.cwd(), 'content', 'about.md');
  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    name: data.name,
    title: data.title,
    subtitle: data.subtitle,
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    heroDescription: data.heroDescription,
    profileImage: data.profileImage,
  profileImageFocus: data.profileImageFocus,
    rating: data.rating,
    totalClients: data.totalClients,
    ctaTitle: data.ctaTitle,
    ctaDescription: data.ctaDescription,
  testimonialCaseStudies: data.testimonialCaseStudies || [],
  content,
  storyApproachTitle: data.storyApproachTitle,
  storyApproachIcon: data.storyApproachIcon,
  storyApproachTagline: data.storyApproachTagline,
  storyApproachBody: data.storyApproachBody,
  storyDifferentiators: data.storyDifferentiators || [],
  storyDifferentiatorsTitle: data.storyDifferentiatorsTitle,
  storyMissionTitle: data.storyMissionTitle,
  storyMissionIcon: data.storyMissionIcon,
  storyMissionBody: data.storyMissionBody,
  seo: data.seo,
  };
}
