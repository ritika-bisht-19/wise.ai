import { Link } from 'react-router-dom';
import { footerSections } from '@/models/navigation.data';

export default function Footer() {
	return (
		<footer className="relative z-10 mx-auto w-full overflow-hidden border-t border-[#e6e6e6] bg-white px-10 pt-24 pb-10 md:px-16">
			<div className="relative mx-auto max-w-[1280px] pb-24">
				<div className="relative z-10 flex w-full flex-col items-start justify-start gap-16 md:justify-between md:gap-24 lg:flex-row lg:gap-[200px]">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-3">
							<Link className="flex items-center" to="/">
								<img src="/wise-logo.svg" alt="W.I.S.E." className="h-[32px] w-[202px]" />
							</Link>
							<p className="font-matter text-[14px] font-medium leading-[1.2] text-[#666]">
								Your interview success starts here
							</p>
						</div>
					</div>

					<div className="grid w-full grid-cols-2 justify-center gap-12 md:grid-cols-4 md:gap-8 lg:gap-16">
						{footerSections.map((section) => (
							<div key={section.title} className="flex w-fit flex-col gap-6">
								<h3 className="w-fit font-matter text-[12px] font-semibold uppercase leading-normal text-[#3d3d3d]">
									{section.title}
								</h3>
								<ul className="flex w-fit flex-col gap-3 font-matter">
									{section.links.map((link) => (
										<li key={link.label} className="w-fit">
											{link.external ? (
												<a
													href={link.href}
													className="block w-fit text-base leading-normal text-[#666] transition-colors hover:text-[#3f56c5]"
													target="_blank"
													rel="noopener noreferrer"
												>
													{link.label}
												</a>
											) : (
												<Link to={link.href} className="block w-fit text-base leading-normal text-[#666] transition-colors hover:text-[#3f56c5]">
													{link.label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="relative z-10 mt-10 flex w-full flex-col items-center justify-between gap-3 py-4 text-center font-matter text-[12px] leading-[1.5] text-[#666] md:absolute md:bottom-0 md:left-1/2 md:mt-0 md:flex-row md:-translate-x-1/2 md:px-16 2xl:px-0">
					<span>Copyright W.I.S.E. {new Date().getFullYear()}</span>
					<span>All rights reserved</span>
				</div>

				<div className="pointer-events-none absolute inset-0 z-0 mx-auto flex h-full w-full max-w-[1280px] flex-col items-center justify-end">
					<div
						className="relative mx-auto -mb-20 w-full max-w-[1200px] scale-x-[200%] scale-y-[300%] md:scale-x-[100%] md:scale-y-[90%]"
						style={{ transformOrigin: 'bottom center' }}
					>
						<svg width="2292" height="833" viewBox="0 0 2292 833" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
							<g clipPath="url(#clip0_ft)">
								<g filter="url(#filter0_ft)">
									<path d="M1113.5 40C502.673 39.9999 40 793 40 793H2252C2252 793 1724.33 40 1113.5 40Z" fill="url(#paint0_ft)" />
								</g>
							</g>
							<defs>
								<filter id="filter0_ft" x="0" y="0" width="2292" height="833" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
									<feGaussianBlur stdDeviation="20" />
								</filter>
								<radialGradient id="paint0_ft" cx="0" cy="0" r="1" gradientTransform="matrix(0 -1256.51 2148.88 -11.8434 1146 1272)" gradientUnits="userSpaceOnUse">
									<stop offset="0.327754" stopColor="#F9730C" />
									<stop offset="0.423421" stopColor="#FFA336" />
									<stop offset="0.536751" stopColor="#F0D5BA" />
									<stop offset="0.635122" stopColor="#CBDBFF" />
									<stop offset="1" stopColor="#FAFAFA" stopOpacity="0" />
								</radialGradient>
								<clipPath id="clip0_ft">
									<rect width="2292" height="833" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
			</div>
		</footer>
	);
}
