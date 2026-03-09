import { Link } from 'react-router-dom';
import { homeBlogPosts } from '@/models/home.data';
import { tagColors } from '@/models/blog.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function BlogSection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
      <div className="flex items-end justify-between mb-10 reveal">
        <div>
          <h2 className="text-3xl md:text-[36px] font-season-mix leading-[135%] text-tx">
            Latest Updates
          </h2>
          <p className="text-base text-[#666] font-matter mt-2">News, research, and insights from the W.I.S.E. team.</p>
        </div>
        <Link
          to="/blog"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#e6e6e6] text-sm font-matter font-medium text-tx hover:bg-[#f5f5f5] transition-colors"
        >
          View All Updates
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {homeBlogPosts.map((post, idx) => (
          <Link
            to={post.href}
            key={post.title}
            className="group flex flex-col rounded-[24px] border border-[#f0f0f0] bg-white overflow-hidden hover:border-[#C7D2FE] card-hover reveal"
            style={{ transitionDelay: `${200 + idx * 150}ms` }}
          >
            {/* Image placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-[#f5f5f5] to-[#e6e6e6] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="p-6 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-0.5 rounded-full text-xs font-matter font-medium ${tagColors[post.tag] || 'bg-[#f5f5f5] text-[#666]'}`}>
                  {post.tag}
                </span>
                <span className="text-xs font-matter text-[#999]">{post.date}</span>
              </div>
              <h3 className="font-matter font-semibold text-base text-tx leading-snug group-hover:text-[#3730A3] transition-colors">
                {post.title}
              </h3>
              <p className="font-matter text-sm text-[#666] leading-relaxed">{post.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link
          to="/blog"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#e6e6e6] text-sm font-matter font-medium text-tx hover:bg-[#f5f5f5] transition-colors"
        >
          View All Updates
        </Link>
      </div>
    </section>
  );
}
