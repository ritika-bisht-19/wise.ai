import type { Step } from './types';

export const steps: Step[] = [
  {
    number: '01',
    title: 'Choose Your Interview Type',
    description: 'Select from technical, behavioural, case study, or custom interview formats. Pick your target role and difficulty level.',
    details: ['Software Engineering', 'Product Management', 'Consulting & Finance', 'Custom Roles'],
  },
  {
    number: '02',
    title: 'Practise with AI Interviewer',
    description: 'Our AI adapts in real time — asking follow-ups, adjusting difficulty, and simulating realistic interview pressure.',
    details: ['Adaptive follow-up questions', 'Realistic time pressure', 'Natural conversation flow', 'Video + audio recording'],
  },
  {
    number: '03',
    title: 'Get Instant Analytics',
    description: 'Immediately after your session, review detailed analytics on stress levels, voice quality, body language, and content quality.',
    details: ['Stress & confidence scores', 'Voice analytics breakdown', 'Body language heatmap', 'Answer quality ratings'],
  },
  {
    number: '04',
    title: 'Follow Your Action Plan',
    description: 'Receive a personalised improvement plan with specific exercises, tips, and focus areas for your next session.',
    details: ['Targeted practice exercises', 'Curated reading materials', 'Breathing & stress techniques', 'Progress milestones'],
  },
];
