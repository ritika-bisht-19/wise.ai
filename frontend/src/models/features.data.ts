import type { FeatureCategory } from './types';

export const featureCategories: FeatureCategory[] = [
  {
    category: 'Interview Simulation',
    items: [
      { title: 'AI-Powered Mock Interviews', description: 'Practise with our adaptive AI interviewer that adjusts difficulty based on your responses and target role.' },
      { title: 'Role-Specific Questions', description: 'Customised question banks for software engineering, product management, consulting, finance, and more.' },
      { title: 'Multi-Format Support', description: 'Behavioural, technical, case study, and situational interview formats — all in one platform.' },
    ],
  },
  {
    category: 'Stress & Analytics',
    items: [
      { title: 'Real-Time Stress Detection', description: 'Monitor vocal tremors, speech pace, and confidence levels as you answer in real time.' },
      { title: 'Voice Analytics', description: 'Get feedback on filler words, pacing, tone variation, and clarity — the things interviewers notice.' },
      { title: 'Body Language Analysis', description: 'Camera-based posture, eye contact, and gesture tracking to improve your non-verbal communication.' },
    ],
  },
  {
    category: 'Coaching & Growth',
    items: [
      { title: 'Personalised Action Plans', description: 'After each session, receive a tailored improvement plan based on your specific weaknesses.' },
      { title: 'Progress Dashboard', description: 'Track improvement over time with session history, trend charts, and milestone badges.' },
      { title: 'Expert-Curated Tips', description: 'Access a library of strategies from career coaches, hiring managers, and successful candidates.' },
    ],
  },
];
