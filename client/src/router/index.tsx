import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/views/layouts/AppLayout';
import HomePage from '@/views/pages/HomePage';
import AboutPage from '@/views/pages/AboutPage';
import FeaturesPage from '@/views/pages/FeaturesPage';
import HowItWorksPage from '@/views/pages/HowItWorksPage';
import PricingPage from '@/views/pages/PricingPage';
import ContactPage from '@/views/pages/ContactPage';
import BlogPage from '@/views/pages/BlogPage';
import NotFoundPage from '@/views/pages/NotFoundPage';

export const router = createBrowserRouter([
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
