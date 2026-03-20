import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import FeaturesPage from '@/pages/FeaturesPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import PricingPage from '@/pages/PricingPage';
import ContactPage from '@/pages/ContactPage';
import BlogPage from '@/pages/BlogPage';
import NotFoundPage from '@/pages/NotFoundPage';
import InterviewPage from '@/pages/InterviewPage';

export const router = createBrowserRouter([
  // Interview is a standalone full-screen experience (no navbar/footer)
  { path: '/interview', element: <InterviewPage /> },

  // All other pages share the AppLayout (navbar + footer)
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

