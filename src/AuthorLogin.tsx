import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AuthorLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const storedPassword = localStorage.getItem("author_password") || "123456";
        if (email === "author@plotnest.com" && password === storedPassword) {
            // Only set default if not already set, to preserve changes from Dashboard settings
            if (!localStorage.getItem("author_name")) {
                localStorage.setItem("author_name", "Author");
            }
            localStorage.setItem("author_email", email);
            navigate("/author-dashboard");
        } else {
            setError("Invalid author credentials. Please try again.");
        }
    };

    return (
        <div className="bg-[#09090f] text-white min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* ───── STYLES ───── */}
            <style>{`
                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                    50% { transform: translate(20px, -30px) scale(1.1); opacity: 0.6; }
                }
                @keyframes starPulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.2); }
                }
                .bg-orb { animation: floatOrb 20s ease-in-out infinite; }
                .star { animation: starPulse 4s infinite; }
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
            <div className="absolute inset-0 z-0 font-sans text-sans">
                {/* Orbs */}
                <div className="bg-orb absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
                <div className="bg-orb absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" style={{ animationDelay: '-5s' }} />

                {/* Starfield */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="star absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 'px',
                            height: Math.random() * 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 5 + 's',
                            opacity: Math.random() * 0.5
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/[0.02] backdrop-blur-[40px] rounded-[1.25rem] overflow-hidden border border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]">

                    {/* LEFT: HERO SECTION */}
                    <div className="hidden lg:block relative min-h-[400px] overflow-hidden border-r border-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80"
                            alt="Author writing"
                            className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-[0.3]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/70 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="size-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                                    <span className="material-symbols-outlined text-white text-lg">auto_stories</span>
                                </div>
                                <span className="text-lg font-black tracking-tighter">PlotNest</span>
                            </div>
                            <h2 className="text-xl font-bold mb-2 leading-tight tracking-tight text-white/95">Where legends<br />are written.</h2>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-[180px] font-medium opacity-80">
                                Access your creative dashboard and manage your library.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: FORM SECTION */}
                    <div className="p-6 md:p-8 flex flex-col justify-center bg-[#09090f]/40 backdrop-blur-sm">
                        <div className="mb-5 text-center lg:text-left">
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1 text-white">Author Sign In</h3>
                            <p className="text-slate-500 text-xs font-medium">Welcome back to your creative studio</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleLogin}>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] py-2 px-3 rounded-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Author Email</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-base transition-colors border-r border-white/5 pr-3">mail</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="author@plotnest.com"
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                                    <button type="button" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase">Forgot?</button>
                                </div>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 text-base transition-colors border-r border-white/5 pr-3">lock</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-3 pl-10 pr-10 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700 text-sm"
                                        required
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

                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase">
                                ENTER STUDIO
                            </button>
                        </form>

                        <p className="mt-8 text-center text-slate-600 text-xs font-medium">
                            Not an author yet?
                            <Link to="/author-signup" className="text-indigo-500 font-bold hover:text-indigo-400 ml-1.5 uppercase">Join the circle</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

