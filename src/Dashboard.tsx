import { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
(window as any).html2canvas = html2canvas;



export default function Dashboard() {
    const categories = ["All", "Trends", "My Library"];
    const [activeSection, setActiveSection] = useState<string>("Dashboard");
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const isLight = theme === 'light';
    const [publishedStories, setPublishedStories] = useState<any[]>([]);
    const [settingsUsername, setSettingsUsername] = useState<string>("Priya");
    const [settingsEmail, setSettingsEmail] = useState<string>("hariasvi21@gmail.com");
    const [oldUsername, setOldUsername] = useState<string>("Priya");
    const [notifications, setNotifications] = useState<string[]>([
        "Welcome to PlotNest, Haripriya! 📚",
        "Don't forget to check out newly published books.",
        "Your reading streak is on fire! 5 days 🔥",
        "System maintenance scheduled for tonight.",
        "New mystery genre added to Explore section.",
        "You have 2 new followers on your author profile.",
        "Author 'James' just published a new chapter.",
        "Check out today's trending book: 'The Silent Hill'"
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedStory, setSelectedStory] = useState<any>(null);
    const [isOpeningStory, setIsOpeningStory] = useState(false);
    const [stats, setStats] = useState({
        booksInLibrary: 0,
        currentlyReading: 0,
        bookmarks: 0,
        streak: 0
    });

    const incrementReadCount = async (storyId: number) => {
        try {
            await fetch(`http://localhost:5000/api/stories/${storyId}/read`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: oldUsername })
            });
            // Refresh stats after reading
            fetchDashboardStats();
        } catch (err) {
            console.error("Failed to increment read count:", err);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${oldUsername}/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (err) {
            console.error("Failed to fetch dashboard stats:", err);
        }
    };

    const handleStoryClick = (story: any) => {
        setSelectedStory(story);
        setIsOpeningStory(true);
        setActiveSection("Reading");
        incrementReadCount(story.id);

        // Delay to allow animation to play before removing overlay
        setTimeout(() => {
            setIsOpeningStory(false);
        }, 1800);
    };


    useEffect(() => {
        const loadFromLocalStorage = () => {
            const local = localStorage.getItem('plotnest_published_stories')
                || localStorage.getItem('published_stories');
            if (local) {
                const parsed = JSON.parse(local);
                if (parsed.length > 0) setPublishedStories(parsed);
            }
        };

        const fetchPublishedStories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stories/published');
                if (response.ok) {
                    const data = await response.json();
                    setPublishedStories(data.map((s: any) => ({
                        ...s,
                        tags: typeof s.tags === 'string' ? JSON.parse(s.tags) : s.tags,
                        coverImage: s.cover_image,
                        author: s.author_name
                    })));
                } else {
                    loadFromLocalStorage();
                }
            } catch {
                // API unavailable — fall back to localStorage
                loadFromLocalStorage();
            }
        };

        fetchPublishedStories();

        const fetchUserSettings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${oldUsername}`);
                if (response.ok) {
                    const data = await response.json();
                    setSettingsUsername(data.username);
                    setSettingsEmail(data.email);
                    setOldUsername(data.username);
                }
            } catch (err) {
                console.error("Failed to fetch user settings:", err);
            }
        };
        fetchUserSettings();
        fetchDashboardStats();

        // Listen for same-tab publishes (StorageEvent dispatched by handlePublish)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'plotnest_published_stories' || e.key === 'published_stories' || e.key === 'plotnest_story_published') {
                fetchPublishedStories();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [oldUsername]);

    const handleSaveUserSettings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldUsername,
                    newUsername: settingsUsername,
                    email: settingsEmail
                })
            });

            if (response.ok) {
                setOldUsername(settingsUsername);
                alert('Settings saved successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to save settings: ${error.error}`);
            }
        } catch (err) {
            console.error("Error saving user settings:", err);
            alert("Error connecting to server.");
        }
    };



    const renderOpeningOverlay = () => {
        if (!isOpeningStory || !selectedStory) return null;
        return (
            <div className="story-opening-overlay !bg-[#faf9f6]">
                <div className="book-animation shadow-2xl" style={{ transformOrigin: '70% 50%' }}>
                    <div className="book-cover overflow-hidden bg-[#1a1a2e]">
                        <div className="book-spine"></div>
                        {selectedStory.coverImage ? (
                            <img
                                src={selectedStory.coverImage}
                                alt={selectedStory.title}
                                className="w-full h-full object-cover ml-[1px]"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white bg-slate-900 ml-[1px]">
                                <span className="material-symbols-outlined text-5xl mb-6 opacity-30">auto_stories</span>
                                <h3 className="font-lora text-center font-bold text-lg px-2 leading-relaxed">{selectedStory.title}</h3>
                                <div className="mt-8 w-12 h-[1px] bg-white/10"></div>
                            </div>
                        )}
                        {/* Elegant Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_4s_infinite]"></div>
                    </div>
                    <div className="book-pages relative paper-texture !bg-white">
                        <div className="book-page-content !p-10">
                            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-[10px] uppercase tracking-widest opacity-40">{selectedStory.title}</h4>
                            <div className="story-preview-text text-[8px] leading-[1.8] text-slate-700 font-lora line-clamp-[22]">
                                {(selectedStory.content || '').replace(/<[^>]*>?/gm, '').trim()}
                            </div>
                            <div className="mt-6 flex justify-between items-center opacity-20 border-t border-slate-100 pt-4">
                                <span className="text-[6px] font-bold uppercase tracking-widest">{selectedStory.author}</span>
                                <span className="text-[6px] font-bold uppercase tracking-widest">Page 1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`transition-colors duration-300 h-screen flex overflow-hidden ${isLight ? 'light-theme bg-[#f8f9fc] text-slate-900' : 'bg-[#09090f] text-white'}`}>
            {renderOpeningOverlay()}

            {/* SIDEBAR */}
            <aside className="w-72 bg-[#0d0d1a] border-r border-white/[0.06] flex flex-col pt-8 pb-4">
                <div className="px-8 pb-6 flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="material-symbols-outlined text-white text-lg font-bold">auto_stories</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tighter text-white">PlotNest</h2>
                </div>

                <div className="px-4 mb-4">
                    <div className="bg-white/[0.05] rounded-xl px-6 py-3 flex items-center gap-4 border border-white/[0.06]">
                        <div className="size-10 rounded-full bg-slate-700 overflow-hidden shadow-sm border-2 border-white/10 shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nasir" alt="User Avatar" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-white">{oldUsername}</p>
                        </div>
                        <div className="size-2 bg-green-500 rounded-full shrink-0"></div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pr-2">
                    <NavItem icon="dashboard" label="Dashboard" active={activeSection === "Dashboard"} onClick={() => setActiveSection("Dashboard")} />
                    <NavItem icon="menu_book" label="Books" active={activeSection === "Books"} onClick={() => setActiveSection("Books")} />
                    <NavItem icon="history" label="Reading History" active={activeSection === "Reading History"} onClick={() => setActiveSection("Reading History")} />
                    <NavItem icon="person_add" label="Sign Up" active={activeSection === "Sign Up"} onClick={() => navigate('/signup')} />
                    <NavItem icon="bookmark" label="Bookmarks" active={activeSection === "Bookmarks"} onClick={() => setActiveSection("Bookmarks")} />
                    <NavItem icon="groups" label="Clubs" active={activeSection === "Clubs"} onClick={() => setActiveSection("Clubs")} />
                    <NavItem icon="explore" label="Explore" active={activeSection === "Explore"} onClick={() => setActiveSection("Explore")} />
                    <NavItem icon="settings" label="Settings" active={activeSection === "Settings"} onClick={() => setActiveSection("Settings")} />
                </nav>

                <div className="px-4 mt-auto">
                    <button className="w-full flex items-center gap-3 px-6 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold mb-4">
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-hidden bg-[#f1f5f9] flex flex-col">
                {/* CONSISTENT HEADER */}
                <header className="h-20 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md px-10 flex items-center justify-end sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        {/* SEARCH BOX ON RIGHT */}
                        <div className="w-72 relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search books..." 
                                className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* NOTIFICATIONS */}
                            <div className="relative group">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative flex items-center justify-center size-9 rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-600"
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 size-4 bg-red-600 text-[9px] text-white font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                            <h3 className="text-slate-800 font-bold text-sm">Notifications</h3>
                                            <button onClick={() => setNotifications([])} className="text-[10px] uppercase font-black tracking-widest text-indigo-500 hover:text-indigo-600">Clear All</button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
                                            {notifications.length > 0 ? notifications.map((n, i) => (
                                                <div key={i} className="px-5 py-4 hover:bg-slate-50 transition-colors flex gap-3 group/item">
                                                    <div className="size-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 animate-pulse" />
                                                    <p className="text-slate-600 text-xs leading-relaxed group-hover/item:text-slate-900 transition-colors">{n}</p>
                                                </div>
                                            )) : (
                                                <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                                    <span className="material-symbols-outlined text-slate-300 text-2xl mb-2">notifications_off</span>
                                                    <p className="text-slate-500 text-sm font-medium">No new notifications</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* THEME TOGGLE */}
                            <button onClick={toggleTheme} className="size-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-xl">{isLight ? 'dark_mode' : 'light_mode'}</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">

                    {activeSection === "Books" ? (
                        /* ===== BOOKS VIEW ===== */
                        <>
                            <h1 className="text-3xl font-bold mb-1 text-white">Books</h1>
                            <p className="text-slate-500 mb-8">Explore and pick up your next read</p>

                            {/* CATEGORY TABS */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] mb-8">
                                <div className="flex items-center gap-8">
                                    {categories.map((cat) => (
                                        <button 
                                            key={cat} 
                                            onClick={() => setActiveCategory(cat)}
                                            className={`pb-4 text-sm font-bold relative transition-all ${activeCategory === cat ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            {cat}
                                            {activeCategory === cat && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                                        </button>
                                    ))}
                                    <button className="pb-4 text-slate-400"><span className="material-symbols-outlined text-sm">more_horiz</span></button>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-lg">
                                        Sort by <span className="text-slate-900 flex items-center">Popular <span className="material-symbols-outlined text-sm">expand_more</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-lg">
                                        Filters <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {activeCategory === "All" ? (
                                <>
                                    {/* NEWLY PUBLISHED SECTION */}
                                    {publishedStories.length > 0 && (
                                        <section className="mb-12">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">auto_awesome</span>
                                                    Newly Published
                                                </h2>
                                                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">See All</button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                                                {publishedStories.map((story, idx) => (
                                                    <div key={idx} onClick={() => handleStoryClick(story)} className="group cursor-pointer">
                                                        <div className="aspect-[4/5] rounded-2xl bg-[#1a1a2e] mb-3 overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all relative border border-white/5">
                                                            {story.coverImage ? (
                                                                <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={story.title} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-800/50">
                                                                    <span className="material-symbols-outlined text-3xl">menu_book</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-[8px] font-black text-white uppercase tracking-widest rounded-full shadow-sm">NEW</div>
                                                        </div>
                                                        <h3 className="text-sm font-bold truncate group-hover:text-indigo-600 transition-colors">{story.title}</h3>
                                                        <p className="text-xs text-slate-400 mb-1">{story.author}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter bg-indigo-50 px-1.5 py-0.5 rounded">{story.genre}</span>
                                                            <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[12px]">visibility</span>
                                                                {story.reads}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                </>
                            ) : activeCategory === "Trends" ? (
                                <TrendsView onStoryClick={handleStoryClick} />
                            ) : activeCategory === "My Library" ? (
                                <MyLibraryView onStoryClick={handleStoryClick} />
                            ) : (
                                <p className="text-slate-400 italic">This section is coming soon.</p>
                            )}
                        </>
                    ) : activeSection === "Author" ? (
                        /* ===== AUTHOR VIEW ===== */
                        <div className="flex gap-8">
                            {/* LEFT */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold mb-1">Author Dashboard</h1>
                                <p className="text-slate-500 mb-6">Manage and publish your writing on PlotNest</p>

                                {/* ACTION CARDS */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <button className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl transition-all">
                                        <span className="material-symbols-outlined text-3xl opacity-90">edit_note</span>
                                        <div className="text-left">
                                            <p className="font-bold text-base">New Story</p>
                                            <p className="text-xs opacity-75">Start a new story</p>
                                        </div>
                                    </button>
                                    <button className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow transition-all">
                                        <span className="material-symbols-outlined text-3xl text-indigo-400">menu_book</span>
                                        <div className="text-left">
                                            <p className="font-bold text-base">My Stories</p>
                                            <p className="text-xs text-slate-400">Manage your stories</p>
                                        </div>
                                    </button>
                                    <button className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow transition-all">
                                        <span className="material-symbols-outlined text-3xl text-green-400">bar_chart</span>
                                        <div className="text-left">
                                            <p className="font-bold text-base">Earnings</p>
                                            <p className="text-xs text-slate-400">View your earnings</p>
                                        </div>
                                    </button>
                                </div>

                                {/* MY STORIES */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">My Stories</h2>
                                    <button className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1">
                                        View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                                <div className="border border-slate-100 rounded-2xl bg-white p-6 text-center shadow-sm">
                                    <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">edit_note</span>
                                    <p className="text-sm text-slate-400 italic">You haven't published any stories yet. Start writing!</p>
                                </div>
                            </div>

                            {/* RIGHT PANEL */}
                            <div className="w-60 shrink-0 flex flex-col gap-5">
                                {/* PROFILE CARD */}
                                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
                                    <div className="size-16 rounded-full overflow-hidden mb-3 border-2 border-slate-100 shadow">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nasir" alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="font-bold text-slate-900">Nasir Uddin</p>
                                    <p className="text-xs text-slate-400 mb-4">@nasiruddin</p>
                                    <div className="grid grid-cols-3 gap-2 w-full mb-4">
                                        <div className="text-center">
                                            <p className="font-bold text-slate-900 text-sm">0</p>
                                            <p className="text-[10px] text-slate-400">Published Stories</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-slate-900 text-sm">0</p>
                                            <p className="text-[10px] text-slate-400">Total Reads</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-slate-900 text-sm">0</p>
                                            <p className="text-[10px] text-slate-400">Total Likes</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">View Profile</button>
                                </div>

                                {/* WRITING TIPS */}
                                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-700 mb-4">Writing Tips &amp; Guides</h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: 'lightbulb', tip: '10 Tips for Writing a Captivating Plot' },
                                            { icon: 'person', tip: 'How to Develop Compelling Characters' },
                                            { icon: 'campaign', tip: 'Marketing Your Story on PlotNest' },
                                            { icon: 'analytics', tip: 'Understanding Reader Analytics' },
                                        ].map(({ icon, tip }) => (
                                            <button key={tip} className="flex items-start gap-3 w-full text-left text-xs text-slate-600 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-sm text-slate-400 mt-0.5">{icon}</span>
                                                {tip}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="mt-4 w-full py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">View All</button>
                                </div>
                            </div>
                        </div>
                    ) : activeSection === "Clubs" ? (
                        /* ===== CLUBS VIEW ===== */
                        <div className="flex gap-8">
                            {/* LEFT */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold mb-1">Book Clubs</h1>
                                <p className="text-slate-500 mb-6">Join and participate in book discussions</p>

                                {/* TABS + SEARCH */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-6 border-b border-white/[0.06] w-full pb-0">
                                        {["All", "My Clubs", "Popular"].map((tab, i) => (
                                            <button key={tab} className={`pb-3 text-sm font-bold relative transition-all ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                                {tab}
                                            </button>
                                        ))}
                                        <div className="ml-auto mb-3 flex items-center gap-2 bg-white/[0.06] rounded-xl px-3 py-2 text-sm text-slate-400">
                                            <span className="material-symbols-outlined text-base">search</span>
                                            <input type="text" placeholder="Search book clubs" className="bg-transparent outline-none text-sm w-36" />
                                        </div>
                                    </div>
                                </div>

                                {/* CLUB GENRE SECTIONS */}
                                <div className="space-y-10">
                                    {["Fantasy", "Mystery & Thriller", "Romance", "Science Fiction", "Historical Fiction"].map((genre) => (
                                        <section key={genre}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-bold text-white">{genre} Clubs</h2>
                                                <button className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1">
                                                    See All <span className="material-symbols-outlined text-sm">chevron_right</span>
                                                </button>
                                            </div>
                                            <div className="border border-white/[0.06] rounded-2xl bg-white/[0.03] p-6 text-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">groups</span>
                                                <p className="text-sm text-slate-400 italic">No clubs in this category yet. Be the first to create one!</p>
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT PANEL */}
                            <div className="w-60 shrink-0 flex flex-col gap-5">
                                {/* CREATE CLUB CTA */}
                                <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm py-3 rounded-xl shadow hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined text-base">add</span> Create Club
                                </button>

                                {/* TRENDING CLUBS */}
                                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-slate-300 mb-4">Trending Clubs</h3>
                                    <div className="text-center py-4">
                                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">trending_up</span>
                                        <p className="text-xs text-slate-400 italic">No trending clubs yet.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeSection === "Explore" ? (
                        /* ===== EXPLORE VIEW ===== */
                        <div className="flex gap-8">
                            {/* LEFT */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold mb-1">Explore</h1>
                                <p className="text-slate-500 mb-6">Find your next great read or discover new genres</p>

                                {/* TABS */}
                                <div className="flex items-center justify-between border-b border-white/[0.06] mb-8">
                                    <div className="flex items-center gap-6">
                                        {["Books", "Authors", "Clubs"].map((tab, i) => (
                                            <button key={tab} className={`pb-3 text-sm font-bold relative transition-all ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1 mb-3">
                                        View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>

                                {/* TRENDING STORIES */}
                                <section className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-white">Trending Stories</h2>
                                        <button className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1">
                                            View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                    <div className="border border-white/[0.06] rounded-2xl bg-white/[0.03] p-6 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">trending_up</span>
                                        <p className="text-sm text-slate-400 italic">No trending stories yet. Check back soon!</p>
                                    </div>
                                </section>

                                {/* BROWSE BY GENRE */}
                                <section className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-white">Browse by Genre</h2>
                                        <button className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1">
                                            Explore All <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {["Romance", "Mystery", "Fantasy", "Sci-Fi", "Historical", "Thriller", "Adventure", "Horror"].map((g) => (
                                            <button key={g} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-indigo-400/40 hover:bg-white/[0.07] transition-all text-sm font-semibold text-slate-300">
                                                <span className="material-symbols-outlined text-base text-slate-400">auto_stories</span>
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* POPULAR AUTHORS */}
                                <section className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-white">Popular Authors</h2>
                                        <button className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1">
                                            View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                    <div className="border border-white/[0.06] rounded-2xl bg-white/[0.03] p-6 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">person_search</span>
                                        <p className="text-sm text-slate-400 italic">No authors to show yet.</p>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT PANEL */}
                            <div className="w-52 shrink-0 flex flex-col gap-5">
                                {/* HASHTAG PILLS */}
                                <div className="flex flex-wrap gap-2">
                                    {["#romantic", "#mystery", "#fantasy", "#historical", "#adventure", "#horror"].map((tag) => (
                                        <button key={tag} className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-slate-400 hover:border-indigo-400/40 hover:text-indigo-300 transition-colors">
                                            {tag}
                                        </button>
                                    ))}
                                </div>

                                {/* POPULAR TAGS */}
                                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-slate-300 mb-4">Popular Tags</h3>
                                    <div className="space-y-3">
                                        {["romantic", "mystery", "fantasy", "historical", "adventure"].map((tag) => (
                                            <button key={tag} className="flex items-center gap-3 w-full text-sm text-slate-600 hover:text-primary transition-colors">
                                                <div className="size-7 rounded-full bg-white/[0.07] flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">tag</span>
                                                </div>
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeSection === "Settings" ? (
                        /* ===== SETTINGS VIEW ===== */
                        <div className="flex gap-8">
                            {/* LEFT */}
                            <div className="flex-1 min-w-0">
                                {/* TABS HIDDEN BY REQUEST OR MOVED BELOW */}

                                {/* TABS AND TITLE REMOVED BY REQUEST */}

                                {/* ACCOUNT SETTINGS CARD */}
                                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 mb-6">
                                    <h2 className="text-base font-bold mb-6 text-white">Account Settings</h2>
                                    <div className="flex gap-8">
                                        {/* AVATAR ONLY */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="size-20 rounded-full overflow-hidden border-2 border-slate-100 shadow">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nasir" alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        {/* FIELDS */}
                                        <div className="flex-1 space-y-5">
                                            {/* Username */}
                                            <div>
                                                <label className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-1">
                                                    <span className="material-symbols-outlined text-sm">alternate_email</span> Username
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="@username"
                                                    value={settingsUsername}
                                                    onChange={(e) => setSettingsUsername(e.target.value)}
                                                    className="w-full border border-white/10 bg-white/[0.04] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                                                        <span className="material-symbols-outlined text-sm">mail</span> Email
                                                    </label>
                                                    <button className="text-xs font-semibold text-primary hover:underline">Change Email</button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={settingsEmail}
                                                        onChange={(e) => setSettingsEmail(e.target.value)}
                                                        className="flex-1 border border-white/10 bg-white/[0.04] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500"
                                                    />
                                                    <button
                                                        onClick={handleSaveUserSettings}
                                                        className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM ROW — Password + Delete Account */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Password */}
                                    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-slate-400 text-base">lock</span>
                                            <h3 className="text-sm font-bold text-white">Password</h3>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4">Change or update your password.</p>
                                        <button className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                                            Change Password
                                        </button>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="bg-white/[0.04] border border-red-500/20 rounded-2xl p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-red-400 text-base">delete</span>
                                            <h3 className="text-sm font-bold text-red-600">Delete Account</h3>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                        <button className="w-full py-2.5 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : activeSection === "Reading History" ? (
                        <ReadingHistoryView onStoryClick={handleStoryClick} />
                    ) : activeSection === "Term Dropped" ? (
                        <TermDroppedView onStoryClick={handleStoryClick} />
                    ) : activeSection === "Bookmarks" ? (
                        <BookmarksView onStoryClick={handleStoryClick} />
                    ) : activeSection === "Reading" && selectedStory ? (
                        <ClientReadingView story={selectedStory} onBack={() => setActiveSection("Books")} />
                    ) : (
                        /* ===== DEFAULT DASHBOARD VIEW ===== */
                        <div className="flex-1 overflow-y-auto py-8 px-10 custom-scrollbar-thin">
                            {/* STATS BAR */}
                            <div className="flex items-center gap-4 mb-8 flex-wrap">
                                <StatPill icon="library_books" value={stats.booksInLibrary.toString()} label="Books in Library" color="blue" />
                                <StatPill icon="menu_book" value={stats.currentlyReading.toString()} label="Currently Reading" color="emerald" />
                                <StatPill icon="bookmark" value={stats.bookmarks.toString()} label="Bookmarks" color="purple" />
                                <StatPill icon="local_fire_department" value={`${stats.streak} Day`} label="Reading Streak" color="orange" fire />
                                <button className="ml-auto text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                            </div>

                            {/* GREETING */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {oldUsername} <span>👋</span>
                                </h1>
                                <p className="text-slate-500 text-sm">Here's what's happening with your library today.</p>
                            </div>

                            {/* CONTINUE READING */}
                            <section className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800">Continue Reading</h2>
                                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                                        View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                    <p className="text-sm text-slate-400 italic">No books in progress yet. Start reading something!</p>
                                </div>
                            </section>

                            {/* NEWLY PUBLISHED SECTION */}
                            {publishedStories.length > 0 && (
                                <section className="mb-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-indigo-600">auto_awesome</span>
                                            Newly Published
                                        </h2>
                                        <button className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors">See All</button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                                        {publishedStories.map((story, idx) => (
                                            <div key={idx} onClick={() => handleStoryClick(story)} className="group cursor-pointer">
                                                <div className="aspect-[3/4] rounded-2xl bg-white mb-3 overflow-hidden shadow-sm group-hover:shadow-xl transition-all relative border border-slate-100">
                                                    {story.coverImage ? (
                                                        <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={story.title} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                                            <span className="material-symbols-outlined text-4xl">image</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-[8px] font-black text-white uppercase tracking-widest rounded-full shadow-sm">NEW</div>
                                                </div>
                                                <h3 className="text-sm font-bold truncate text-slate-800 group-hover:text-indigo-600 transition-colors">{story.title}</h3>
                                                <p className="text-xs text-slate-400 mb-1">{story.author}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}



function ClientReadingView({ story, onBack }: { story: any; onBack: () => void }) {
    const [showHighlights, setShowHighlights] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [activeColor, setActiveColor] = useState('#fff9c4');
    const [highlights, setHighlights] = useState<any[]>([]);
    const readerRef = useRef<HTMLDivElement>(null);

    // Voice Assistant State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const speechTimeoutRef = useRef<any>(null);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        };
    }, []);

    const stopSpeech = () => {
        window.speechSynthesis.cancel();
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        setIsSpeaking(false);
        setIsPaused(false);
    };

    const getCleanText = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const speak = (index: number) => {
        window.speechSynthesis.cancel();
        
        const titleText = story.title ? `${story.title}. ` : '';
        const authorText = story.author ? `by ${story.author}. ` : '';
        const manuscriptText = getCleanText(story.content || '');
        
        const fullText = `${titleText}${authorText}${manuscriptText}`;
        // Split text into sentences using comprehensive regex
        const sentences = fullText.match(/[^.!?]+[.!?]*/g) || [fullText];
        
        if (index >= sentences.length) {
            stopSpeech();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onend = () => {
            // Small delay for natural flow
            speechTimeoutRef.current = setTimeout(() => {
                if (isSpeaking && !isPaused) {
                    speak(index + 1);
                }
            }, 300);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePlay = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        // Always start from the beginning when initial play is clicked
        speak(0);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
    };

    const handleResume = () => {
        window.speechSynthesis.resume();
        setIsPaused(false);
    };

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem(`highlights_${story.id}`);
        if (saved) setHighlights(JSON.parse(saved));
    }, [story.id]);

    const saveHighlights = (newHighlights: any[]) => {
        setHighlights(newHighlights);
        localStorage.setItem(`highlights_${story.id}`, JSON.stringify(newHighlights));
    };

    const handleTextHighlight = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const text = selection.toString().trim();
        if (!text) return;

        if (readerRef.current && !readerRef.current.contains(range.commonAncestorContainer)) return;

        const span = document.createElement('span');
        span.style.backgroundColor = activeColor;
        span.className = 'story-highlight transition-all duration-300';
        
        try {
            range.surroundContents(span);
            const newHighlight = {
                id: Date.now().toString(),
                text: text.length > 60 ? text.substring(0, 60) + '...' : text,
                fullText: text,
                color: activeColor,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                page: 'Page 1'
            };
            saveHighlights([...highlights, newHighlight]);
        } catch (e) {
            console.warn("Selection spans nodes.");
        }
        selection.removeAllRanges();
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            const doc = new jsPDF('p', 'pt', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const container = document.createElement('div');
            container.id = 'pdf-render-container';
            container.style.width = '700px';
            container.style.padding = '50px';
            container.style.backgroundColor = '#ffffff';
            container.style.fontFamily = "'Inter', sans-serif";
            
            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
                #pdf-render-container * { color: #000000 !important; }
                #pdf-render-container .story-highlight { color: #000000 !important; -webkit-print-color-adjust: exact; }
                #pdf-render-container h1 { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
            `;
            container.appendChild(styleElement);

            const contentHTML = `
                <div style="border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="text-transform: uppercase;">${story.title}</h1>
                    <p style="color: #6366f1; font-weight: 700;">By ${story.author_name || story.author}</p>
                </div>
                <div style="font-size: 14px; line-height: 1.8; text-align: justify;">
                    ${readerRef.current ? readerRef.current.innerHTML : story.content}
                </div>
            `;
            
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = contentHTML;
            container.appendChild(contentDiv);
            document.body.appendChild(container);

            await doc.html(container, {
                callback: (pdf) => {
                    pdf.save(`${story.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
                    document.body.removeChild(container);
                    setIsDownloading(false);
                },
                x: 0, y: 0, width: pageWidth, windowWidth: 700,
                margin: [40, 40, 40, 40],
                autoPaging: 'text',
                html2canvas: { useCORS: true, scale: 2 }
            });
        } catch (error) {
            console.error("PDF Export error:", error);
            setIsDownloading(false);
        }
    };

    const colors = [
        { id: 'yellow', value: '#fff9c4' },
        { id: 'green', value: '#c8e6c9' },
        { id: 'pink', value: '#f8bbd0' },
        { id: 'blue', value: '#e1f5fe' },
        { id: 'purple', value: '#e1bee7' }
    ];

    return (
        <div className="flex flex-col h-screen bg-[#faf9f6]/50 transition-colors duration-500 overflow-hidden relative">
            {/* FOCUSED HEADER */}
            <header className="h-16 shrink-0 focused-reader-header px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-full transition-all group active:scale-95">
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-indigo-600 transition-colors">arrow_back</span>
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black text-slate-800 tracking-tight uppercase line-clamp-1">{story.title}</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] text-slate-400 font-bold italic">by {story.author}</p>
                            <span className="text-[6px] text-slate-300">●</span>
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Page 1</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Voice Assistant Controls */}
                    <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl mr-2">
                        {!isSpeaking ? (
                            <button 
                                onClick={handlePlay}
                                title="Play Story"
                                className="p-2 aspect-square flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-base">play_arrow</span>
                            </button>
                        ) : (
                            <>
                                {isPaused ? (
                                    <button 
                                        onClick={handleResume}
                                        title="Resume"
                                        className="p-2 aspect-square flex items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-base">play_circle</span>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handlePause}
                                        title="Pause"
                                        className="p-2 aspect-square flex items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-base">pause</span>
                                    </button>
                                )}
                                <button 
                                    onClick={stopSpeech}
                                    title="Stop"
                                    className="p-2 aspect-square flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-base">stop</span>
                                </button>
                            </>
                        )}
                    </div>

                    <button onClick={handleDownload} disabled={isDownloading} className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20">
                        <span className="material-symbols-outlined text-sm">{isDownloading ? 'sync' : 'download'}</span>
                        {isDownloading ? 'Processing...' : 'Export PDF'}
                    </button>
                    <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                    <button onClick={() => setShowHighlights(!showHighlights)} className={`p-2.5 rounded-xl transition-all ${showHighlights ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-400'}`}>
                        <span className="material-symbols-outlined">stylus_note</span>
                    </button>
                </div>
            </header>

            {/* PROGRESS BAR */}
            <div className="h-0.5 w-full bg-slate-100 relative z-40 overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-300" style={{ width: '4%' }}></div>
            </div>

            {/* CENTERED CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar-thin flex justify-center py-16 px-6 bg-white/50">
                <article ref={readerRef} onMouseUp={handleTextHighlight} className="max-w-3xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="mb-20 text-center">
                         <span className="text-[10px] font-black tracking-[0.4em] text-indigo-500/60 uppercase mb-6 block">Prologue</span>
                         <h2 className="font-lora text-5xl font-bold text-slate-800 leading-tight mb-10 selection:bg-indigo-100">{story.title}</h2>
                         <div className="flex items-center justify-center gap-4 opacity-20">
                             <div className="h-[1px] w-12 bg-slate-900"></div>
                             <span className="material-symbols-outlined text-sm">auto_stories</span>
                             <div className="h-[1px] w-12 bg-slate-900"></div>
                         </div>
                    </div>

                    <div className="font-lora text-lg leading-[2.2] text-slate-700 story-body-text selection:bg-indigo-100 story-content">
                         {story.content ? (
                             <div dangerouslySetInnerHTML={{ __html: story.content }} />
                         ) : (
                             <p className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 italic">No manuscript content found for this story.</p>
                         )}
                    </div>
                    
                    <div className="mt-28 pt-16 border-t border-slate-100 flex flex-col items-center gap-8 pb-32">
                         <div className="size-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                             <span className="material-symbols-outlined text-slate-300 text-2xl animate-pulse">menu_book</span>
                         </div>
                         <div className="text-center">
                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-2">End of Preview</p>
                            <p className="text-slate-400 text-[10px] font-medium opacity-60">PlotNest Reading Experience</p>
                         </div>
                    </div>
                </article>
            </div>

            {/* HIGHLIGHTS DRAWER */}
            <aside className={`fixed top-16 right-0 bottom-0 w-85 bg-white border-l border-slate-200 shadow-2xl z-[60] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${showHighlights ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight text-sm">
                                <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-indigo-500 text-lg">stylus_note</span>
                                </div>
                                My Highlights
                            </h3>
                            <button onClick={() => setShowHighlights(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-sm">close</span>
                            </button>
                        </div>

                        {/* Color Selector */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Active Color</span>
                            <div className="flex gap-2.5">
                                {colors.map(c => (
                                    <button 
                                        key={c.id} 
                                        onClick={() => setActiveColor(c.value)} 
                                        className={`size-6 rounded-full border-2 transition-all ${activeColor === c.value ? 'scale-110 border-indigo-500 shadow-lg' : 'border-white hover:scale-105'}`} 
                                        style={{ backgroundColor: c.value }} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-thin space-y-5">
                        {highlights.length > 0 ? [...highlights].reverse().map((h, i) => (
                            <div key={i} className="group p-5 rounded-3xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: h.color }}></div>
                                    <p className="text-xs leading-[1.8] text-slate-600 font-medium italic">
                                        "{h.text}"
                                    </p>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em]">{h.timestamp}</span>
                                    <button onClick={() => saveHighlights(highlights.filter((_, idx) => highlights.length - 1 - idx !== i))} className="size-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-base">delete_outline</span>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="size-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                                    <span className="material-symbols-outlined text-slate-200 text-4xl">auto_stories</span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">No highlights yet</h4>
                                <p className="text-slate-400 text-[10px] leading-relaxed max-w-[180px] font-medium italic">Select text in the editor to save your favorite moments.</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}

function StatPill({ icon, value, label, fire, color }: { icon: string; value: string; label: string; fire?: boolean; color: string }) {
    const colorClasses: Record<string, { bg: string, text: string, border: string, shadow: string, iconBg: string }> = {
        blue: {
            bg: 'bg-blue-500/10 hover:bg-blue-500/20',
            text: 'text-blue-700',
            border: 'border-blue-500/20',
            shadow: 'shadow-blue-500/10',
            iconBg: 'text-blue-600'
        },
        emerald: {
            bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
            text: 'text-emerald-700',
            border: 'border-emerald-500/20',
            shadow: 'shadow-emerald-500/10',
            iconBg: 'text-emerald-600'
        },
        purple: {
            bg: 'bg-purple-500/10 hover:bg-purple-500/20',
            text: 'text-purple-700',
            border: 'border-purple-500/20',
            shadow: 'shadow-purple-500/10',
            iconBg: 'text-purple-600'
        },
        orange: {
            bg: 'bg-orange-500/10 hover:bg-orange-500/20',
            text: 'text-orange-700',
            border: 'border-orange-500/20',
            shadow: 'shadow-orange-500/10',
            iconBg: 'text-orange-600'
        }
    };

    const style = colorClasses[color];

    return (
        <div className={`
            group flex items-center gap-4 px-6 py-3.5 rounded-2xl border 
            ${style.bg} ${style.border} ${style.shadow}
            transition-all duration-300 ease-out
            hover:shadow-xl hover:-translate-y-1 active:scale-105
            cursor-pointer backdrop-blur-sm
        `}>
            <div className={`flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <span className={`material-symbols-outlined text-2xl ${style.iconBg} ${fire ? 'animate-pulse' : ''}`}>
                    {icon}
                </span>
            </div>

            <div className="flex flex-col">
                <span className={`font-black text-slate-800 text-lg leading-none tracking-tight`}>{value}</span>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${style.text} leading-none mt-1.5`}>{label}</span>
            </div>
        </div>
    );
}



function MyLibraryView({ onStoryClick }: { onStoryClick: (story: any) => void }) {
    const libTabs = ["All Books", "Currently Reading 2", "Completed", "Favorites"];
    const [activeTab, setActiveTab] = useState("Currently Reading 2");

    const continueReading: any[] = [];

    const allBooks: any[] = [];

    return (
        <div className="flex gap-8 animate-in fade-in duration-500">
            {/* Main Column */}
            <div className="flex-1 min-w-0">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-indigo-500 text-3xl">library_books</span>
                        <h1 className="text-3xl font-black text-white tracking-tight italic">My Library</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Your personal reading space</p>
                </div>

                {/* Sub Tabs */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex p-1 bg-white/[0.05] rounded-xl border border-white/10">
                        {libTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <select className="appearance-none bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 pr-10 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer">
                            <option>Recently Added</option>
                            <option>Title A-Z</option>
                            <option>Progress</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">expand_more</span>
                    </div>
                </div>

                {/* Continue Reading Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-6">Continue Reading</h2>
                    {continueReading.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {continueReading.map((book, i) => (
                                <div key={i} onClick={() => onStoryClick(book)} className="group cursor-pointer relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all hover:border-white/20">
                                    <img src={book.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={book.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/40 to-transparent" />
                                    
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-lg">READING</span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-3xl font-black text-white italic">{book.progress}%</span>
                                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${book.progress}%` }} />
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-xl font-black text-white mb-1 truncate uppercase tracking-tight">{book.title}</h3>
                                                <p className="text-slate-400 text-xs mb-3 italic">by {book.author}</p>
                                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                                                    <span className="material-symbols-outlined text-xs">list</span>
                                                    {book.chapter}
                                                </div>
                                            </div>
                                            <button onClick={() => onStoryClick(book)} className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-500 transition-all uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                                                Continue Reading
                                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                            <span className="material-symbols-outlined text-5xl mb-4 opacity-20">hourglass_empty</span>
                            <p className="text-sm font-medium italic">No books in progress currently</p>
                        </div>
                    )}
                </div>

                {/* All Books Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-6">All Books</h2>
                    {allBooks.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            {allBooks.map((book, i) => (
                                <div key={i} onClick={() => onStoryClick(book)} className="group cursor-pointer">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-indigo-500/10 transition-all relative border border-white/5 bg-[#16162a]/40">
                                        <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={book.title} />
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-2 left-2">
                                            {book.status === "READING" && <span className="px-2 py-0.5 bg-amber-500 text-[8px] font-black text-white uppercase tracking-widest rounded-md">READING</span>}
                                            {book.status === "COMPLETED" && <span className="px-2 py-0.5 bg-green-500 text-[8px] font-black text-white uppercase tracking-widest rounded-md">COMPLETED</span>}
                                            {book.status === "NOT STARTED" && <span className="px-2 py-0.5 bg-slate-500 text-[8px] font-black text-white uppercase tracking-widest rounded-md">NOT STARTED</span>}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-sm font-bold truncate text-white uppercase tracking-tight mb-0.5">{book.title}</h3>
                                        <p className="text-[10px] text-slate-500 mb-2 italic">by {book.author}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${book.genre === 'ROMANCE' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                                {book.genre}
                                            </span>
                                            <span className="material-symbols-outlined text-[14px] text-slate-600 ml-auto">bookmark</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                            <span className="material-symbols-outlined text-4xl mb-3 opacity-20">library_add</span>
                            <p className="text-sm font-medium italic">Your library is empty. Start exploring!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar widgets */}
            <div className="w-80 shrink-0 flex flex-col gap-6">
                <div className="p-6 bg-white/[0.04] border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-10">Reading Stats</h3>
                    
                    <div className="space-y-6">
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl group opacity-60">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-indigo-400 text-lg">auto_stories</span>
                                        <p className="text-[10px] font-bold text-slate-400 leading-tight">Books Completed</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Tracked monthly</p>
                                </div>
                                <span className="text-4xl font-black text-white italic">--</span>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl group opacity-60">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <span className="material-symbols-outlined text-amber-500 text-lg">schedule</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-slate-400 mb-0.5 leading-tight">Total Reading Time</p>
                                    <p className="text-xl font-black text-white italic tracking-tight">-- hrs -- mins</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl group opacity-60">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                    <span className="material-symbols-outlined text-violet-400 text-lg">bolt</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-slate-400 mb-0.5 leading-tight">Average Reading Speed</p>
                                    <p className="text-xl font-black text-white italic tracking-tight">0 <span className="text-[10px] opacity-40 uppercase ml-1">pages/hr</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReadingHistoryView({ onStoryClick: _onStoryClick }: { onStoryClick: (story: any) => void }) {
    const historyTabs = ["All 14", "In Progress", "Completed: 11", "Dropped"];
    const [activeTab, setActiveTab] = useState("All 14");

    return (
        <div className="flex gap-8 animate-in fade-in duration-500">
            {/* Main Column */}
            <div className="flex-1 min-w-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tight italic mb-2">Reading History</h1>
                    <p className="text-slate-500 text-sm font-medium">Look back at all the books you've read</p>
                </div>

                {/* Filters Row */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex p-1 bg-white/[0.05] rounded-xl border border-white/10">
                        {historyTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/[0.08] transition-all">
                            <span>Jan 1, 2024 - Apr 24, 2024</span>
                            <span className="material-symbols-outlined text-base text-slate-500">expand_more</span>
                        </div>
                    </div>
                </div>

                {/* Currently Reading Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Currently Reading</h2>
                    <div className="space-y-4">
                        {/* Empty state for Currently Reading */}
                        <div className="p-16 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                            <span className="material-symbols-outlined text-5xl mb-4 opacity-20">pending_actions</span>
                            <p className="text-sm font-medium italic">No books are currently being read</p>
                        </div>
                    </div>
                </div>

                {/* Reading Summary Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Reading Summary</h2>
                    <div className="space-y-4">
                        {/* Empty state for Reading Summary */}
                        <div className="p-12 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                            <span className="material-symbols-outlined text-4xl mb-3 opacity-20">history_edu</span>
                            <p className="text-sm font-medium italic">No reading history found for this period</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar widgets */}
            <div className="w-80 shrink-0 flex flex-col gap-6">
                <div className="p-8 bg-white/[0.04] border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Stats Overview</h3>
                    
                    <div className="space-y-4">
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4 group">
                            <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Time Spent Reading</p>
                                <p className="text-xl font-black text-white italic tracking-tight">-- hrs -- mins</p>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4 group">
                            <div className="size-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">check_box</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Books Completed</p>
                                <p className="text-xl font-black text-white italic tracking-tight">--</p>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4 group">
                            <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">cancel</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Books Dropped</p>
                                <p className="text-xl font-black text-white italic tracking-tight">--</p>
                            </div>
                        </div>

                        <button className="w-full mt-4 py-4 bg-indigo-600 text-white font-black text-xs rounded-2xl hover:bg-indigo-500 transition-all uppercase tracking-[0.15em] shadow-lg shadow-indigo-600/20 active:scale-95">
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrendsView({ onStoryClick }: { onStoryClick: (story: any) => void }) {
    const timeRanges = ["Today", "Week", "Month"];
    const [activeRange, setActiveRange] = useState("Week");

    const topTrending: any[] = [];

    const trendingBooks: any[] = [];

    return (
        <div className="flex gap-8 animate-in fade-in duration-500">
            {/* Main Column */}
            <div className="flex-1 min-w-0">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🔥</span>
                        <h1 className="text-3xl font-black text-white tracking-tight italic">Trending Now</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Discover what readers love the most</p>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex p-1 bg-white/[0.05] rounded-xl border border-white/10">
                        {timeRanges.map(range => (
                            <button
                                key={range}
                                onClick={() => setActiveRange(range)}
                                className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeRange === range ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <select className="appearance-none bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 pr-10 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer">
                            <option>All Genres</option>
                            <option>Fantasy</option>
                            <option>Mystery</option>
                            <option>Thriller</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">expand_more</span>
                    </div>
                </div>

                {/* Top Trending Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-amber-500">emoji_events</span>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Top Trending</h2>
                    </div>
                    {topTrending.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {topTrending.map((book) => (
                                <div key={book.id} onClick={() => onStoryClick(book)} className="group relative cursor-pointer aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all hover:-translate-y-2 hover:shadow-indigo-500/10">
                                    <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={book.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                    
                                    {/* Rank Badge */}
                                    <div className="absolute top-4 left-4 size-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                        <span className="text-white font-black text-lg opacity-60 italic">#{book.id}</span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded text-[9px] font-black uppercase tracking-widest">{book.genre}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-white mb-1 line-clamp-2 leading-tight uppercase tracking-tight">{book.title}</h3>
                                        <p className="text-slate-400 text-xs mb-4 italic">by {book.author}</p>
                                        <div className="flex items-center justify-end gap-2 text-slate-300 text-xs font-bold">
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            {book.reads}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-3 opacity-20">auto_stories</span>
                            <p className="text-sm font-medium italic">No trending stories to show right now</p>
                        </div>
                    )}
                </div>

                {/* Trending Books List */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Trending Books</h2>
                        <button className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-all flex items-center gap-1">
                            See All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    {trendingBooks.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {trendingBooks.map((book, i) => (
                                <div key={i} onClick={() => onStoryClick(book)} className="group cursor-pointer p-4 bg-[#16162a]/40 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex gap-5 items-center">
                                    <div className="w-20 h-28 rounded-xl overflow-hidden shadow-lg flex-shrink-0 border border-white/10">
                                        <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={book.title} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-black text-white mb-1 truncate uppercase tracking-tight">{book.title}</h3>
                                        <p className="text-xs text-slate-500 mb-3 italic">by {book.author}</p>
                                        <div className="flex items-center gap-4 text-[10px] font-bold">
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <span className="material-symbols-outlined text-xs">visibility</span>
                                                {book.reads}
                                            </div>
                                            <div className="flex items-center gap-0.5 text-amber-500">
                                                {[...Array(5)].map((_, idx) => (
                                                    <span key={idx} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: idx < book.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <span className="material-symbols-outlined text-xs">auto_stories</span>
                                                {book.readCount} Reads
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => onStoryClick(book)} className="px-5 py-2.5 bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 text-[10px] font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
                                        Read Now
                                        <span className="text-[6px] opacity-60">●</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-3 opacity-20">library_books</span>
                            <p className="text-sm font-medium italic">Updates are coming soon</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar widgets */}
            <div className="w-80 shrink-0 flex flex-col gap-6">
                <div className="p-6 bg-white/[0.04] border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Insight of the Week</h3>
                    
                    <div className="space-y-6">
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-400 mb-1 leading-tight">Most Read Genre:</p>
                                    <p className="text-lg font-black text-white italic">---</p>
                                </div>
                                <div className="size-12 rounded-xl bg-[#1e1e3a] flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-indigo-400">bar_chart</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group filter grayscale opacity-50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-400 mb-1 leading-tight">Peak Reading Time:</p>
                                    <p className="text-lg font-black text-white italic">-- : --</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-indigo-400 text-[10px] font-bold">(No data yet)</span>
                                <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                     <div className="h-full w-0 bg-indigo-500" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group">
                             <div className="flex items-center justify-between mb-4">
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-400 mb-1 leading-tight">Top Author of the Week</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full border-2 border-slate-700/20 bg-slate-800/20 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-slate-600">person</span>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white leading-tight">Stay tuned</p>
                                    <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-[10px] font-bold">
                                        <span className="material-symbols-outlined text-[10px]">timer</span>
                                        Calculating...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TermDroppedView({ onStoryClick }: { onStoryClick: (story: any) => void }) {
    const droppedTabs = ["All 0", "Unread", "Partially Read 0", "Reasons"];
    const [activeTab, setActiveTab] = useState("All 0");

    const droppedBooks: any[] = [];

    const getReasonColor = (reason: string) => {
        switch (reason) {
            case 'LOST INTEREST': return 'bg-amber-500/20 border-amber-500/30 text-amber-500';
            case 'TOO CLICHÉD': return 'bg-red-500/20 border-red-500/30 text-red-500';
            case 'NOT MY TASTE': return 'bg-orange-500/20 border-orange-500/30 text-orange-500';
            default: return 'bg-slate-500/20 border-slate-500/30 text-slate-400';
        }
    };

    return (
        <div className="flex gap-8 animate-in fade-in duration-500 px-10 py-8">
            {/* Main Column */}
            <div className="flex-1 min-w-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tight italic mb-2">Term Dropped 😒</h1>
                    <p className="text-slate-500 text-sm font-medium italic">Books you gave a second chance, but it wasn't quite meant to be</p>
                </div>

                {/* Filters Row */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex p-1 bg-white/[0.05] rounded-xl border border-white/10">
                            {droppedTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/[0.08] transition-all">
                                <span>Reasons</span>
                                <span className="material-symbols-outlined text-base text-slate-500">expand_more</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/[0.08] transition-all">
                                <span>Jan 1, 2024 - Apr 24, 2024</span>
                                <span className="material-symbols-outlined text-base text-slate-500">expand_more</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/[0.08] transition-all">
                                <span>Sort by <span className="text-white">Dropped Date</span></span>
                                <span className="material-symbols-outlined text-base text-slate-500">expand_more</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dropped Books List */}
                <div className="space-y-4">
                    {droppedBooks.length > 0 ? (
                        droppedBooks.map((book) => (
                            <div key={book.id} className="group flex bg-[#16162a]/60 rounded-[2rem] border border-white/5 overflow-hidden hover:border-white/10 transition-all">
                                <div className="w-48 h-44 shrink-0 relative">
                                    <img src={book.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={book.title} />
                                    {book.id === 4 && (
                                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-orange-600/80 backdrop-blur-md text-[8px] font-black text-white rounded-lg flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">thumb_down</span> NOT MY TASTE
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3">
                                        <span className="px-2 py-0.5 bg-[#09090f]/60 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">grid_view</span> {book.genre}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-center">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-black text-white truncate uppercase tracking-tight mb-1">{book.title}</h3>
                                            <p className="text-slate-500 text-xs font-bold mb-4">{book.author}</p>
                                            
                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                <span className={`px-2.5 py-1 text-[9px] font-black border rounded-lg ${getReasonColor(book.reason)}`}>
                                                    {book.reason}
                                                </span>
                                                <p className="text-xs text-slate-400 font-medium italic">
                                                    {book.reasonDetails}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onStoryClick(book)} className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-500 transition-all uppercase tracking-widest">
                                                Resume
                                            </button>
                                            <button className="p-2.5 bg-white/[0.05] border border-white/10 text-white rounded-xl hover:bg-white/[0.1] transition-all">
                                                <span className="material-symbols-outlined text-base">more_horiz</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 border-t border-white/5 pt-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">event_busy</span>
                                            Dropped {book.daysAgo}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            {book.droppedDate}
                                        </div>
                                        <div className="ml-auto flex items-center gap-1.5 opacity-60">
                                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inventory_2</span>
                            <p className="text-base font-medium italic">No dropped books to show yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="w-80 shrink-0 flex flex-col gap-6">
                <div className="p-8 bg-white/[0.04] border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Quick Filters</h3>
                    
                    <div className="space-y-4">
                        {[
                            { label: 'Lost Interest', icon: 'auto_stories', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                            { label: 'Too Clichéd', icon: 'person_alert', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                            { label: 'Not My Taste', icon: 'sentiment_dissatisfied', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                            { label: 'Other Reasons', icon: 'forum', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
                        ].map((filter) => (
                            <button key={filter.label} className={`w-full p-5 ${filter.bg} border ${filter.border} rounded-3xl flex items-center gap-4 group hover:scale-[1.02] transition-all`}>
                                <div className={`size-10 rounded-2xl bg-black/20 flex items-center justify-center ${filter.color}`}>
                                    <span className="material-symbols-outlined">{filter.icon}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-300">{filter.label}</p>
                            </button>
                        ))}
                    </div>
                    
                    <p className="mt-8 text-xs text-slate-500 font-medium italic text-center px-4">
                        Quickly find and revisit the books you cropped.
                    </p>
                </div>
            </div>
        </div>
    );
}

function BookmarksView({ onStoryClick }: { onStoryClick: (story: any) => void }) {
    const bookmarkTabs = ["All 0", "Notes 0", "Highlights 0", "Reasons"];
    const [activeTab, setActiveTab] = useState("All 0");

    const bookmarks: any[] = [];

    return (
        <div className="flex gap-8 animate-in fade-in duration-500 px-10 py-8">
            {/* Main Column */}
            <div className="flex-1 min-w-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Bookmarks</h1>
                    <p className="text-slate-500 text-sm font-medium">Your saved passages, quotes, and notes, all in one place</p>
                </div>

                {/* Filters Row */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex p-1 bg-white/[0.05] rounded-xl border border-white/10">
                            {bookmarkTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/[0.08] transition-all">
                                <span>Reasons</span>
                                <span className="material-symbols-outlined text-base text-slate-500">expand_more</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/[0.08] transition-all">
                                <span>Jan 1, 2024 - Apr 24, 2024</span>
                                <span className="material-symbols-outlined text-base text-slate-500">expand_more</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/[0.08] transition-all">
                                <span>Sort by <span className="text-white">Recently Added</span></span>
                                <span className="material-symbols-outlined text-base text-slate-500">expand_more</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookmark List */}
                <div className="space-y-4">
                    {bookmarks.length > 0 ? (
                        bookmarks.map((bookmark) => (
                            <div key={bookmark.id} onClick={() => onStoryClick(bookmark)} className="group bg-[#16162a]/60 rounded-[2rem] border border-white/5 overflow-hidden hover:border-white/10 transition-all p-6 cursor-pointer">
                                <div className="flex gap-6">
                                    <div className="w-24 h-32 shrink-0 relative rounded-xl overflow-hidden">
                                        <img src={bookmark.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={bookmark.title} />
                                        <div className="absolute bottom-2 left-2">
                                            <span className="px-1.5 py-0.5 bg-indigo-600/80 backdrop-blur-md text-[8px] font-black text-white rounded flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">grid_view</span> {bookmark.genre}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-black text-white tracking-tight uppercase mb-0.5">{bookmark.title}</h3>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{bookmark.author}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="px-4 py-1.5 bg-white/[0.05] text-slate-400 text-[10px] font-bold rounded-lg hover:text-white transition-all">
                                                    Delete
                                                </button>
                                                <button className="px-4 py-1.5 bg-indigo-600/20 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                                                    Edit
                                                </button>
                                                <button className="p-1.5 text-slate-500 hover:text-white">
                                                    <span className="material-symbols-outlined text-lg">more_horiz</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-4">
                                            {bookmark.type === 'Highlight' ? (
                                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                                    "<span className="bg-amber-500/20 text-amber-200 px-1 rounded">{bookmark.content}</span>"
                                                </p>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <span className="material-symbols-outlined text-amber-500 text-sm shrink-0">edit_note</span>
                                                    <p className="text-sm text-slate-300 leading-relaxed italic">
                                                        Note: {bookmark.content}
                                                    </p>
                                                </div>
                                            )}
                                            {bookmark.note && (
                                                <div className="mt-4 flex gap-3 text-slate-500 border-t border-white/5 pt-3">
                                                    <span className="material-symbols-outlined text-sm shrink-0">comment</span>
                                                    <p className="text-xs italic">{bookmark.note}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">menu_book</span>
                                                {bookmark.title}
                                            </div>
                                            <div className="size-1 rounded-full bg-slate-700"></div>
                                            <div>{bookmark.chapter}</div>
                                            <div className="size-1 rounded-full bg-slate-700"></div>
                                            <div className="flex items-center gap-1.5">
                                                {bookmark.progress.includes('Completed') ? (
                                                    <span className="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-sm">donut_large</span>
                                                )}
                                                {bookmark.progress}
                                            </div>
                                            <div className="ml-auto flex items-center gap-3">
                                                <span>{bookmark.timestamp}</span>
                                                <span className="material-symbols-outlined text-sm cursor-pointer hover:text-white">bookmark</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">bookmark_border</span>
                            <p className="text-base font-medium italic">No bookmarks found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="w-80 shrink-0 flex flex-col gap-6">
                <div className="p-8 bg-white/[0.04] border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Quick Actions</h3>
                    
                    <div className="space-y-4">
                        {[
                            { label: 'Add Note', icon: 'edit_note', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                            { label: 'Add Highlight', icon: 'fluid_meduration', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                            { label: 'Export Bookmarks', icon: 'download', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
                        ].map((action) => (
                            <button key={action.label} className={`w-full p-5 ${action.bg} border ${action.border} rounded-3xl flex items-center gap-4 group hover:scale-[1.02] transition-all`}>
                                <div className={`size-10 rounded-2xl bg-black/20 flex items-center justify-center ${action.color}`}>
                                    <span className="material-symbols-outlined">{action.icon}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-300">{action.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <a onClick={onClick} className={`flex items-center gap-4 px-6 py-3.5 rounded-xl cursor-pointer transition-all group ${active ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'}`}>
            <span className={`material-symbols-outlined text-xl transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-slate-300'}`}>
                {icon}
            </span>
            <span className="text-sm font-bold">{label}</span>
            {active && <div className="ml-auto w-1 h-5 bg-primary rounded-full"></div>}
        </a>
    );
}
