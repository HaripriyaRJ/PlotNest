import { Link } from "react-router-dom";

export default function AuthorSignup() {
    return (
        <div className="font-sans bg-[#09090f] text-white min-h-screen flex items-center justify-center relative overflow-hidden">

            {/* ───── TOP LOGO ───── */}
            <div className="absolute top-8 left-8 z-50">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white text-lg font-bold">auto_stories</span>
                    </div>
                    <span className="text-xl font-black tracking-tight text-white uppercase tracking-[0.2em] text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">PlotNest</span>
                </Link>
            </div>

            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(99,102,241,0.2),transparent_70%)]"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl px-4 py-8 flex items-center justify-center">
                <div className="bg-white/[0.02] backdrop-blur-[40px] w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row-reverse border border-white/10">

                    <div className="hidden md:block w-1/2 relative min-h-[550px]">
                        <img
                            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80"
                            alt="Author writing"
                            className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-[0.3]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10">
                            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Start your legacy.</h2>
                            <p className="text-slate-300 text-lg font-medium">Every great story needs a place to grow.</p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#09090f]/40">
                        <div className="mb-8 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-4">
                                <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <span className="material-symbols-outlined text-white text-lg">auto_stories</span>
                                </div>
                                <span className="text-xl font-black tracking-tighter">PlotNest</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Join as Author</h2>
                            <p className="text-slate-500 text-sm font-medium">Create your profile and start publishing today</p>
                        </div>

                        <form className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Pen Name</label>
                                <input type="text" placeholder="Your literary persona" className="w-full rounded-xl py-3 px-4 border border-white/10 bg-white/[0.04] text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                                <input type="email" placeholder="author@plotnest.com" className="w-full rounded-xl py-3 px-4 border border-white/10 bg-white/[0.04] text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
                                <input type="password" placeholder="••••••••" className="w-full rounded-xl py-3 px-4 border border-white/10 bg-white/[0.04] text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-sm" />
                            </div>

                            <div className="block pt-4" onClick={() => {
                                const penNameInput = document.querySelector('input[placeholder="Your literary persona"]') as HTMLInputElement;
                                const emailInput = document.querySelector('input[placeholder="author@plotnest.com"]') as HTMLInputElement;
                                localStorage.setItem("author_name", penNameInput?.value || "Author");
                                localStorage.setItem("author_email", emailInput?.value || "author@plotnest.com");
                            }}>
                                <Link to="/author-dashboard">
                                    <button type="button" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm uppercase tracking-widest text-white">
                                        Create Author Account
                                    </button>
                                </Link>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-slate-500 text-[11px] font-medium">
                            Already an author? <Link to="/author-login" className="text-indigo-500 font-bold hover:text-indigo-400 ml-1.5 uppercase tracking-wide">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
