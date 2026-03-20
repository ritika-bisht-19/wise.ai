import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 animate-fade-in">
      <span className="text-[120px] md:text-[160px] font-season-mix leading-none text-[#EEF2FF] animate-scale-in">404</span>
      <h1 className="text-2xl md:text-[36px] font-season-mix text-tx text-center animate-fade-in-up delay-200">Page not found</h1>
      <p className="font-matter text-base text-[#666] text-center max-w-[400px] animate-fade-in-up delay-300">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-3 rounded-full bg-[#131313] text-white font-season-mix font-medium text-base hover:bg-[#333] btn-glow transition-colors animate-fade-in-up delay-400"
      >
        Back to Home
      </Link>
    </div>
  );
}
