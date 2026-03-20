import type { TeamMember, ValueItem } from './types';

export const team: TeamMember[] = [
  { initials: 'RK', name: 'Rahul Kumar', role: 'CEO & Co-founder', bio: 'Ex-Google, Stanford CS. Passionate about making AI accessible to everyone.' },
  { initials: 'AS', name: 'Ananya Singh', role: 'CTO & Co-founder', bio: 'Ex-Microsoft Research. PhD in NLP from IIT Bombay.' },
  { initials: 'DM', name: 'David Miller', role: 'Head of Product', bio: 'Former product lead at Coursera. Building the future of edtech.' },
  { initials: 'LP', name: 'Lisa Park', role: 'Head of AI Research', bio: 'PhD in Affective Computing from MIT. Expert in stress detection.' },
];

export const values: ValueItem[] = [
  { title: 'Empathy First', description: 'We build for the nervous candidate, not the confident one. Every feature is designed to reduce anxiety.' },
  { title: 'Privacy by Design', description: 'Your interview data is yours. We never sell, share, or train on your sessions without consent.' },
  { title: 'Accessible to All', description: 'Great interview prep shouldn\'t be a privilege. Our free tier is genuinely useful, not a demo.' },
  { title: 'Science-Backed', description: 'Every feature is grounded in research — from stress physiology to communication science.' },
];
