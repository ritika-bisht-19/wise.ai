import { useState } from 'react';
import { demoContent } from '@/models/home.data';

export function useDemoTabs() {
  const [activeTab, setActiveTab] = useState('mock');
  const content = demoContent[activeTab];

  return { activeTab, setActiveTab, content };
}
