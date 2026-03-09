import type { NavLink, FooterSection } from './types';

export const navLinks: NavLink[] = [
  {
    label: 'FEATURES',
    children: [
      { label: 'Mock Interviews', href: '/features#mock-interviews' },
      { label: 'Stress Analytics', href: '/features#stress-analytics' },
      { label: 'Voice Coaching', href: '/features#voice-coaching' },
      { label: 'Body Language', href: '/features#body-language' },
    ],
  },
  {
    label: 'HOW IT WORKS',
    children: [
      { label: 'For Students', href: '/how-it-works#students' },
      { label: 'For Job Seekers', href: '/how-it-works#job-seekers' },
      { label: 'For Career Changers', href: '/how-it-works#career-changers' },
    ],
  },
  {
    label: 'RESOURCES',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Success Stories', href: '/blog#stories' },
      { label: 'Interview Tips', href: '/blog#tips' },
    ],
  },
  {
    label: 'ABOUT',
    children: [
      { label: 'Our Mission', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

export const footerSections: FooterSection[] = [
  {
    title: 'Products',
    links: [
      { label: 'W.I.S.E. Mock Interview', href: '/features' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
  {
    title: 'Socials',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com', external: true },
      { label: 'X', href: 'https://x.com', external: true },
      { label: 'YouTube', href: 'https://youtube.com', external: true },
    ],
  },
];
