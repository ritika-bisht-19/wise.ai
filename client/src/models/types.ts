import type { ReactNode } from 'react';

export interface NavChild {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  children: NavChild[];
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface WhyFeature {
  title: string;
  description: string;
}

export interface Layer {
  title: string;
  description: string;
  pills: string[];
  cardLabel: string;
  cardIcon: ReactNode;
}

export interface DemoTab {
  label: string;
  key: string;
}

export interface DemoContent {
  title: string;
  description: string;
}

export interface SecurityBadge {
  title: string;
  subtitle: string;
  icon: ReactNode;
}

export interface HomeBlogPost {
  tag: string;
  title: string;
  description: string;
  date: string;
  href: string;
}

export interface BlogPagePost {
  tag: string;
  title: string;
  excerpt: string;
  date: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface FeatureCategory {
  category: string;
  items: FeatureItem[];
}

export interface Step {
  number: string;
  title: string;
  description: string;
  details: string[];
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  ctaStyle: string;
  popular?: boolean;
  features: string[];
}

export interface FAQ {
  q: string;
  a: string;
}
