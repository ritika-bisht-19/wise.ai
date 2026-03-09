import type { BlogPagePost } from './types';

export const tagColors: Record<string, string> = {
  Product: 'bg-[#EEF2FF] text-[#3730A3]',
  Research: 'bg-[#FFF7ED] text-[#e6651b]',
  Community: 'bg-[#F0FDF4] text-[#166534]',
  Tips: 'bg-[#FDF2F8] text-[#9d174d]',
};

export const blogPosts: BlogPagePost[] = [
  { tag: 'Product', title: 'Introducing W.I.S.E. 2.0 — Body Language & Voice Analytics', excerpt: 'Our biggest update yet adds real-time body language tracking and expanded voice analytics to help you nail every interview.', date: 'Jun 15, 2025' },
  { tag: 'Research', title: 'How AI Mock Interviews Reduce Interview Anxiety by 87%', excerpt: 'A study of 5,000 users shows measurable improvement in confidence, speech clarity, and stress management after just 5 sessions.', date: 'May 28, 2025' },
  { tag: 'Community', title: 'W.I.S.E. Partners with 50+ Universities Worldwide', excerpt: 'From IIT Delhi to Stanford, campuses are integrating W.I.S.E. into career services to give students a competitive edge.', date: 'Apr 10, 2025' },
  { tag: 'Tips', title: '7 Body Language Mistakes That Cost You the Job', excerpt: 'Slouching, lack of eye contact, and fidgeting are among the top non-verbal cues that turn interviewers off. Here\'s how to fix them.', date: 'Mar 22, 2025' },
  { tag: 'Product', title: 'W.I.S.E. Campus Edition: Built for Universities', excerpt: 'Announcing our enterprise-grade solution for career centres — with admin dashboards, LMS integration, and bulk student onboarding.', date: 'Feb 14, 2025' },
  { tag: 'Research', title: 'The Science Behind Stress Detection in Interviews', excerpt: 'How we use vocal biomarkers, micro-expression analysis, and physiological signals to measure and reduce interview stress.', date: 'Jan 30, 2025' },
];
