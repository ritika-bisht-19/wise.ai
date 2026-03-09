import type { WhyFeature, Layer, DemoTab, DemoContent, SecurityBadge, HomeBlogPost } from './types';

export const partnerLogos = Array.from({ length: 15 }, (_, i) =>
  `/assets/images/partner-logo-${String(i + 1).padStart(2, '0')}.svg`
);

export const whyWiseFeatures: WhyFeature[] = [
  { title: 'Realistic Mock Interviews', description: 'Practice with AI interviewers who adapt to your role, industry, and experience level' },
  { title: 'Real-Time Stress Analytics', description: 'Track your vocal patterns, facial cues, and physiological signals to understand and manage interview anxiety' },
  { title: 'Personalised Coaching', description: 'Receive actionable feedback and tailored improvement plans after every session' },
];

export const layers: Layer[] = [
  {
    title: 'Smart Mock Interviews',
    description: 'AI interviewers tailored to your target company and role. Practice behavioural, technical, and case-study rounds with real-time feedback.',
    pills: ['Mock Engine', 'Question Bank'],
    cardLabel: 'Mock Engine',
    cardIcon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    title: 'Stress & Performance Analytics',
    description: 'Real-time biometric analysis tracking heart-rate variability, micro-expressions, and vocal tremors to give you a complete stress profile.',
    pills: ['Vocal Analysis', 'Facial Cues', 'Stress Score', 'Confidence Meter', 'Body Language'],
    cardLabel: 'Stress Analytics',
    cardIcon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'Personalised Coaching Dashboard',
    description: 'Your central hub for tracking progress, reviewing past sessions, and accessing a personalised improvement roadmap.',
    pills: ['Session History', 'Progress Graphs', 'Action Items'],
    cardLabel: 'Coaching Hub',
    cardIcon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export const demoTabs: DemoTab[] = [
  { label: 'Mock Interview', key: 'mock' },
  { label: 'Stress Analysis', key: 'stress' },
  { label: 'Voice Coaching', key: 'voice' },
];

export const demoContent: Record<string, DemoContent> = {
  mock: { title: 'Try a Mock Interview', description: 'Choose an interview type and start practising with our AI interviewer.' },
  stress: { title: 'Real-Time Stress Dashboard', description: 'Monitor your stress levels as you practise — heart rate, vocal tremors, micro-expressions.' },
  voice: { title: 'Voice Coaching Studio', description: 'Improve pacing, tone, filler-word usage, and clarity with AI-driven feedback.' },
};

export const securityBadges: SecurityBadge[] = [
  {
    title: 'End-to-End Encrypted',
    subtitle: 'Your sessions stay private',
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'Zero Data Selling',
    subtitle: 'We never monetise your info',
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Delete Anytime',
    subtitle: 'Full control over your data',
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
  },
];

export const homeBlogPosts: HomeBlogPost[] = [
  {
    tag: 'Product',
    title: 'Introducing W.I.S.E. 2.0 — Body Language & Voice Analytics',
    description: 'Our biggest update yet adds real-time body language tracking and expanded voice analytics.',
    date: 'Jun 2025',
    href: '/blog',
  },
  {
    tag: 'Research',
    title: 'How AI Mock Interviews Reduce Interview Anxiety by 87%',
    description: 'A study of 5,000 users shows measurable improvement in confidence and stress management.',
    date: 'May 2025',
    href: '/blog',
  },
  {
    tag: 'Community',
    title: 'W.I.S.E. Partners with 50+ Universities Worldwide',
    description: 'From IIT Delhi to Stanford, campuses are integrating W.I.S.E. into career services.',
    date: 'Apr 2025',
    href: '/blog',
  },
];
