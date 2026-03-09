import { Outlet } from 'react-router-dom';
import { useScrollToTop } from '@/controllers/useScrollToTop';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  useScrollToTop();

  return (
    <div className="flex flex-col mx-auto min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="z-100 flex-1 font-matter bg-sf relative flex flex-col pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
