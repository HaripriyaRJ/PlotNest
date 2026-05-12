import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GENRES = [
    { name: "Adventure", icon: "explore", color: "from-emerald-500 to-teal-600", bg: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80" },
    { name: "Mystery", icon: "search", color: "from-slate-600 to-slate-800", bg: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop&q=80" },
    { name: "Fantasy", icon: "auto_awesome", color: "from-violet-500 to-purple-700", bg: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80" },
    { name: "Sci-Fi", icon: "rocket_launch", color: "from-cyan-500 to-blue-600", bg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80" },
    { name: "Historical", icon: "history_edu", color: "from-amber-500 to-orange-600", bg: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80" },
    { name: "Thriller", icon: "bolt", color: "from-red-500 to-rose-700", bg: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80" },
];

const FEATURES = [
    {
        icon: "menu_book",
        title: "Endless Library",
        color: "from-indigo-500 to-violet-600",
        desc: "Access thousands of stories across every genre, from debut authors to bestsellers.",
        longDesc: "Dive into a vast collection of literary works. From epic high-fantasy series to gritty noir mysteries and heartwarming contemporary romances, our library is ever-expanding. We curate stories from independent voices and established authors alike, ensuring there's always something new and exciting to discover. Explore curated collections, top-rated staff picks, and the latest trending titles."
    },
    {
        icon: "edit_note",
        title: "Write & Publish",
        color: "from-emerald-500 to-teal-600",
        desc: "Craft your stories with our distraction-free editor and share them with the world instantly.",
        longDesc: "Your creative journey starts here. Our distraction-free editor provides a clean, elegant space to focus solely on your words. With built-in versioning, auto-save, and rich formatting tools, crafting your masterpiece has never been smoother. Once you're ready, publish instantly to millions of readers or schedule your chapters for a controlled release. Build your author profile and start your legacy."
    },
    {
        icon: "groups",
        title: "Reading Clubs",
        color: "from-amber-500 to-orange-600",
        desc: "Join vibrant book clubs, discuss chapters, and find your literary tribe.",
        longDesc: "Stories are better when shared. Join existng book clubs or start your own to dive deep into discussions with fellow readers. Engage in chapter-by-chapter breakdowns, share theories, and participate in live Q&A sessions with authors. Our community features live chat, moderated forums, and member-only events, making PlotNest the ultimate social hub for book lovers."
    },
    {
        icon: "trending_up",
        title: "Author Analytics",
        color: "from-rose-500 to-pink-600",
        desc: "Track reads, likes, and comments. Understand your audience and grow your readership.",
        longDesc: "Data-driven insights for the modern author. Gain detailed analytics on your readership, including reader demographics, average reading time, and chapter-by-chapter drop-off rates. Monitor your story's performance in real-time with live notifications for new likes, comments, and follows. Use these insights to refine your storytelling and maximize your reach within the PlotNest community."
    },
    {
        icon: "bookmark_added",
        title: "Smart Bookmarks",
        color: "from-cyan-500 to-blue-600",
        desc: "Save and organise stories, chapters, and highlights all in one beautiful library.",
        longDesc: "Never lose your place again. Our intelligent bookmarking system syncs across all your devices, allowing you to pick up exactly where you left off. Organize your personal library with custom tags and folders. Highlight your favorite passages, leave private notes on chapters, and save entire series for offline reading. Your reading journey, perfectly organized."
    },
    {
        icon: "explore",
        title: "Discover Daily",
        color: "from-fuchsia-500 to-purple-600",
        desc: "Personalised recommendations that learn your taste and surface hidden gems.",
        longDesc: "A personalized reading experience tailored to you. Our advanced discovery engine analyzes your reading habits and preferences to surface stories you'll truly love. From 'Hidden Gems' by emerging authors to 'Masterpieces' in your favorite genres, your discovery feed is unique to you. The more you read, the smarter it gets, ensuring every day brings a new obsession."
    },
];

const STEPS = [
    { num: "01", title: "Create your account", desc: "Sign up in seconds — no credit card required. Get instant access to thousands of stories." },
    { num: "02", title: "Discover & follow authors", desc: "Browse by genre, mood, or trending. Follow authors and get notified on new chapters." },
    { num: "03", title: "Read, write & connect", desc: "Dive into stories, leave feedback, join clubs, and start your own publishing journey." },
];

const TESTIMONIALS = [
    { quote: "PlotNest completely changed how I read. I've discovered authors I never would have found anywhere else.", name: "Aisha M.", handle: "@aisha_reads", avatar: "Aisha" },
    { quote: "Publishing on PlotNest was effortless. My first story hit 10k reads in two weeks. Absolutely incredible.", name: "James O.", handle: "@jameswrites", avatar: "James" },
    { quote: "The reading clubs are my favourite part. It feels like a real community, not just an app.", name: "Sara K.", handle: "@sara_pages", avatar: "Sara" },
];

interface FooterHighlight {
    icon: string;
    title: string;
    desc: string;
}

interface FooterPageContent {
    title: string;
    subtitle: string;
    description: string;
    highlights: FooterHighlight[];
    ctaText: string;
    ctaLink: string;
}

const FOOTER_CONTENT: Record<string, FooterPageContent> = {
    "Browse Stories": {
        title: "Browse Stories",
        subtitle: "A Universe of Imagination Awaits",
        description: "Dive into a vast library of genres, from epic fantasy to gripping thrillers. With thousands of stories hand-crafted by our community, there's always a new adventure to embark upon.",
        highlights: [
            { icon: "auto_stories", title: "120+ Genres", desc: "Find exactly what you're craving, whether it's sci-fi romance or historical fiction." },
            { icon: "trending_up", title: "Trending Weekly", desc: "Discover what millions of readers are currently obsessed with." },
            { icon: "star", title: "Curated Picks", desc: "Hand-picked recommendations from our editors to guarantee quality reads." }
        ],
        ctaText: "Start Reading Now",
        ctaLink: "/signup"
    },
    "Authors": {
        title: "For Authors",
        subtitle: "Your Words, Your Legacy",
        description: "Join PlotNest as an author. Get access to distraction-free writing tools, detailed analytics, and a passionate readership waiting for your next chapter.",
        highlights: [
            { icon: "edit_note", title: "Smart Editor", desc: "A distraction-free writing environment built specifically for serialized fiction." },
            { icon: "insights", title: "Deep Analytics", desc: "Track reader engagement, drop-off rates, and chapter popularity in real-time." },
            { icon: "monetization_on", title: "Earn from Day One", desc: "Unlock premium monetization options as your readership grows." }
        ],
        ctaText: "Become an Author",
        ctaLink: "/author-signup"
    },
    "Book Clubs": {
        title: "Book Clubs",
        subtitle: "Stories Are Better Shared",
        description: "Connect with fellow readers. Join discussions, share reviews, and explore stories together in our vibrant, community-led book clubs.",
        highlights: [
            { icon: "forum", title: "Live Discussions", desc: "Chat chapter-by-chapter with fans who are just as obsessed as you are." },
            { icon: "groups", title: "Find Your Tribe", desc: "Join niche clubs dedicated to specific tropes, genres, or authors." },
            { icon: "event", title: "Author Q&As", desc: "Participate in exclusive live events with your favorite creators." }
        ],
        ctaText: "Join a Club",
        ctaLink: "/signup"
    },
    "Pricing": {
        title: "Pricing",
        subtitle: "Plans that fit your reading habit",
        description: "Explore our flexible plans. From our free tier to Premium and Duo, find the perfect way to enjoy PlotNest without limits.",
        highlights: [
            { icon: "money_off", title: "Free Forever", desc: "Read thousands of free stories with our ad-supported tier." },
            { icon: "workspace_premium", title: "Premium Access", desc: "Unlock ad-free reading, offline downloads, and early chapter access." },
            { icon: "diversity_3", title: "Duo Plan", desc: "Share the cost and the stories with a friend or partner." }
        ],
        ctaText: "View All Plans",
        ctaLink: "/#pricing"
    },
    "Mobile App": {
        title: "Mobile App",
        subtitle: "Your Library in Your Pocket",
        description: "Take your stories on the go. Download the PlotNest mobile app for offline reading and seamless syncing across all your devices.",
        highlights: [
            { icon: "offline_pin", title: "Offline Reading", desc: "Download chapters and read anywhere, even without an internet connection." },
            { icon: "sync", title: "Seamless Sync", desc: "Start reading on your phone and pick up right where you left off on your tablet." },
            { icon: "notifications_active", title: "Instant Updates", desc: "Get push notifications the second a new chapter drops." }
        ],
        ctaText: "Download Now",
        ctaLink: "/signup"
    },
    "About Us": {
        title: "About Us",
        subtitle: "Bridging Readers and Writers",
        description: "PlotNest was founded on the belief that everyone has a story to tell. We're breaking down the traditional barriers of publishing to connect passionate readers directly with aspiring writers.",
        highlights: [
            { icon: "lightbulb", title: "Our Mission", desc: "To democratize storytelling and amplify diverse voices worldwide." },
            { icon: "public", title: "Global Community", desc: "Readers and writers from over 150 countries call PlotNest home." },
            { icon: "handshake", title: "Creator First", desc: "We prioritize author success and fair compensation above all else." }
        ],
        ctaText: "Read Our Story",
        ctaLink: "/signup"
    },
    "Blog": {
        title: "The PlotNest Blog",
        subtitle: "News, Tips, and Author Interviews",
        description: "Stay updated with the latest platform news, deep-dive author interviews, and expert writing tips from the PlotNest editorial team.",
        highlights: [
            { icon: "article", title: "Writing Advice", desc: "Master pacing, character development, and world-building." },
            { icon: "campaign", title: "Platform Updates", desc: "Be the first to know about new features and tools." },
            { icon: "record_voice_over", title: "Author Spotlights", desc: "Learn from the journey of our most successful creators." }
        ],
        ctaText: "Visit the Blog",
        ctaLink: "/signup"
    },
    "Careers": {
        title: "Careers",
        subtitle: "Build the Future of Reading",
        description: "Join our mission. We're always looking for talented engineers, designers, and community managers who are passionate about literature and technology.",
        highlights: [
            { icon: "rocket_launch", title: "Fast-Paced", desc: "Work in a dynamic, high-growth startup environment." },
            { icon: "home_work", title: "Remote First", desc: "Work from anywhere in the world. We care about impact, not location." },
            { icon: "favorite", title: "Great Perks", desc: "Comprehensive health coverage, unlimited PTO, and a reading stipend." }
        ],
        ctaText: "View Open Roles",
        ctaLink: "/signup"
    },
    "Press": {
        title: "Press",
        subtitle: "PlotNest in the News",
        description: "Download our press kit, read the latest media coverage about PlotNest, and get in touch with our PR team.",
        highlights: [
            { icon: "newspaper", title: "Media Coverage", desc: "See what major tech and literature publications are saying about us." },
            { icon: "download", title: "Press Kit", desc: "Download high-res logos, product screenshots, and founder bios." },
            { icon: "mic", title: "Media Inquiries", desc: "Contact our press team for interviews and statements." }
        ],
        ctaText: "Download Press Kit",
        ctaLink: "/signup"
    },
    "Contact": {
        title: "Contact Us",
        subtitle: "We're Here to Help",
        description: "Have questions, feedback, or need technical support? Our dedicated team is ready to assist you.",
        highlights: [
            { icon: "support_agent", title: "24/7 Support", desc: "Our global support team is always online to help you." },
            { icon: "forum", title: "Community Forum", desc: "Find answers and discuss solutions with other users." },
            { icon: "bug_report", title: "Report Issues", desc: "Found a bug? Let us know so we can fix it immediately." }
        ],
        ctaText: "Get in Touch",
        ctaLink: "/signup"
    },
    "Privacy Policy": {
        title: "Privacy Policy",
        subtitle: "Your Data, Protected",
        description: "We take your privacy seriously. Read our comprehensive policy on how we collect, use, and protect your personal data and reading habits.",
        highlights: [
            { icon: "lock", title: "Secure Encryption", desc: "All your data is encrypted both in transit and at rest." },
            { icon: "visibility_off", title: "No Third-Party Selling", desc: "We never sell your personal information to third parties." },
            { icon: "manage_accounts", title: "You Are in Control", desc: "Easily export or delete your account data at any time." }
        ],
        ctaText: "Read Full Policy",
        ctaLink: "/signup"
    },
    "Terms of Service": {
        title: "Terms of Service",
        subtitle: "The Rules of the Nest",
        description: "Our terms ensure a safe, respectful, and creative environment for all users on the platform. Please review the guidelines that govern the use of PlotNest.",
        highlights: [
            { icon: "gavel", title: "Clear Guidelines", desc: "Transparent rules on what is and isn't allowed on the platform." },
            { icon: "copyright", title: "Author Rights", desc: "You retain 100% of the rights to the original content you publish." },
            { icon: "shield", title: "Safe Community", desc: "Strict zero-tolerance policy for harassment and hate speech." }
        ],
        ctaText: "Read Terms",
        ctaLink: "/signup"
    },
    "Cookie Policy": {
        title: "Cookie Policy",
        subtitle: "How We Use Cookies",
        description: "Learn about how we use cookies and similar technologies to improve your experience, remember your preferences, and provide personalized recommendations.",
        highlights: [
            { icon: "cookie", title: "Essential Cookies", desc: "Necessary for the core functionality of the platform." },
            { icon: "tune", title: "Preference Cookies", desc: "Remember your dark mode settings and reading preferences." },
            { icon: "analytics", title: "Analytics Cookies", desc: "Help us understand how the platform is used so we can improve it." }
        ],
        ctaText: "Manage Preferences",
        ctaLink: "/signup"
    },
    "DMCA": {
        title: "DMCA Policy",
        subtitle: "Protecting Intellectual Property",
        description: "We deeply respect intellectual property rights. Find instructions on how to submit a copyright infringement notice and how we handle such claims.",
        highlights: [
            { icon: "policy", title: "Swift Action", desc: "We respond promptly to all valid DMCA takedown requests." },
            { icon: "balance", title: "Fair Process", desc: "Clear procedures for both reporting infringement and submitting counter-notices." },
            { icon: "contact_mail", title: "Designated Agent", desc: "Direct contact information for our official copyright agent." }
        ],
        ctaText: "Submit Notice",
        ctaLink: "/signup"
    }
};

export default function Home() {
    const [selectedFeature, setSelectedFeature] = useState<typeof FEATURES[0] | null>(null);
    const [latestStories, setLatestStories] = useState<any[]>([]);
    const [activeModal, setActiveModal] = useState<'browse' | 'authors' | 'pricing' | 'about' | 'signin' | null>(null);
    const [selectedFooterLink, setSelectedFooterLink] = useState<string | null>(null);




    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        const inner = card.querySelector('.genre-card-inner') as HTMLElement;
        if (inner) {
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const inner = e.currentTarget.querySelector('.genre-card-inner') as HTMLElement;
        if (inner) {
            inner.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        }
    };

    useEffect(() => {
        const fetchLatestStories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stories/published');
                if (response.ok) {
                    const data = await response.json();
                    setLatestStories(data.slice(0, 6));
                }
            } catch (err) {
                console.error("Failed to fetch stories:", err);
            }
        };
        fetchLatestStories();
    }, []);

    return (
        <div className="bg-[#09090f] text-white antialiased">
            {/* Global keyframe animations */}
            <style>{`
                @keyframes heroPan {
                    0%   { transform: scale(1.12) translate(0%, 0%); }
                    25%  { transform: scale(1.18) translate(-2%, -1.5%); }
                    50%  { transform: scale(1.22) translate(-1%, -3%); }
                    75%  { transform: scale(1.16) translate(1.5%, -1%); }
                    100% { transform: scale(1.12) translate(0%, 0%); }
                }
                @keyframes orbFloat {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.18; }
                    50%      { transform: translateY(-24px) scale(1.08); opacity: 0.28; }
                }
                @keyframes orbFloatAlt {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.14; }
                    50%      { transform: translateY(20px) scale(1.06); opacity: 0.24; }
                }
                @keyframes bookPan {
                    0%   { transform: scale(1.15) translate(0%, 0%); }
                    33%  { transform: scale(1.2)  translate(-2%, -2%); }
                    66%  { transform: scale(1.18) translate(2%, -1%); }
                    100% { transform: scale(1.15) translate(0%, 0%); }
                }
                @keyframes wordFloat {
                    0%   { transform: translateY(0px);   opacity: 0; }
                    10%  { opacity: 1; }
                    80%  { opacity: 0.85; }
                    100% { transform: translateY(-220px); opacity: 0; }
                }
                @keyframes frameBob {
                    0%, 100% { transform: translateY(0px)   rotate(1.5deg); }
                    50%      { transform: translateY(-14px) rotate(1.5deg); }
                }
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 50px rgba(99,102,241,0.35), 0 40px 80px rgba(0,0,0,0.7); }
                    50%      { box-shadow: 0 0 80px rgba(139,92,246,0.5),  0 40px 80px rgba(0,0,0,0.7); }
                }
                .hero-bg   { animation: heroPan  20s ease-in-out infinite; will-change: transform; }
                .orb-1     { animation: orbFloat  8s ease-in-out infinite; }
                .orb-2     { animation: orbFloatAlt 11s ease-in-out infinite; }
                .orb-3     { animation: orbFloat  14s ease-in-out 2s infinite; }
                .book-pan  { animation: bookPan   18s ease-in-out infinite; }
                .frame-bob { animation: frameBob  7s  ease-in-out infinite; }
                .glow-pulse { animation: glowPulse 4s ease-in-out infinite; }
                .word-1 { animation: wordFloat 5s ease-in-out 0s    infinite; }
                .word-2 { animation: wordFloat 5s ease-in-out 1s    infinite; }
                .word-3 { animation: wordFloat 5s ease-in-out 2s    infinite; }
                .word-4 { animation: wordFloat 5s ease-in-out 3s    infinite; }
                .word-5 { animation: wordFloat 5s ease-in-out 4s    infinite; }
                @keyframes bgPulse {
                    0%,100% { background-size: 200% 200%; background-position: 0% 50%; }
                    50%     { background-size: 220% 220%; background-position: 100% 50%; }
                }
                @keyframes floatOrb1 {
                    0%,100% { transform: translate(0px, 0px)   scale(1);    opacity: 0.55; }
                    33%     { transform: translate(60px,-40px) scale(1.15); opacity: 0.7; }
                    66%     { transform: translate(-40px,30px) scale(0.9);  opacity: 0.45; }
                }
                @keyframes floatOrb2 {
                    0%,100% { transform: translate(0px, 0px)   scale(1);    opacity: 0.5; }
                    33%     { transform: translate(-50px,60px) scale(1.1);  opacity: 0.65; }
                    66%     { transform: translate(70px,-30px) scale(0.95); opacity: 0.4; }
                }
                @keyframes floatOrb3 {
                    0%,100% { transform: translate(0px, 0px)   scale(1);    opacity: 0.4; }
                    50%     { transform: translate(40px, 50px) scale(1.2);  opacity: 0.6; }
                }
                .bg-orb-1 { animation: floatOrb1 18s ease-in-out infinite; }
                .bg-orb-2 { animation: floatOrb2 22s ease-in-out infinite; }
                .bg-orb-3 { animation: floatOrb3 15s ease-in-out 3s infinite; }
                @keyframes tabletBob {
                    0%, 100% { transform: translateY(0px) rotate(2deg); }
                    50%      { transform: translateY(-12px) rotate(2deg); }
                }
                .tablet-bob  { animation: tabletBob 8s ease-in-out 2s infinite; }
                /* Tablet word pills — slower 7s cycle, different offsets */
                .tab-word-1  { animation: wordFloat 7s ease-in-out 0.5s  infinite; }
                .tab-word-2  { animation: wordFloat 7s ease-in-out 2.25s infinite; }
                .tab-word-3  { animation: wordFloat 7s ease-in-out 4s    infinite; }
                .tab-word-4  { animation: wordFloat 7s ease-in-out 5.75s infinite; }

                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalContentUp {
                    from { transform: translateY(30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .modal-overlay { animation: modalFadeIn 0.3s ease-out forwards; }
                .modal-content { animation: modalContentUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

                /* ── Browse: Curtain wipe from top ── */
                @keyframes curtainReveal {
                    0%   { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateY(-20px); }
                    30%  { opacity: 1; }
                    100% { clip-path: inset(0 0 0% 0);   opacity: 1; transform: translateY(0); }
                }
                .popup-browse { animation: curtainReveal 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                /* ── Authors: 3D flip from nav ── */
                @keyframes flipIn {
                    0%   { opacity: 0; transform: perspective(800px) rotateX(-60deg) translateY(-30px) scale(0.9); }
                    60%  { opacity: 1; transform: perspective(800px) rotateX(6deg)   translateY(4px)   scale(1.01); }
                    100% { opacity: 1; transform: perspective(800px) rotateX(0deg)   translateY(0)     scale(1); }
                }
                .popup-authors { animation: flipIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; transform-origin: top center; }

                /* ── Pricing: Spotlight burst scale ── */
                @keyframes spotlightBurst {
                    0%   { opacity: 0; transform: scale(0.5);  filter: blur(12px); }
                    50%  { opacity: 1; transform: scale(1.04); filter: blur(0px); }
                    75%  { transform: scale(0.98); }
                    100% { opacity: 1; transform: scale(1);    filter: blur(0px); }
                }
                .popup-pricing { animation: spotlightBurst 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

                /* ── About: Scroll unfurl from left ── */
                @keyframes scrollUnfurl {
                    0%   { opacity: 0; transform: translateX(-60px) scaleX(0.6); border-radius: 2rem 8rem 8rem 2rem; }
                    50%  { opacity: 1; transform: translateX(6px)   scaleX(1.02); }
                    100% { opacity: 1; transform: translateX(0)     scaleX(1);    border-radius: 2rem; }
                }
                .popup-about { animation: scrollUnfurl 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; transform-origin: left center; }

                /* ── Shared: stagger child items ── */
                @keyframes itemFadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .popup-item { opacity: 0; animation: itemFadeUp 0.4s ease forwards; }
                .popup-item:nth-child(1) { animation-delay: 0.15s; }
                .popup-item:nth-child(2) { animation-delay: 0.22s; }
                .popup-item:nth-child(3) { animation-delay: 0.29s; }
                .popup-item:nth-child(4) { animation-delay: 0.36s; }
                .popup-item:nth-child(5) { animation-delay: 0.43s; }
                .popup-item:nth-child(6) { animation-delay: 0.50s; }

                /* ── Backdrop: per-modal coloured shimmer ── */
                @keyframes backdropFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .nav-backdrop { animation: backdropFadeIn 0.35s ease forwards; }

                /* ── Nav button active indicator ── */
                @keyframes navPing {
                    0%   { transform: scale(1);   opacity: 0.8; }
                    80%  { transform: scale(2.2); opacity: 0; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                .nav-ping { animation: navPing 0.6s ease-out forwards; }

                @keyframes ctaGradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .cta-bg-animate {
                    background-size: 200% 200%;
                    animation: ctaGradientMove 8s ease infinite;
                }
                @keyframes starPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.2); }
                }
                .cta-star {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                }
                .star-1 { width: 2px; height: 2px; animation: starPulse 3s infinite 0.2s; }
                .star-2 { width: 3px; height: 3px; animation: starPulse 4s infinite 1.5s; }
                .star-3 { width: 2px; height: 2px; animation: starPulse 2.5s infinite 0.8s; }

                .genre-card-container {
                    perspective: 1000px;
                }
                .genre-card-inner {
                    transition: transform 0.1s ease-out;
                    transform-style: preserve-3d;
                }
                .genre-card-container:hover .genre-card-inner {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                @keyframes genreImagePan {
                    0% { transform: scale(1); object-position: center; }
                    25% { transform: scale(1.1) translate(-1%, -1%); }
                    50% { transform: scale(1.05) translate(1%, 2%); }
                    75% { transform: scale(1.15) translate(-2%, 1%); }
                    100% { transform: scale(1) object-position: center; }
                }
                .genre-image-animate {
                    animation: genreImagePan 20s ease-in-out infinite;
                }
                .genre-image-animate-delay-1 { animation-delay: -4s; }
                .genre-image-animate-delay-2 { animation-delay: -8s; }
                .genre-image-animate-delay-3 { animation-delay: -12s; }
                .genre-image-animate-delay-4 { animation-delay: -16s; }
                .genre-image-animate-delay-5 { animation-delay: -2s; }

            `}</style>
            {/* ───── HEADER ───── */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: 72 }}>
                    <Link to="/" onClick={() => setSelectedFooterLink(null)} className="flex items-center gap-2.5 text-white">
                        <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="material-symbols-outlined text-white text-lg">auto_stories</span>
                        </div>
                        <span className="text-lg font-black tracking-tight">PlotNest</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        {([
                            { label: "Browse", id: "browse" },
                            { label: "Authors", id: "authors" },
                            { label: "Pricing", id: "pricing" },
                            { label: "About", id: "about" }
                        ] as const).map(({ label, id }) => (
                            <button
                                key={label}
                                onClick={() => setActiveModal(activeModal === id ? null : id)}
                                className={`text-[12px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${activeModal === id ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveModal('signin')} className="px-6 py-2.5 text-[12px] font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer">
                            Sign In
                        </button>
                    </div>
                </div>
            </header>

            {!selectedFooterLink ? (
                <>
                    {/* ───── HERO ───── */}
                    <section
                        className="relative min-h-screen flex items-center overflow-hidden"
                        style={{ paddingTop: 72, background: '#05050f' }}
                    >
                {/* Large drifting colour orbs — the animated background */}
                <div className="bg-orb-1 absolute" style={{
                    width: 700, height: 700,
                    top: '-15%', left: '-10%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.55) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none'
                }} />
                <div className="bg-orb-2 absolute" style={{
                    width: 600, height: 600,
                    bottom: '-10%', right: '-8%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(167,139,250,0.15) 45%, transparent 70%)',
                    filter: 'blur(90px)',
                    pointerEvents: 'none'
                }} />
                <div className="bg-orb-3 absolute" style={{
                    width: 450, height: 450,
                    top: '30%', left: '35%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(34,211,238,0.08) 50%, transparent 70%)',
                    filter: 'blur(70px)',
                    pointerEvents: 'none'
                }} />
                {/* Noise texture layer for depth */}
                <div className="absolute inset-0 opacity-[0.018]" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '180px'
                }} />
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-16 py-20">

                    {/* ── LEFT: Text ── */}
                    <div className="flex-1 text-left max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/40 bg-indigo-500/15 text-indigo-200 text-xs font-bold tracking-widest uppercase mb-8">
                            <span className="size-1.5 rounded-full bg-indigo-300 animate-pulse" />
                            The #1 Storytelling Platform
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white mb-4">
                            Where Stories<br />
                            <span style={{ background: 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #f9a8d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Come Alive
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 font-medium mb-10 leading-relaxed max-w-lg">
                            Discover thousands of stories, publish your own work, and connect with a community of passionate readers and writers on PlotNest.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <Link to="/signup">
                                <button className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-2xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-500/30 text-sm">
                                    Sign Up
                                </button>
                            </Link>
                            <Link to="/author-signup">
                                <button className="px-8 py-4 border border-white/20 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 text-sm backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-base">edit_note</span>
                                    Become an Author
                                </button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-6 text-slate-400 text-xs font-semibold">
                            {["No credit card required", "Free forever plan", "10,000+ stories"].map((t) => (
                                <span key={t} className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-indigo-400">check_circle</span>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Phone + Tablet mockups ── */}
                    <div className="flex-1 hidden lg:flex items-center justify-center gap-5" style={{ minHeight: 520 }}>

                        {/* Deep background glow */}
                        <div className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.1) 60%, transparent 100%)' }} />

                        {/* ─── TABLET ─── */}
                        <div className="flex flex-col items-center gap-3 self-center">
                            {/* Tablet silhouette indicator — landscape rect + side button */}
                            <div className="flex items-center gap-1.5 opacity-60">
                                <div className="relative" style={{ width: 44, height: 30 }}>
                                    <div style={{
                                        width: '100%', height: '100%',
                                        border: '1.5px solid rgba(167,139,250,0.7)',
                                        borderRadius: 5,
                                        boxShadow: '0 0 8px rgba(139,92,246,0.4)'
                                    }} />
                                    {/* Camera dot */}
                                    <div style={{
                                        position: 'absolute', top: '50%', left: 3,
                                        transform: 'translateY(-50%)',
                                        width: 3, height: 3, borderRadius: '50%',
                                        background: 'rgba(167,139,250,0.8)'
                                    }} />
                                    {/* Side button */}
                                    <div style={{
                                        position: 'absolute', top: '30%', right: -3,
                                        width: 3, height: 10, borderRadius: 2,
                                        background: 'rgba(167,139,250,0.7)'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ width: 3, height: 7, borderRadius: 2, background: 'rgba(167,139,250,0.5)' }} />
                                    <div style={{ width: 3, height: 7, borderRadius: 2, background: 'rgba(167,139,250,0.5)' }} />
                                </div>
                            </div>

                            <div className="tablet-bob relative rounded-[1.6rem] overflow-hidden border border-violet-500/30"
                                style={{ width: 320, height: 220, boxShadow: '0 0 50px rgba(139,92,246,0.4), 0 20px 60px rgba(0,0,0,0.7)' }}>

                                {/* Same library image + Ken Burns pan as the phone */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <img
                                        className="book-pan w-full h-full object-cover"
                                        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=700&auto=format&fit=crop&q=80"
                                        alt="Open book with bokeh lights"
                                    />
                                </div>
                                {/* Top dark fade */}
                                <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                                    style={{ background: 'linear-gradient(to bottom, rgba(9,9,15,0.9) 0%, transparent 100%)' }} />
                                {/* Bottom dark fade */}
                                <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                                    style={{ background: 'linear-gradient(to top, rgba(9,9,15,0.97) 0%, rgba(9,9,15,0.55) 60%, transparent 100%)' }} />

                                {/* Top logo badge */}
                                <div className="absolute top-2.5 left-0 right-0 flex justify-center">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-violet-400" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                                        <span className="text-white text-[9px] font-black tracking-wider">PLOTNEST</span>
                                    </div>
                                </div>

                                {/* Floating genre pills — different timing from phone (tab-word-*) */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <span className="tab-word-1 absolute bottom-14 left-4  px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm">Fantasy</span>
                                    <span className="tab-word-2 absolute bottom-14 left-20 px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/30 text-violet-200 border border-violet-400/30 backdrop-blur-sm">Adventure</span>
                                    <span className="tab-word-3 absolute bottom-14 right-4  px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-500/25  text-pink-200  border border-pink-400/30  backdrop-blur-sm">Mystery</span>
                                    <span className="tab-word-4 absolute bottom-14 right-20 px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/25  text-cyan-200  border border-cyan-400/30  backdrop-blur-sm">Thriller</span>
                                </div>

                                {/* Bottom strip */}
                                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-black text-[11px] leading-tight">Discover Your Story</p>
                                        <p className="text-slate-400 text-[9px]">120+ genres waiting for you</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="text-center">
                                            <p className="text-violet-300 font-black text-[11px]">50K+</p>
                                            <p className="text-slate-500 text-[8px]">Stories</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-pink-300 font-black text-[11px]">2M+</p>
                                            <p className="text-slate-500 text-[8px]">Readers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── PHONE ─── */}
                        <div className="flex flex-col items-center gap-2">
                            {/* Phone silhouette indicator — portrait rect + top notch */}
                            <div className="flex items-center gap-1.5 opacity-60">
                                <div className="relative" style={{ width: 20, height: 38 }}>
                                    <div style={{
                                        width: '100%', height: '100%',
                                        border: '1.5px solid rgba(129,140,248,0.7)',
                                        borderRadius: 4,
                                        boxShadow: '0 0 8px rgba(99,102,241,0.4)'
                                    }} />
                                    {/* Top notch */}
                                    <div style={{
                                        position: 'absolute', top: 0, left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 10, height: 3, borderRadius: '0 0 2px 2px',
                                        background: 'rgba(129,140,248,0.8)'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ width: 3, height: 7, borderRadius: 2, background: 'rgba(129,140,248,0.5)' }} />
                                    <div style={{ width: 3, height: 7, borderRadius: 2, background: 'rgba(129,140,248,0.5)' }} />
                                </div>
                            </div>
                            <div className="frame-bob glow-pulse relative rounded-[2.5rem] overflow-hidden border border-indigo-500/30" style={{ width: 280, height: 460 }}>

                                {/* Background image with slow Ken Burns */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <img
                                        className="book-pan w-full h-full object-cover"
                                        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80"
                                        alt="Grand library"
                                    />
                                </div>

                                {/* Top dark fade */}
                                <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
                                    style={{ background: 'linear-gradient(to bottom, rgba(9,9,15,0.85) 0%, transparent 100%)' }} />

                                {/* Bottom dark fade */}
                                <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
                                    style={{ background: 'linear-gradient(to top, rgba(9,9,15,0.97) 0%, rgba(9,9,15,0.5) 60%, transparent 100%)' }} />

                                {/* Top logo badge */}
                                <div className="absolute top-4 left-0 right-0 flex justify-center">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-indigo-400" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                                        <span className="text-white text-[10px] font-black tracking-wider">PLOTNEST</span>
                                    </div>
                                </div>

                                {/* Floating genre word bubbles — 5s cycle */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <span className="word-1 absolute bottom-32 left-6  px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm">Fantasy</span>
                                    <span className="word-2 absolute bottom-32 left-20 px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-500/30 text-violet-200 border border-violet-400/30 backdrop-blur-sm">Adventure</span>
                                    <span className="word-3 absolute bottom-32 right-6  px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/25  text-pink-200  border border-pink-400/30  backdrop-blur-sm">Mystery</span>
                                    <span className="word-4 absolute bottom-32 left-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/25  text-cyan-200  border border-cyan-400/30  backdrop-blur-sm">Thriller</span>
                                    <span className="word-5 absolute bottom-32 right-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/25 text-amber-200 border border-amber-400/30 backdrop-blur-sm">Sci-Fi</span>
                                </div>

                                {/* Bottom stats strip */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <p className="text-white font-black text-sm mb-0.5">A Universe of Stories</p>
                                    <p className="text-slate-400 text-[10px] mb-4">Every genre. Every emotion. Every world.</p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-center">
                                            <p className="text-indigo-300 font-black text-sm">50K+</p>
                                            <p className="text-slate-500 text-[9px]">Stories</p>
                                        </div>
                                        <div className="w-px h-6 bg-white/10" />
                                        <div className="text-center">
                                            <p className="text-violet-300 font-black text-sm">2M+</p>
                                            <p className="text-slate-500 text-[9px]">Readers</p>
                                        </div>
                                        <div className="w-px h-6 bg-white/10" />
                                        <div className="text-center">
                                            <p className="text-pink-300 font-black text-sm">120+</p>
                                            <p className="text-slate-500 text-[9px]">Genres</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            {/* ───── STATS STRIP ───── */}
            <section className="border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { val: "2M+", label: "Active Readers" },
                        { val: "50K+", label: "Published Stories" },
                        { val: "120+", label: "Genres & Sub-genres" },
                        { val: "98%", label: "Reader Satisfaction" },
                    ].map(({ val, label }) => (
                        <div key={label}>
                            <p className="text-4xl font-black mb-1" style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</p>
                            <p className="text-slate-400 text-sm font-medium">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── FEATURES (Authors context) ───── */}
            <section id="authors" className="py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Everything you need</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Built for readers.<br />Crafted for authors.</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Every feature designed to make your reading and writing experience extraordinary.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                onClick={() => setSelectedFeature(feature)}
                                className={`group p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-indigo-500/30 hover:-translate-y-2 active:scale-95 transition-all duration-300 cursor-pointer`}
                            >
                                <div className={`size-11 rounded-xl bg-gradient-to-br ${feature.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-500/20').replace('-600', '-600/20')} border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <span className={`material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`}>{feature.icon}</span>
                                </div>
                                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── LATEST STORIES ───── */}
            {latestStories.length > 0 && (
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Fresh from our authors</p>
                                <h2 className="text-4xl font-black tracking-tight">Latest Stories</h2>
                            </div>
                            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 transition-colors">
                                Browse all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {latestStories.map((story, idx) => (
                                <div key={idx} className="group p-6 rounded-[32px] border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all flex gap-6 items-start">
                                    <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl">
                                        {story.cover_image ? (
                                            <img src={story.cover_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={story.title} />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <span className="material-symbols-outlined text-2xl">image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-black uppercase tracking-widest">{story.genre}</span>
                                            <span className="text-slate-500 text-[10px] font-bold">{Math.ceil((story.word_count || 0) / 200)} min read</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{story.title}</h3>
                                        <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed italic">by {story.author_name}</p>
                                        <Link to="/signup">
                                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors flex items-center gap-2">
                                                Read Now
                                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ───── GENRES (Browse context) ───── */}
            <section id="browse" className="py-20 px-6 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Explore by genre</p>
                            <h2 className="text-4xl font-black tracking-tight">Find your next obsession</h2>
                        </div>
                        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 transition-colors">
                            Browse all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {GENRES.map(({ name, icon, bg }, idx) => (
                            <div
                                key={name}
                                className="genre-card-container group relative cursor-pointer aspect-[3/4]"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="genre-card-inner w-full h-full relative rounded-2xl overflow-hidden">
                                    <img 
                                        src={bg} 
                                        alt={name} 
                                        className={`w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 genre-image-animate genre-image-animate-delay-${idx % 6}`} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <span className="material-symbols-outlined text-white text-xl mb-1 block">{icon}</span>
                                        <p className="text-white font-bold text-sm">{name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── HOW IT WORKS (About context) ───── */}
            <section id="about" className="py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Simple by design</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">Get started in minutes</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* connecting line */}
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" style={{ left: "18%", right: "18%" }} />

                        {STEPS.map(({ num, title, desc }) => (
                            <div key={num} className="flex flex-col items-center text-center">
                                <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
                                    <span className="text-2xl font-black text-indigo-400">{num}</span>
                                </div>
                                <h3 className="font-bold text-white text-lg mb-3">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── TESTIMONIALS ───── */}
            < section className="py-20 px-6 bg-white/[0.01] border-y border-white/5" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Loved by readers & authors</p>
                        <h2 className="text-4xl font-black tracking-tight">What our community says</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map(({ quote, name, handle, avatar }) => (
                            <div key={name} className="p-6 rounded-2xl border border-white/5 bg-white/[0.04] flex flex-col gap-4">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed flex-1">"{quote}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`} alt={name} className="size-9 rounded-full bg-indigo-900" />
                                    <div>
                                        <p className="text-white font-semibold text-sm">{name}</p>
                                        <p className="text-slate-500 text-xs">{handle}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── PRICING ───── */}
            <section id="pricing" className="py-28 px-6 bg-[#09090f]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Choose your journey</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Pricing that fits you</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Experience stories like never before with our flexible plans designed for every type of reader.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Free",
                                price: "$0",
                                period: "/month",
                                features: ["Standard reading experience", "Ad-supported", "Limited offline reading", "Follow up to 5 authors"]
                            },
                            {
                                name: "Premium",
                                price: "$9.99",
                                period: "/month",
                                featured: true,
                                features: ["Ad-free experience", "Unlimited offline reading", "Exclusive early access", "Custom reader themes", "Support your favorite authors"]
                            },
                            {
                                name: "Duo",
                                price: "$14.99",
                                period: "/month",
                                features: ["All Premium features", "2 separate accounts", "Curated shared library", "Save up to 30%"]
                            },
                        ].map((plan) => (
                            <div key={plan.name} className={`relative p-8 rounded-3xl border ${plan.featured ? 'border-indigo-500 bg-indigo-500/5 shadow-2xl shadow-indigo-500/10' : 'border-white/5 bg-white/[0.02]'} transition-all hover:translate-y-[-4px]`}>
                                {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</div>}
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black text-white">{plan.price}</span>
                                    <span className="text-slate-500 text-sm">{plan.period}</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-start gap-2 text-slate-400 text-sm leading-tight">
                                            <span className="material-symbols-outlined text-indigo-400 text-base" style={{ fontVariationSettings: "'wght' 700" }}>check_circle</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.featured ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ───── FINAL CTA STRIP ───── */}
            <section className="relative py-28 px-6 bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#1e1b4b] cta-bg-animate overflow-hidden">
                {/* Starfield effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="cta-star star-1 top-1/4 left-1/4 opacity-40 shadow-[0_0_8px_white]" />
                    <div className="cta-star star-2 top-1/3 left-1/2 opacity-60 shadow-[0_0_10px_white]" />
                    <div className="cta-star star-3 top-3/4 left-1/3 opacity-30 shadow-[0_0_5px_white]" />
                    <div className="cta-star star-1 top-2/3 left-[80%] opacity-50 shadow-[0_0_8px_white]" />
                    <div className="cta-star star-2 top-[15%] left-[70%] opacity-40 shadow-[0_0_10px_white]" />
                    <div className="cta-star star-3 top-1/2 left-[10%] opacity-20 shadow-[0_0_5px_white]" />
                    <div className="cta-star star-1 bottom-[10%] right-[15%] opacity-60 shadow-[0_0_8px_white]" />
                    <div className="cta-star star-2 top-[40%] right-[5%] opacity-30 shadow-[0_0_10px_white]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white leading-tight">Ready to dive in?</h2>
                    <p className="text-indigo-100/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">Join 2 million readers on PlotNest today and find your next obsession in a world of infinite stories.</p>
                    <Link to="/signup">
                        <button className="px-14 py-4.5 bg-white text-indigo-900 font-bold rounded-2xl hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all shadow-2xl text-base tracking-wide active:scale-95">
                            Create Your Free Account
                        </button>
                    </Link>
                </div>
                    </section>
                </>
            ) : (
                <section className="relative min-h-screen flex flex-col items-center justify-center px-6" style={{ paddingTop: 72, paddingBottom: 72, background: '#05050f' }}>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="bg-orb-1 absolute" style={{ width: 700, height: 700, top: '-15%', left: '-10%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                    </div>
                    <div className="relative z-10 max-w-5xl mx-auto w-full py-10">
                        {(() => {
                            const content = FOOTER_CONTENT[selectedFooterLink] || {
                                title: selectedFooterLink,
                                subtitle: "Information coming soon",
                                description: "We are currently updating this section. Please check back later.",
                                highlights: [],
                                ctaText: "Back to Home",
                                ctaLink: "/"
                            };
                            return (
                                <div className="flex flex-col items-center text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/40 bg-indigo-500/15 text-indigo-200 text-xs font-bold tracking-widest uppercase mb-6">
                                        <span className="size-1.5 rounded-full bg-indigo-300 animate-pulse" />
                                        {content.subtitle}
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">{content.title}</h1>
                                    <p className="text-xl text-slate-300 leading-relaxed mb-16 max-w-3xl mx-auto font-medium">
                                        {content.description}
                                    </p>

                                    {content.highlights && content.highlights.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
                                            {content.highlights.map((highlight, idx) => (
                                                <div key={idx} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:-translate-y-2 text-left group">
                                                    <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-indigo-400 text-3xl">{highlight.icon}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-3">{highlight.title}</h3>
                                                    <p className="text-slate-400 text-sm leading-relaxed">{highlight.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center justify-center gap-4">
                                        <Link to={content.ctaLink}>
                                            <button 
                                                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-2 hover:-translate-y-1"
                                                onClick={() => { if(content.ctaLink === "/" || content.ctaLink.startsWith("/#")) setSelectedFooterLink(null); }}
                                            >
                                                {content.ctaText}
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => setSelectedFooterLink(null)}
                                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2 hover:-translate-y-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                            Return to Homepage
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </section>
            )}

            {/* ───── FOOTER ───── */}
            <footer className="border-t border-white/5 bg-[#09090f]">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">

                        {/* Brand */}
                        <div className="col-span-2">
                            <Link to="/" className="flex items-center gap-2.5 mb-4">
                                <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-lg">auto_stories</span>
                                </div>
                                <span className="text-lg font-black tracking-tight">PlotNest</span>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                                The world's most immersive storytelling platform for readers and authors alike.
                            </p>
                        </div>

                        {/* Links */}
                        {[
                            { heading: "Product", links: ["Browse Stories", "Authors", "Book Clubs", "Pricing", "Mobile App"] },
                            { heading: "Company", links: ["About Us", "Blog", "Careers", "Press", "Contact"] },
                            { heading: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "DMCA"] },
                        ].map(({ heading, links }) => (
                            <div key={heading}>
                                <h4 className="text-white font-bold text-sm mb-5">{heading}</h4>
                                <ul className="space-y-3">
                                    {links.map((l) => (
                                        <li key={l}><a onClick={() => { setSelectedFooterLink(l); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-500 text-sm hover:text-slate-300 transition-colors cursor-pointer">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-600 text-xs">© 2026 PlotNest. All rights reserved.</p>
                        <p className="text-slate-600 text-xs flex items-center gap-1">
                            Made with <span className="material-symbols-outlined text-rose-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> for storytellers everywhere
                        </p>
                    </div>
                </div>
            </footer>

            {/* ───── FEATURE MODAL ───── */}
            {selectedFeature && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-6 modal-overlay"
                    style={{ backgroundColor: 'rgba(5, 5, 15, 0.85)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setSelectedFeature(null)}
                >
                    <div
                        className="relative w-full max-w-2xl bg-[#09090f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header/Glow */}
                        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${selectedFeature.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-500/10').replace('-600', 'transparent')} to-transparent pointer-events-none`} />

                        <div className="relative p-8 md:p-12">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="absolute top-6 right-6 size-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>

                            <div className={`size-16 rounded-2xl bg-gradient-to-br ${selectedFeature.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-500/20').replace('-600', '-600/20')} border border-white/10 flex items-center justify-center mb-8`}>
                                <span className={`material-symbols-outlined text-3xl text-transparent bg-clip-text bg-gradient-to-br ${selectedFeature.color}`}>{selectedFeature.icon}</span>
                            </div>

                            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{selectedFeature.title}</h2>
                            <p className={`text-lg opacity-80 font-medium mb-6 leading-relaxed text-transparent bg-clip-text bg-gradient-to-br ${selectedFeature.color}`}>
                                {selectedFeature.desc}
                            </p>

                            <div className="h-px w-full bg-white/5 mb-6" />

                            <p className="text-slate-400 leading-relaxed mb-10">
                                {selectedFeature.longDesc}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signup" className="flex-1">
                                    <button className={`w-full py-4 bg-gradient-to-r ${selectedFeature.color} text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20`}>
                                        Experience Now
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="flex-1 py-4 border border-white/10 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ───── NAV MODALS ───── */}
            {activeModal && (() => {
                const backdropColors: Record<string, string> = {
                    browse: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.18) 0%, rgba(0,0,0,0.72) 60%)',
                    authors: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0.72) 60%)',
                    pricing: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, rgba(0,0,0,0.72) 60%)',
                    about: 'radial-gradient(ellipse at 0%  50%, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0.72) 60%)',
                    signin: 'radial-gradient(ellipse at 100% 0%, rgba(99,102,241,0.18) 0%, rgba(0,0,0,0.72) 60%)',
                };
                const popupClass: Record<string, string> = {
                    browse: 'popup-browse',
                    authors: 'popup-authors',
                    pricing: 'popup-pricing',
                    about: 'popup-about',
                    signin: 'popup-browse',
                };
                const borderColors: Record<string, string> = {
                    browse: 'rgba(99,102,241,0.25)',
                    authors: 'rgba(16,185,129,0.25)',
                    pricing: 'rgba(139,92,246,0.25)',
                    about: 'rgba(236,72,153,0.25)',
                    signin: 'rgba(99,102,241,0.25)',
                };
                return (
                    <div
                        className="nav-backdrop fixed inset-0 z-[200] flex items-start justify-center pt-[80px] px-4"
                        style={{ background: backdropColors[activeModal], backdropFilter: 'blur(8px)' }}
                        onClick={() => setActiveModal(null)}
                    >
                        <div
                            className={`${popupClass[activeModal]} relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[2rem] border shadow-2xl`}
                            style={{
                                background: 'linear-gradient(145deg,#0d0d20 0%,#10102a 55%,#0f0f1e 100%)',
                                boxShadow: `0 50px 120px rgba(0,0,0,0.8), 0 0 0 1px ${borderColors[activeModal]}`,
                                borderColor: borderColors[activeModal],
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative top glow strip per modal */}
                            {activeModal === 'browse' && <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)' }} />}
                            {activeModal === 'authors' && <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]" style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #10b981)' }} />}
                            {activeModal === 'pricing' && <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)' }} />}
                            {activeModal === 'about' && <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]" style={{ background: 'linear-gradient(90deg, #ec4899, #f43f5e, #ec4899)' }} />}

                            {/* Close button */}
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute top-5 right-5 z-10 size-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>

                            {/* ── BROWSE MODAL ── */}
                            {activeModal === 'browse' && (
                                <div className="p-8">
                                    <div className="mb-8 popup-item">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-indigo-400" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>explore</span>
                                            </div>
                                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Explore by genre</p>
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-white">Find your next obsession</h2>
                                        <p className="text-slate-400 text-sm mt-2">Choose a genre and dive into thousands of hand-crafted stories waiting for you.</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {GENRES.map(({ name, icon, bg, color }, idx) => (
                                            <div
                                                key={name}
                                                className="popup-item genre-card-container group relative cursor-pointer aspect-[3/2] ring-1 ring-white/5 hover:ring-indigo-500/40 transition-all hover:-translate-y-1"
                                                onClick={() => setActiveModal(null)}
                                                onMouseMove={handleMouseMove}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className="genre-card-inner w-full h-full relative rounded-2xl overflow-hidden">
                                                    <img 
                                                        src={bg} 
                                                        alt={name} 
                                                        className={`w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 genre-image-animate genre-image-animate-delay-${(idx + 3) % 6}`} 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.45), rgba(139,92,246,0.25))` }} />
                                                    <div className="absolute bottom-0 left-0 p-4 flex items-center gap-2">
                                                        <span className={`material-symbols-outlined text-xl bg-gradient-to-br ${color} text-transparent bg-clip-text`}>{icon}</span>
                                                        <p className="text-white font-bold">{name}</p>
                                                    </div>
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-white/70 text-sm">arrow_forward</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="popup-item mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <p className="text-slate-500 text-sm">50,000+ stories across 120+ genres</p>
                                        <Link to="/signup" onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-bold rounded-xl hover:opacity-90 hover:scale-[1.03] transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                                            Sign Up Page
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* ── AUTHORS MODAL ── */}
                            {activeModal === 'authors' && (
                                <div className="p-8">
                                    <div className="mb-8 popup-item">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                                            </div>
                                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">For writers &amp; creators</p>
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-white">Built for authors</h2>
                                        <p className="text-slate-400 text-sm mt-2">Everything you need to write, publish, and grow your audience on PlotNest.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {FEATURES.map((feature) => (
                                            <div
                                                key={feature.title}
                                                onClick={() => { setSelectedFeature(feature); setActiveModal(null); }}
                                                className="popup-item group flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all cursor-pointer"
                                            >
                                                <div className={`size-11 flex-shrink-0 rounded-xl bg-gradient-to-br ${feature.color.replace('-500', '-500/20').replace('-600', '-600/20')} border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                    <span className={`material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`}>{feature.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white mb-1 text-sm">{feature.title}</h3>
                                                    <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
                                                </div>
                                                <span className="material-symbols-outlined text-slate-600 group-hover:text-emerald-400 text-sm transition-colors self-center">arrow_forward_ios</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="popup-item mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <p className="text-slate-500 text-sm">Join 10,000+ authors publishing today</p>
                                        <Link to="/author-login" onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-xl hover:opacity-90 hover:scale-[1.03] transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2">
                                            Start Writing
                                            <span className="material-symbols-outlined text-sm">edit_note</span>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* ── PRICING MODAL ── */}
                            {activeModal === 'pricing' && (
                                <div className="p-8">
                                    {/* Spotlight burst glow behind content */}
                                    <div className="absolute inset-0 rounded-[2rem] pointer-events-none overflow-hidden">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
                                    </div>
                                    <div className="mb-8 text-center popup-item">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="size-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-violet-400" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                            </div>
                                            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest">Choose your journey</p>
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-white">Pricing that fits you</h2>
                                        <p className="text-slate-400 text-sm mt-2">Flexible plans designed for every type of reader.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { name: 'Free', price: '$0', period: '/month', color: 'from-slate-500 to-slate-700', features: ['Standard reading experience', 'Ad-supported', 'Limited offline reading', 'Follow up to 5 authors'] },
                                            { name: 'Premium', price: '$9.99', period: '/month', color: 'from-indigo-500 to-violet-600', featured: true, features: ['Ad-free experience', 'Unlimited offline reading', 'Exclusive early access', 'Custom reader themes', 'Support your favorite authors'] },
                                            { name: 'Duo', price: '$14.99', period: '/month', color: 'from-pink-500 to-rose-600', features: ['All Premium features', '2 separate accounts', 'Curated shared library', 'Save up to 30%'] },
                                        ].map((plan: any) => (
                                            <div key={plan.name} className={`popup-item relative flex flex-col p-6 rounded-2xl border transition-all hover:-translate-y-1 ${plan.featured ? 'border-indigo-500/60 bg-indigo-500/5 shadow-xl shadow-indigo-500/10' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}>
                                                {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Most Popular</div>}
                                                <div className={`size-10 mb-4 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                                                    <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                                                <div className="flex items-baseline gap-1 mb-4">
                                                    <span className="text-3xl font-black text-white">{plan.price}</span>
                                                    <span className="text-slate-500 text-xs">{plan.period}</span>
                                                </div>
                                                <ul className="space-y-2 mb-6 flex-1">
                                                    {plan.features.map((f: string) => (
                                                        <li key={f} className="flex items-start gap-2 text-slate-400 text-xs leading-tight">
                                                            <span className="material-symbols-outlined text-indigo-400 text-sm" style={{ fontVariationSettings: "'wght' 700" }}>check_circle</span>
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button onClick={() => setActiveModal(null)} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.featured ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg hover:opacity-90 hover:scale-[1.02]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                                                    Get Started
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="popup-item text-center text-slate-600 text-xs mt-6">No credit card required for Free plan &bull; Cancel anytime</p>
                                </div>
                            )}

                            {/* ── ABOUT MODAL ── */}
                            {activeModal === 'about' && (
                                <div className="p-8">
                                    {/* Scroll-unfurl left glow accent */}
                                    <div className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-[2rem]" style={{ background: 'linear-gradient(to bottom, #ec4899, #f43f5e, #ec4899)' }} />
                                    <div className="mb-8 popup-item">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-pink-400" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>info</span>
                                            </div>
                                            <p className="text-pink-400 text-xs font-bold uppercase tracking-widest">Our story</p>
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-white">About PlotNest</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            <div className="popup-item p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:border-pink-500/20 transition-colors">
                                                <span className="material-symbols-outlined text-indigo-400 text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                                                <h3 className="text-white font-bold mb-2">Our Mission</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">PlotNest exists to bridge readers and writers in one seamless platform. We believe every story deserves to be heard — whether you're a debut author or a seasoned bestseller.</p>
                                            </div>
                                            <div className="popup-item p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:border-pink-500/20 transition-colors">
                                                <span className="material-symbols-outlined text-violet-400 text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                                                <h3 className="text-white font-bold mb-2">Our Community</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">With 2 million+ active readers across 120+ genres, PlotNest is home to one of the most passionate literary communities on the internet. Every story, every comment, every follow — it all matters.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="popup-item p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:border-pink-500/20 transition-colors">
                                                <span className="material-symbols-outlined text-emerald-400 text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                                                <h3 className="text-white font-bold mb-2">For Authors</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">Writers get a distraction-free editor, detailed analytics, chapter scheduling, and a real audience from day one. No gatekeeping, no middlemen — just your words and your readers.</p>
                                            </div>
                                            <div className="popup-item grid grid-cols-2 gap-4">
                                                {[{ val: '2M+', label: 'Active Readers', icon: 'person', color: 'text-indigo-400' }, { val: '50K+', label: 'Stories Published', icon: 'book', color: 'text-violet-400' }, { val: '120+', label: 'Genres', icon: 'category', color: 'text-pink-400' }, { val: '98%', label: 'Satisfaction', icon: 'thumb_up', color: 'text-emerald-400' }].map(s => (
                                                    <div key={s.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.03] text-center hover:border-pink-500/20 transition-colors">
                                                        <span className={`material-symbols-outlined ${s.color} text-xl mb-1 block`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                                                        <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                                                        <p className="text-slate-500 text-xs">{s.label}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="popup-item mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
                                        <p className="text-slate-500 text-sm">Simple by design. Powerful by nature.</p>
                                        <div className="flex gap-3">
                                            {STEPS.map(step => (
                                                <div key={step.num} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.03] hover:border-pink-500/20 transition-colors">
                                                    <span className="text-pink-400 font-black text-sm">{step.num}</span>
                                                    <p className="text-white text-xs font-medium">{step.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── SIGNIN MODAL ── */}
                            {activeModal === 'signin' && (
                                <div className="p-8">
                                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)' }} />
                                    <div className="mb-8 popup-item text-center">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="size-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-indigo-400" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>login</span>
                                            </div>
                                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Welcome Back</p>
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-white">Choose your portal</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Link to="/login" onClick={() => setActiveModal(null)} className="popup-item group flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-indigo-500/30 hover:-translate-y-1 transition-all cursor-pointer">
                                            <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-indigo-400 text-3xl">menu_book</span>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-white mb-2 text-lg">Reader Sign In</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">Access your library, reading clubs, and saved stories.</p>
                                            </div>
                                        </Link>
                                        <Link to="/author-login" onClick={() => setActiveModal(null)} className="popup-item group flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-emerald-500/30 hover:-translate-y-1 transition-all cursor-pointer">
                                            <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-emerald-400 text-3xl">edit_note</span>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-white mb-2 text-lg">Author Sign In</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">Access your dashboard, analytics, and drafting tools.</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
