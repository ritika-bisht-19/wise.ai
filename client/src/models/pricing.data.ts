import type { PricingPlan, FAQ } from './types';

export const plans: PricingPlan[] = [
  {
    name: 'W.I.S.E. Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started with interview practice.',
    cta: 'Get Started Free',
    ctaStyle: 'bg-white text-tx border border-[#e6e6e6] hover:bg-[#f5f5f5]',
    features: [
      '3 mock interviews / month',
      'Basic stress analytics',
      'Standard question bank',
      'Session summaries',
      'Community access',
    ],
  },
  {
    name: 'W.I.S.E. Pro',
    price: '$19',
    period: '/month',
    description: 'For serious job seekers who want every advantage.',
    cta: 'Start Pro Trial',
    ctaStyle: 'bg-[#131313] text-white hover:bg-[#333]',
    popular: true,
    features: [
      'Unlimited mock interviews',
      'Advanced stress & voice analytics',
      'Custom question sets',
      'Body language analysis',
      'Priority AI feedback',
      'Progress tracking dashboard',
      'Interview recording & playback',
    ],
  },
  {
    name: 'W.I.S.E. Campus',
    price: 'Custom',
    period: '',
    description: 'For universities and career centres at scale.',
    cta: 'Contact Sales',
    ctaStyle: 'bg-white text-tx border border-[#e6e6e6] hover:bg-[#f5f5f5]',
    features: [
      'Everything in Pro',
      'Bulk student accounts',
      'Admin analytics dashboard',
      'Custom branding',
      'LMS integration',
      'Dedicated support',
      'On-premise deployment option',
    ],
  },
];

export const faqs: FAQ[] = [
  { q: 'Can I cancel anytime?', a: 'Yes — cancel with one click from your dashboard. No questions asked.' },
  { q: 'Is there really a free plan?', a: 'Absolutely. 3 mock interviews per month with basic analytics, no credit card required.' },
  { q: 'What payment methods do you accept?', a: 'All major credit/debit cards, UPI, and wire transfers for Campus plans.' },
  { q: 'Can I switch plans later?', a: 'Yes, upgrade or downgrade at any time. Changes apply to your next billing cycle.' },
  { q: 'Do you offer student discounts?', a: 'Yes — verify with your .edu email for 30% off Pro plans.' },
];
