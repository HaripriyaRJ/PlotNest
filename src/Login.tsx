import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="bg-[#09090f] text-white min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* ───── STYLES ───── */}
            <style>{`
                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                    50% { transform: translate(20px, -30px) scale(1.1); opacity: 0.6; }
                }
                @keyframes starTwinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); filter: blur(0px); }
                    50% { opacity: 1; transform: scale(1.3); filter: blur(0.5px); }
                }
                @keyframes galaxyPan {
                    0% { transform: scale(1.1) translate(0, 0); }
                    33% { transform: scale(1.2) translate(-2%, -2%); }
                    66% { transform: scale(1.15) translate(2%, 1%); }
                    100% { transform: scale(1.1) translate(0, 0); }
                }
                .bg-orb { animation: floatOrb 20s ease-in-out infinite; }
                .star { animation: starTwinkle 1.2s ease-in-out infinite; }
                .galaxy-animate { animation: galaxyPan 30s ease-in-out infinite; }
            `}</style>

            {/* ───── TOP LOGO ───── */}
            <div className="absolute top-8 left-8 z-50">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white text-lg font-bold">auto_stories</span>
                    </div>
                    <span className="text-xl font-black tracking-tight text-white uppercase tracking-[0.2em] text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">PlotNest</span>
                </Link>
            </div>

            {/* ───── BACKGROUND EFFECTS ───── */}
            <div className="absolute inset-0 z-0 text-sans">
                {/* Orbs */}
                <div className="bg-orb absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
                <div className="bg-orb absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" style={{ animationDelay: '-5s' }} />

                {/* Starfield */}
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="star absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 'px',
                            height: Math.random() * 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 3 + 's',
                            opacity: Math.random() * 0.8 + 0.2
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/[0.02] backdrop-blur-[40px] rounded-[1.25rem] overflow-hidden border border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]">

                    {/* LEFT: HERO SECTION */}
                    <div className="hidden lg:block relative min-h-[400px] overflow-hidden border-r border-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80"
                            alt="Reading journey"
                            className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-[0.4] galaxy-animate"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/60 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6">
                            <h2 className="text-xl font-bold mb-2 leading-tight tracking-tight text-white/90">Gateway to<br />infinite worlds.</h2>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-[180px] font-medium opacity-80">
                                Reconnect with the characters you love.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: FORM SECTION */}
                    <div className="p-6 md:p-8 flex flex-col justify-center bg-[#09090f]/40 backdrop-blur-sm">
                        <div className="mb-5 text-center lg:text-left">
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1 text-white">Welcome Back</h3>
                            <p className="text-slate-500 text-xs font-medium">Continue your reading journey.</p>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-base transition-colors border-r border-white/5 pr-3">mail</span>
                                    <input
                                        type="email"
                                        placeholder="reader@plotnest.com"
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                                    <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase">Forgot?</button>
                                </div>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-base transition-colors border-r border-white/5 pr-3">lock</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-3 pl-10 pr-10 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-1">
                                <input type="checkbox" className="peer size-3.5 rounded border-white/10 bg-white/5 text-indigo-500 accent-indigo-500 transition-all cursor-pointer" />
                                <label className="text-xs text-slate-500 font-medium cursor-pointer hover:text-slate-400 transition-all">Remember me?</label>
                            </div>

                            <Link to="/dashboard" className="block pt-2">
                                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase">
                                    SIGN IN TO LIBRARY
                                </button>
                            </Link>
                        </form>

                        <div className="mt-6 pt-4 border-t border-white/5 text-center">
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-3 text-center">Are you an author?</p>
                            <Link to="/author-login" className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all group">
                                <span className="material-symbols-outlined text-sm text-indigo-400 group-hover:rotate-12 transition-transform">edit_square</span>
                                <span className="text-[10px] font-bold uppercase">Author Access</span>
                            </Link>
                        </div>

                        <p className="mt-5 text-center text-slate-600 text-[11px] font-medium">
                            First time?
                            <Link to="/signup" className="text-indigo-500 font-bold hover:text-indigo-400 ml-1.5 uppercase">Join PlotNest</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
