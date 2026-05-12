import { Link } from "react-router-dom";

export default function Signup() {

    return (
        <div className="bg-[#09090f] text-white min-h-screen font-sans relative">
            <style>{`
                @keyframes galaxyPan {
                    0% { transform: scale(1.1) translate(0, 0); }
                    33% { transform: scale(1.2) translate(-2%, -2%); }
                    66% { transform: scale(1.15) translate(2%, 1%); }
                    100% { transform: scale(1.1) translate(0, 0); }
                }
                @keyframes starTwinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); filter: blur(0px); }
                    50% { opacity: 1; transform: scale(1.3); filter: blur(0.5px); }
                }
                .galaxy-bg {
                    animation: galaxyPan 30s ease-in-out infinite;
                }
                .star {
                    animation: starTwinkle 1.2s ease-in-out infinite;
                }
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

            <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">

                {/* LEFT SIDE: HERO */}
                <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-end p-12 border-r border-white/5 overflow-hidden">
                    {/* Dynamic Galaxy Background */}
                    <img 
                        src="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&auto=format&fit=crop&q=80" 
                        alt="Galaxy Background" 
                        className="absolute inset-0 w-full h-full object-cover galaxy-bg"
                    />
                    <div className="absolute inset-0 bg-[#09090f]/60"></div>
 
                    {/* Twinkling Starfield */}
                    <div className="absolute inset-0 z-0">
                        {[...Array(30)].map((_, i) => (
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

                    <div className="relative z-10 max-w-lg">
                        <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight text-white">
                            Where every word finds its sanctuary.
                        </h1>
                        <p className="text-lg text-slate-300 font-medium">
                            Join our exclusive circle of authors and bibliophiles.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: FORM */}
                <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 bg-[#09090f]">

                    <div className="mx-auto w-full max-w-md">

                        <div className="mb-10">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 font-medium">
                                Already have an account?
                                <Link to="/login" className="font-bold text-indigo-500 hover:text-indigo-400 ml-1.5 uppercase tracking-wide">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        {/* FORM */}
                        <form className="space-y-5">

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="block w-full rounded-xl py-3.5 px-4 border border-white/10 bg-white/[0.04] text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    placeholder="reader@plotnest.com"
                                    className="block w-full rounded-xl py-3.5 px-4 border border-white/10 bg-white/[0.04] text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="block w-full rounded-xl py-3.5 px-4 border border-white/10 bg-white/[0.04] text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-sm"
                                />
                            </div>

                            <Link to="/dashboard" className="block pt-4">
                                <button
                                    type="button"
                                    className="flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-4 text-sm font-bold text-white hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest"
                                >
                                    Create Account
                                </button>
                            </Link>


                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
}
