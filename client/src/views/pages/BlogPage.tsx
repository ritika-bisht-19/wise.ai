import { Link } from 'react-router-dom';
import { blogPosts, tagColors } from '@/models/blog.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function BlogPage() {
  const heroRef = useScrollReveal();
  const gridRef = useScrollReveal();

  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
      {/* Hero */}
      <section ref={heroRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px] pt-12 md:pt-20">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-[56px] font-season-mix leading-[120%] text-tx reveal">
            Blog & Updates
          </h1>
          <p className="text-lg text-[#666] font-matter max-w-[480px] reveal" style={{ transitionDelay: '150ms' }}>
            Product news, research insights, and interview tips from the W.I.S.E. team.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section ref={gridRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, idx) => (
            <Link
              to="/blog"
              key={post.title}
              className="group flex flex-col rounded-[24px] border border-[#f0f0f0] bg-white overflow-hidden hover:border-[#C7D2FE] card-hover reveal"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
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
                <p className="font-matter text-sm text-[#666] leading-relaxed">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
