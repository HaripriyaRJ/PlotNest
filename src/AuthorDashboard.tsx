import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const COVER_SIZES = [
    { label: 'Book Cover (Print)', value: '1800x2700', dpi: 300, aspect: '2/3' },
    { label: 'eBook Cover', value: '1600x2560', dpi: '72-300', aspect: '5/8' },
    { label: 'Magazine Cover', value: '2480x3508', dpi: 300, aspect: '1/1.414' },
    { label: 'Blog Article', value: '1280x720', dpi: 72, aspect: '16/9' },
    { label: 'Website Banner', value: '1920x600', dpi: 72, aspect: '3.2/1' },
    { label: 'Story App Cover', value: '1080x1350', dpi: 72, aspect: '4/5' },
];

const AuthorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('dashboard');
    const [activeRightPanel, setActiveRightPanel] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [storyTitle, setStoryTitle] = useState('');
    const [storyDescription, setStoryDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState(0);
    const [stories, setStories] = useState<any[]>([]);
    const [selectedCoverSize, setSelectedCoverSize] = useState('Story App Cover');
    const [selectedStory, setSelectedStory] = useState<any>(null);
    const [previousView, setPreviousView] = useState('dashboard');
    const [visibility, setVisibility] = useState('Public');
    const [enableComments, setEnableComments] = useState(true);
    const [matureContent, setMatureContent] = useState(false);
    const [allowDownloads, setAllowDownloads] = useState(false);
    const [publishDate, setPublishDate] = useState('');
    const [showAiPanel, setShowAiPanel] = useState(false);
    const [aiHint, setAiHint] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiPreview, setAiPreview] = useState('');
    const [aiFullStory, setAiFullStory] = useState('');
    const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [authorName, setAuthorName] = useState(localStorage.getItem('author_name') || 'Author Name');
    const [authorEmail, setAuthorEmail] = useState(localStorage.getItem('author_email') || 'author@example.com');
    const [authorBio, setAuthorBio] = useState(localStorage.getItem('author_bio') || '');
    const [savedAuthorName, setSavedAuthorName] = useState(localStorage.getItem('author_name') || 'Author Name');
    const [settingsNotifications, setSettingsNotifications] = useState(true);
    const [settingsIncomeAnalytics, setSettingsIncomeAnalytics] = useState(true);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isOpeningStory, setIsOpeningStory] = useState(false);

    const passwordRules = [
        { label: 'At least 8 characters', ok: newPassword.length >= 8 },
        { label: 'One uppercase letter (A-Z)', ok: /[A-Z]/.test(newPassword) },
        { label: 'One lowercase letter (a-z)', ok: /[a-z]/.test(newPassword) },
        { label: 'One number (0-9)', ok: /[0-9]/.test(newPassword) },
        { label: 'One special character (!@#$...)', ok: /[^A-Za-z0-9]/.test(newPassword) },
    ];

    const handleChangePassword = () => {
        setPasswordError(''); setPasswordSuccess(false);
        const storedPassword = localStorage.getItem('author_password') || '123456';
        if (!currentPassword) { setPasswordError('Please enter your current password.'); return; }
        if (currentPassword !== storedPassword) { setPasswordError('Current password is incorrect.'); return; }
        if (passwordRules.filter(r => !r.ok).length > 0) { setPasswordError('Password does not meet requirements.'); return; }
        if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
        
        localStorage.setItem('author_password', newPassword);
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setPasswordSuccess(true);
    };

    const handleSaveChanges = async () => {
        const oldName = savedAuthorName; const newName = authorName;
        if (oldName !== newName && oldName !== 'Author Name') {
            try {
                await fetch(`${API_URL}/author/update-name`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ old_name: oldName, new_name: newName })
                });
            } catch (err) { console.error('Failed to sync author name:', err); }
        }
        localStorage.setItem('author_name', newName);
        localStorage.setItem('author_email', authorEmail);
        localStorage.setItem('author_bio', authorBio);
        setSavedAuthorName(newName);
        alert('Changes saved successfully!');
    };

    const handleLogout = () => { navigate('/author-login'); };

    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const aiPreviewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(`${API_URL}/stories/author/${savedAuthorName}`);
                if (response.ok) {
                    const data = await response.json();
                    setStories(data.map((s: any) => ({
                        ...s, coverImage: s.cover_image, author: s.author_name,
                        wordCount: s.word_count, tags: typeof s.tags === 'string' ? JSON.parse(s.tags) : s.tags
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch stories:', err);
                const saved = localStorage.getItem('author_stories');
                if (saved) setStories(JSON.parse(saved));
            }
        };
        fetchStories();
        const draft = localStorage.getItem('story_draft');
        if (draft) {
            const parsed = JSON.parse(draft);
            setStoryTitle(parsed.title || '');
            setStoryDescription(parsed.description || '');
            setGenre(parsed.genre || '');
            setTags(parsed.tags || []);
            setCoverImage(parsed.coverImage || null);
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.innerHTML = parsed.content || '';
                    const text = editorRef.current.innerText || '';
                    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
                }
            }, 0);
        }
    }, [savedAuthorName]);

    useEffect(() => {
        const existing = localStorage.getItem('story_draft');
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem('story_draft', JSON.stringify({ ...parsed, title: storyTitle, description: storyDescription, genre, tags, coverImage, updatedAt: new Date().toISOString() }));
    }, [storyTitle, storyDescription, genre, tags, coverImage]);

    const persistEditorContent = () => {
        const existing = localStorage.getItem('story_draft');
        const parsed = existing ? JSON.parse(existing) : {};
        parsed.content = editorRef.current?.innerHTML || '';
        parsed.updatedAt = new Date().toISOString();
        localStorage.setItem('story_draft', JSON.stringify(parsed));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { const reader = new FileReader(); reader.onloadend = () => setCoverImage(reader.result as string); reader.readAsDataURL(file); }
    };

    const handleEditorInput = () => {
        const text = editorRef.current?.innerText || '';
        setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
        persistEditorContent();
    };

    const execCommand = (command: string, value?: string) => { document.execCommand(command, false, value); editorRef.current?.focus(); };

    const refreshStories = async () => {
        const res = await fetch(`${API_URL}/stories/author/${savedAuthorName}`);
        if (res.ok) {
            const data = await res.json();
            setStories(data.map((s: any) => ({ ...s, coverImage: s.cover_image, author: s.author_name, wordCount: s.word_count, tags: typeof s.tags === 'string' ? JSON.parse(s.tags) : s.tags })));
        }
    };

    const saveDraft = async () => {
        const existingDraft = localStorage.getItem('story_draft');
        const parsedDraft = existingDraft ? JSON.parse(existingDraft) : {};
        const draftData = { id: parsedDraft.id, author_name: savedAuthorName, title: storyTitle || 'Untitled Draft', description: storyDescription, genre, tags, cover_image: coverImage, content: editorRef.current?.innerHTML || '', status: 'Draft', word_count: wordCount };
        try {
            const response = await fetch(`${API_URL}/stories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draftData) });
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('story_draft', JSON.stringify({ ...draftData, id: result.id, coverImage, wordCount, updatedAt: new Date().toISOString() }));
                await refreshStories();
                alert('Draft saved successfully!');
            } else { const e = await response.json(); alert(`Failed to save draft: ${e.error || response.statusText}`); }
        } catch (err) { console.error('Failed to save draft:', err); alert('Failed to save to cloud. Saving locally.'); }
    };

    const handlePublish = async () => {
        if (!storyTitle || !genre) { alert('Please provide a title and genre.'); return; }
        const existingDraft = localStorage.getItem('story_draft');
        const parsedDraft = existingDraft ? JSON.parse(existingDraft) : {};
        const publishData = { id: parsedDraft.id, author_name: savedAuthorName, title: storyTitle, description: storyDescription, genre, tags, cover_image: coverImage, content: editorRef.current?.innerHTML, status: 'Published', word_count: wordCount };
        try {
            const response = await fetch(`${API_URL}/stories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(publishData) });
            if (response.ok) {
                await refreshStories();
                alert('Story published successfully!');
                localStorage.setItem('plotnest_story_published', Date.now().toString());
                setActiveView('my-stories');
                setStoryTitle(''); setStoryDescription(''); setGenre(''); setTags([]); setCoverImage(null);
                if (editorRef.current) editorRef.current.innerHTML = '';
                setWordCount(0); localStorage.removeItem('story_draft');
            } else { const e = await response.json(); alert(`Failed to publish: ${e.error || response.statusText}`); }
        } catch (err: any) { alert(`Failed to publish. ${err.message || 'Check your connection.'}`); }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this story?')) {
            try { await fetch(`${API_URL}/stories/${id}`, { method: 'DELETE' }); } catch (err) { console.error('Delete failed:', err); }
            setStories(stories.filter(s => s.id !== id));
        }
    };

    const loadStoryIntoEditor = (story: any) => {
        setStoryTitle(story.title || ''); setStoryDescription(story.description || '');
        setGenre(story.genre || ''); setTags(story.tags || []);
        setCoverImage(story.coverImage || null); setWordCount(story.wordCount || 0);
        localStorage.setItem('story_draft', JSON.stringify({ id: story.id, title: story.title, description: story.description, genre: story.genre, tags: story.tags, coverImage: story.coverImage, content: story.content, updatedAt: new Date().toISOString() }));
        setActiveView('new-story');
        setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = story.content || ''; }, 0);
    };

    const startOpeningStory = async (story: any) => {
        setPreviousView(activeView);
        setSelectedStory(story);
        setIsOpeningStory(true);
        setActiveView('reading'); // Switch instantly to hide dashboard elements

        // Record a read event when viewed
        try {
            fetch(`${API_URL}/stories/${story.id}/read`, { method: 'POST' });
        } catch (err) {
            console.error('Failed to record read:', err);
        }

        // Delay to allow animation to play before removing overlay (0.8s open + 1s zoom)
        setTimeout(() => {
            setIsOpeningStory(false);
        }, 1800);
    };

    const handleStoryClick = async (story: any) => {
        if (story.status === 'Published') {
            startOpeningStory(story);
        } else { 
            loadStoryIntoEditor(story); 
        }
    };

    const handleLiveClick = (e: React.MouseEvent, story: any) => {
        e.preventDefault();
        e.stopPropagation();
        startOpeningStory(story);
    };

    const generateStory = async () => {

        if (!aiHint.trim()) {
            setAiError("Please enter a story hint.");
            return;
        }

        setAiLoading(true);
        setAiError("");
        setAiPreview("");
        setAiFullStory("");

        try {

            const response = await fetch(`${API_URL}/generate-story`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: aiHint,
                    apiKey: geminiApiKey // Send the user-provided key
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Story generation failed");
            }

            setAiFullStory(data.story);
            setAiPreview(data.story); // Removed 500 character truncation

            // Auto-scroll to preview
            setTimeout(() => {
                aiPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        } catch (err: any) {
            setAiError(err.message || "Failed to generate story.");
        } finally {
            setAiLoading(false);
        }

    };

    const downloadAiStory = () => {
        if (!aiFullStory) return;
        const plainText = aiFullStory.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();
        const blob = new Blob([plainText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PlotNest_AI_Story_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const insertAiStory = () => {
        if (!aiFullStory || !editorRef.current) return;
        editorRef.current.innerHTML = aiFullStory; handleEditorInput();
        if (!storyTitle && aiHint.trim()) setStoryTitle(aiHint.trim().substring(0, 80));
        if (!storyDescription && aiFullStory) { const plain = aiFullStory.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); setStoryDescription(plain.substring(0, 200)); }
        setShowAiPanel(false); setAiPreview(''); setAiFullStory(''); setAiHint('');
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
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_4s_infinite]"></div>
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

    if (activeView === 'reading' && selectedStory) {
        return (
            <>
                <ReadingView story={selectedStory} onBack={() => { setActiveView(previousView); setSelectedStory(null); }} />
                {renderOpeningOverlay()}
            </>
        );
    }

    return (
        <div className="flex h-screen font-roboto overflow-hidden bg-[#f1f5f9] text-slate-900 light-theme">
            {renderOpeningOverlay()}
            {/* LEFT SIDEBAR */}
            <aside className="w-72 bg-[#0f172a] flex flex-col z-50 shadow-2xl relative">
                {/* Sidebar Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

                <div className="p-8 pb-10 flex items-center gap-3 relative">
                    <div className="size-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="material-symbols-outlined text-white text-xl font-bold">auto_stories</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tighter leading-none">PlotNest</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Author Portal</p>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar relative font-roboto">
                    <NavItem icon="grid_view" label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                    <NavItem icon="menu_book" label="My Stories" active={activeView === 'my-stories'} onClick={() => setActiveView('my-stories')} />
                    <NavItem icon="show_chart" label="Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
                    <NavItem icon="work" label="Earnings" active={activeView === 'earnings'} onClick={() => setActiveView('earnings')} />
                    <NavItem icon="notifications" label="Notifications" active={activeView === 'notifications'} onClick={() => setActiveView('notifications')} />
                    <NavItem icon="settings" label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
                </div>

                <div className="p-4 mt-auto relative">
                    <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10 backdrop-blur-sm group hover:bg-white/[0.08] transition-all cursor-pointer">
                        <div className="size-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/10">
                            {savedAuthorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white leading-none truncate">{savedAuthorName}</p>
                            <p className="text-[10px] text-indigo-400 font-bold mt-1.5 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">star</span>Pro Writer
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-500 text-lg group-hover:text-indigo-400 transition-colors">more_vert</span>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#f1f5f9] relative z-10">
                {/* Removed white sticky header */}

                {activeView === 'new-story' ? (
                    <div className="flex-1 flex overflow-hidden relative font-roboto text-slate-900">
                        <div className="flex-1 overflow-y-auto custom-scrollbar font-roboto pb-16">
                            <div className="w-full px-12 pt-2 pb-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-roboto">New Story</h1>
                                        <p className="text-slate-400 font-medium italic text-sm">Start writing your masterpiece...</p>
                                    </div>
                                    <div className="flex items-center gap-4 px-2 py-1 bg-transparent text-slate-500 font-bold text-xs uppercase tracking-widest">
                                        <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                                            <span className="material-symbols-outlined text-sm text-indigo-500/70">sticky_note_2</span>
                                            <span className="text-slate-700">{wordCount} Words</span>
                                        </div>
                                        <div className="flex items-center gap-2 border-r border-slate-200 pr-4 pl-4">
                                            <span className="material-symbols-outlined text-sm text-indigo-500/70">schedule</span>
                                            <span className="text-slate-700">{Math.ceil(wordCount / 200)} Min Read</span>
                                        </div>
                                        <div className="flex items-center gap-2 pl-4 text-emerald-600">
                                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span className="text-[10px] font-black">Autosaved</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex flex-col md:flex-row items-start gap-12">
                                        <div className="w-full md:w-[380px] flex-shrink-0 space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-black font-roboto uppercase tracking-[0.2em]">Cover Format</h3>
                                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                                    <p className="text-[10px] font-black text-black font-roboto uppercase tracking-widest mb-3">Resolution & DPI</p>
                                                    <select value={selectedCoverSize} onChange={(e) => setSelectedCoverSize(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none">
                                                        {COVER_SIZES.map(s => (<option key={s.label} value={s.label}>{s.label} ({s.value.replace('x', 'Ã—')} px)</option>))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full space-y-4">
                                            <h3 className="text-[10px] font-black text-black font-roboto uppercase tracking-[0.2em]">Live Preview</h3>
                                            <div className="bg-slate-100 rounded-[32px] border-2 border-dashed border-slate-300 p-8 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden"
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{ aspectRatio: COVER_SIZES.find(s => s.label === selectedCoverSize)?.aspect || '4/5', width: 'auto', maxWidth: '100%', maxHeight: 'calc(100vh - 320px)' }}>
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                {coverImage ? (<img src={coverImage} className="absolute inset-0 w-full h-full object-cover" style={{ maxHeight: '100%' }} alt="Cover" />) : (
                                                    <div className="flex flex-col items-center gap-4 text-center">
                                                        <span className="material-symbols-outlined text-3xl text-slate-300">image</span>
                                                        <p className="text-slate-400 font-bold">Upload Cover Image</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-black font-roboto uppercase tracking-[0.2em] px-1">Story Title</label>
                                                <input type="text" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} placeholder="Enter your story title..." className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-400 text-lg font-bold text-slate-900 placeholder:text-slate-400" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-black font-roboto uppercase tracking-[0.2em] px-1">Story Description</label>
                                                <textarea value={storyDescription} onChange={(e) => setStoryDescription(e.target.value)} placeholder="Write a brief description..." rows={4} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-400 font-medium resize-none text-slate-900 placeholder:text-slate-400" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-black font-roboto uppercase tracking-[0.2em] px-1">Genre</label>
                                                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-800">
                                                        <option value="">Select genre</option>
                                                        {['Friendship', 'Family', 'Horror', 'Thriller', 'Mystery', 'Fantasy', 'Science', 'Adventure', 'Comic', 'Inspirational', 'Moral Stories', 'Mythology', 'Historical', 'Crime', 'Suspense', "Kid's Stories", 'Teen Stories', 'Non-fiction', 'Fiction', 'Series Stories', 'Heartfelt Stories'].map(g => (<option key={g} value={g}>{g}</option>))}
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-black font-roboto uppercase tracking-[0.2em] px-1">Tags</label>
                                                    <div className="min-h-[64px] px-3 py-3 bg-white border border-slate-200 rounded-2xl flex flex-wrap gap-2">
                                                        {tags.map((tag, i) => (
                                                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100/70 text-indigo-700 rounded-full text-[12px] font-semibold">
                                                                {tag.toLowerCase()}
                                                                <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="text-indigo-400 hover:text-red-400">Ã—</button>
                                                            </span>
                                                        ))}
                                                        <input type="text" placeholder="Add tag..." className="flex-1 min-w-[90px] bg-transparent px-1 py-0.5 outline-none text-[13px] text-slate-500"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    const val = (e.currentTarget as HTMLInputElement).value.trim();
                                                                    if (val && !tags.includes(val.toLowerCase())) { setTags([...tags, val.toLowerCase()]); e.currentTarget.value = ''; }
                                                                }
                                                            }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden min-h-[600px] flex flex-col relative shadow-sm">
                                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 flex-wrap">
                                            <EditorBtn icon="format_bold" onClick={() => execCommand('bold')} />
                                            <EditorBtn icon="format_italic" onClick={() => execCommand('italic')} />
                                            <EditorBtn icon="format_underlined" onClick={() => execCommand('underline')} />
                                            <div className="w-px h-6 bg-slate-200 mx-2"></div>
                                            <EditorBtn icon="insert_link" tooltip="Insert Link" onClick={() => { const url = prompt('Enter URL:'); if (url) execCommand('createLink', url); }} />
                                            <EditorBtn icon="attach_file" tooltip="Attach File" onClick={() => { (document.getElementById('editor-attach-input') as HTMLInputElement)?.click(); }} />
                                            <EditorBtn icon="upload_file" tooltip="Upload Image" onClick={() => { (document.getElementById('editor-upload-input') as HTMLInputElement)?.click(); }} />
                                            <input id="editor-attach-input" type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) execCommand('insertText', `[Attachment: ${f.name}]`); e.target.value = ''; }} />
                                            <input id="editor-upload-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => execCommand('insertHTML', `<img src="${ev.target?.result}" style="max-width:100%;border-radius:12px;margin:8px 0;" />`); r.readAsDataURL(f); } e.target.value = ''; }} />
                                            <button onClick={() => { setShowAiPanel(!showAiPanel); setAiError(''); }} title="AI Story Generator"
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showAiPanel ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100'}`}>
                                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                                AI Generate
                                            </button>
                                            <div className="flex-1"></div>
                                            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black text-slate-400">{wordCount} Words</div>
                                        </div>
                                        <div ref={editorRef} contentEditable onInput={handleEditorInput} className="flex-1 p-16 outline-none text-slate-800 text-base leading-relaxed min-h-[500px]"></div>
                                        {wordCount === 0 && (<div className="absolute top-[108px] left-[64px] pointer-events-none text-slate-400 text-base font-medium italic">Once upon a time...</div>)}
                                    </div>

                                    {/* Action Buttons at the end of the page */}
                                    <div className="pt-2 pb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button onClick={saveDraft} className="px-8 py-4 bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Save Draft</button>
                                            <button onClick={() => setActiveRightPanel('schedule')} className="px-8 py-4 bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Schedule</button>
                                        </div>
                                        <button onClick={handlePublish} className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all">Publish Story</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-16 bg-white border-l border-slate-200 flex flex-col items-center py-6 gap-6 z-40">
                            <SidebarTrigger icon="schedule" active={activeRightPanel === 'progress'} onClick={() => setActiveRightPanel(activeRightPanel === 'progress' ? null : 'progress')} tooltip="Writing Progress" />
                            <SidebarTrigger icon="settings_suggest" active={activeRightPanel === 'settings'} onClick={() => setActiveRightPanel(activeRightPanel === 'settings' ? null : 'settings')} tooltip="Story Settings" />
                            <SidebarTrigger icon="calendar_month" active={activeRightPanel === 'schedule'} onClick={() => setActiveRightPanel(activeRightPanel === 'schedule' ? null : 'schedule')} tooltip="Schedule Publishing" />
                        </div>

                        {activeRightPanel && (
                            <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col z-30">
                                <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800">{activeRightPanel === 'progress' ? 'Writing Progress' : activeRightPanel === 'settings' ? 'Story Settings' : 'Schedule Publishing'}</h3>
                                    <button onClick={() => setActiveRightPanel(null)} className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined text-lg">close</span></button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                    {activeRightPanel === 'settings' && (
                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-400">Visibility</label>
                                                <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold">
                                                    <option>Public</option><option>Private</option><option>Unlisted</option>
                                                </select>
                                            </div>
                                            <div className="space-y-6">
                                                <SidebarToggle label="Enable Comments" description="Allow feedback" active={enableComments} onChange={() => setEnableComments(!enableComments)} />
                                                <SidebarToggle label="Mature Content" description="Age-gated content" active={matureContent} onChange={() => setMatureContent(!matureContent)} />
                                                <SidebarToggle label="Allow Downloads" description="Let readers download PDF" active={allowDownloads} onChange={() => setAllowDownloads(!allowDownloads)} />
                                            </div>
                                        </div>
                                    )}
                                    {activeRightPanel === 'schedule' && (
                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-400">Publish Date & Time</label>
                                                <input type="datetime-local" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold" />
                                            </div>
                                            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs">Confirm Schedule</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative px-10 py-12 bg-[#f1f5f9] font-roboto">
                        <div className="w-full">

                            {
                                activeView === 'dashboard' && (
                                    <>
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome back, {savedAuthorName}!</h1>
                                                <p className="text-slate-500 text-sm font-medium">Your creative hub is ready. What will you write today?</p>
                                            </div>
                                            <button 
                                                onClick={handleLogout} 
                                                className="flex items-center justify-center size-12 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm active:scale-95"
                                                title="Sign Out"
                                            >
                                                <span className="material-symbols-outlined text-xl">logout</span>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                            {[
                                                { label: 'Total Reads', val: stories.reduce((sum, s) => sum + (s.reads || 0), 0).toString(), icon: 'visibility', color: 'indigo', bg: 'bg-indigo-300/30', border: 'border-indigo-400/20' },
                                                { label: 'Followers', val: '0', icon: 'group', color: 'emerald', bg: 'bg-emerald-300/30', border: 'border-emerald-400/20' },
                                                { label: 'Published Stories', val: stories.filter(s => s.status === 'Published').length.toString(), icon: 'auto_stories', color: 'rose', bg: 'bg-rose-300/30', border: 'border-rose-400/20' },
                                                { label: 'Total Drafts', val: stories.filter(s => s.status === 'Draft').length.toString(), icon: 'description', color: 'amber', bg: 'bg-amber-300/30', border: 'border-amber-400/20' },
                                            ].map((stat, i) => (
                                                <div key={i} className={`${stat.bg} ${stat.border} p-5 rounded-3xl border-2 flex items-center gap-4 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/5 active:scale-95 group`}>
                                                    <div className={`size-10 rounded-2xl bg-${stat.color}-500/20 text-${stat.color}-700 flex items-center justify-center group-hover:bg-${stat.color}-500/30 transition-colors`}>
                                                        <span className="material-symbols-outlined text-xl transition-transform duration-500 group-hover:scale-110">{stat.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                                        <p className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">{stat.val}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Recent Stories</h2>
                                                <button onClick={() => setActiveView('my-stories')} className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">View All</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {stories.slice(0, 4).map((story, idx) => (
                                                    <div key={idx} onClick={() => handleStoryClick(story)} className="bg-white p-3.5 rounded-[20px] border border-slate-200 flex items-center gap-4 group hover:shadow-md transition-all cursor-pointer">
                                                        <div className="size-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                                            {story.coverImage ? <img src={story.coverImage} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-2xl text-slate-400 m-3">image</span>}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-black text-slate-800 truncate">{story.title}</h3>
                                                            <p className="text-[10px] text-slate-400 font-bold mt-1">({story.wordCount} words)</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {stories.length === 0 && (
                                                    <div className="md:col-span-2 bg-indigo-50 border border-dashed border-indigo-200 rounded-[28px] p-10 text-center">
                                                        <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">No stories yet. Start your journey today!</p>
                                                        <button onClick={() => setActiveView('new-story')} className="mt-4 px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl">Create New Story</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                            {
                                activeView === 'my-stories' && (
                                    <div className="font-roboto">
                                        <div className="flex items-center justify-between mb-8">
                                            <h1 className="text-3xl font-bold text-slate-900">My Stories</h1>
                                            <button onClick={() => setActiveView('new-story')} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm">
                                                <span className="material-symbols-outlined text-xs">add</span>New Story
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {stories.length > 0 ? stories.map((story, idx) => (
                                                <div key={idx} onClick={() => handleStoryClick(story)} className="bg-white p-4 rounded-[24px] border border-slate-200 flex items-center gap-4 group hover:shadow-md transition-all cursor-pointer">
                                                    <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                                                        {story.coverImage ? <img src={story.coverImage} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-3xl text-slate-300 m-4">image</span>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-bold text-slate-800">{story.title}</h3>
                                                        <p className="text-[11px] text-slate-400">({story.wordCount} words)</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 transition-all">
                                                        {story.status === 'Published' && (
                                                            <button
                                                                onClick={(e) => handleLiveClick(e, story)}
                                                                className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
                                                            >
                                                                Live
                                                            </button>
                                                        )}
                                                        <button onClick={(e) => { e.stopPropagation(); loadStoryIntoEditor(story); }} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-black hover:bg-slate-100 transition-colors">Edit</button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(story.id); }} className="size-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors">
                                                            <span className="material-symbols-outlined text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="bg-white p-20 rounded-[32px] border border-slate-200 text-center shadow-sm">
                                                    <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">auto_stories</span>
                                                    <p className="text-slate-400 font-medium">No stories yet. Start writing your masterpiece!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            }

                            {activeView === 'settings' && (
                                <SettingsView
                                    authorName={authorName}
                                    authorEmail={authorEmail}
                                    setAuthorName={setAuthorName}
                                    setAuthorEmail={setAuthorEmail}
                                    currentPassword={currentPassword}
                                    setCurrentPassword={setCurrentPassword}
                                    newPassword={newPassword}
                                    setNewPassword={setNewPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    passwordError={passwordError}
                                    passwordSuccess={passwordSuccess}
                                    handleChangePassword={handleChangePassword}
                                    handleSaveChanges={handleSaveChanges}
                                    settingsNotifications={settingsNotifications}
                                    setSettingsNotifications={setSettingsNotifications}
                                    authorBio={authorBio}
                                    setAuthorBio={setAuthorBio}
                                    settingsIncomeAnalytics={settingsIncomeAnalytics}
                                    setSettingsIncomeAnalytics={setSettingsIncomeAnalytics}
                                    handleLogout={handleLogout}
                                    passwordRules={passwordRules}
                                />
                            )}

                            {activeView === 'analytics' && <AnalyticsView stories={stories} onStoryClick={handleStoryClick} />}
                            {activeView === 'earnings' && <EarningsView />}
                            {activeView === 'notifications' && <NotificationView />}
                            {
                                ['messages'].includes(activeView) && (
                                    <div className="w-full py-20 text-center">
                                        <h1 className="text-3xl font-black text-slate-900 capitalize">{activeView}</h1>
                                        <div className="bg-white p-20 rounded-[40px] border border-slate-200">
                                            <span className="material-symbols-outlined text-8xl text-slate-400 mb-6">construction</span>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Section under refinement</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div >
                    </div >
                )}
            </main >

            {showAiPanel && (
                <div className="fixed inset-0 z-[100] ai-panel-slide flex flex-col overflow-hidden">
                    <div className="flex-1 bg-[#0d0d20] shadow-2xl flex flex-col pointer-events-auto overflow-hidden min-h-0" style={{ background: 'radial-gradient(circle at 50% -20%, #1a1a3a 0%, #0d0d20 70%, #050510 100%)' }}>
                        {/* Header Section - Full Width */}
                        <div className="px-8 py-5 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))' }}>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                </div>
                                <div>
                                    <h2 className="text-white font-black text-lg tracking-tight">AI Creative Studio</h2>
                                    <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">Powered by Gemini Ultra Engine</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowAiPanel(false); setAiError(''); }} className="size-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-slate-400 transition-all hover:text-white hover:scale-105 active:scale-95 group">
                                <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">close</span>
                            </button>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                                {(!geminiApiKey || showKeyInput) && (
                                    <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-5">
                                        <div>
                                            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-1.5 text-center">API Activation Required</p>
                                            <p className="text-slate-400 text-xs text-center">To use the AI engine, please connect your Gemini API key.</p>
                                        </div>
                                        <div className="flex flex-col gap-3 max-w-sm mx-auto">
                                            <input type="password" value={geminiApiKey} onChange={e => setGeminiApiKey(e.target.value)} placeholder="Paste Gemini API key..." className="w-full px-5 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50 text-center transition-all font-mono" />
                                            <button onClick={() => { localStorage.setItem('gemini_api_key', geminiApiKey); setShowKeyInput(false); }} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-black rounded-xl shadow-xl shadow-indigo-500/20 hover:opacity-90 transition-all">Connect Studio Engine</button>
                                        </div>
                                    </div>
                                )}

                                {geminiApiKey && !showKeyInput && (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <span className="material-symbols-outlined text-emerald-400 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Neural Engine Online</p>
                                        </div>
                                        <button onClick={() => setShowKeyInput(true)} className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">Configure API</button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-1 text-center">
                                        <h3 className="text-white font-black text-xl tracking-tight">What are we creating today?</h3>
                                        <p className="text-slate-500 text-xs font-medium">Describe your dream story in detail for the best results.</p>
                                    </div>

                                    <textarea
                                        value={aiHint}
                                        onChange={e => { setAiHint(e.target.value); setAiError(''); }}
                                        placeholder="e.g. A noir detective thriller set in a futuristic cyberpunk city where rain never stops..."
                                        rows={6}
                                        className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-[24px] text-white text-base placeholder:text-slate-700 outline-none resize-none focus:border-indigo-500/30 transition-all shadow-inner"
                                    />

                                    <div className="space-y-3 px-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Creative Inspirations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Ghost detective solving murder', 'Robot discoveries emotions', 'Adult wizard school', 'Lost time sailor', 'Ancient attic letters'].map(chip => (
                                                <button
                                                    key={chip}
                                                    onClick={() => setAiHint(chip)}
                                                    className="px-4 py-2 bg-white/[0.04] hover:bg-indigo-500/20 border border-white/[0.08] text-slate-400 hover:text-indigo-300 rounded-xl text-[11px] font-bold transition-all"
                                                >
                                                    {chip}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {aiError && (
                                    <div className="flex items-start gap-3 p-5 rounded-xl bg-red-500/10 border border-red-500/20 max-w-xl mx-auto">
                                        <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                                        <p className="text-red-400 text-xs leading-relaxed font-bold">{aiError}</p>
                                    </div>
                                )}

                                {aiPreview && (
                                    <div ref={aiPreviewRef} className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                        <div className="p-10 rounded-[40px] border border-indigo-500/30 bg-indigo-500/5 max-h-[600px] overflow-y-auto custom-scrollbar shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <span className="material-symbols-outlined text-9xl text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 mb-8">
                                                <div className="size-2.5 bg-indigo-500 rounded-full animate-ping"></div>
                                                <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.3em]">AI Generated Draft</p>
                                            </div>
                                            <div
                                                className="text-slate-100 text-base leading-[1.8] font-roboto prose-invert prose-p:mb-6 prose-h3:text-white prose-h3:font-black prose-h3:mb-4 prose-h3:text-2xl relative z-10"
                                                dangerouslySetInnerHTML={{ __html: aiPreview.startsWith('"') ? aiPreview.slice(1, -1) : aiPreview }}
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button onClick={insertAiStory} className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/10 hover:scale-105 transition-transform">
                                                <span className="material-symbols-outlined text-xl">edit_note</span>
                                                Use This Story
                                            </button>
                                            <button onClick={downloadAiStory} className="px-8 py-4 bg-white/[0.06] border border-white/10 text-white font-black text-base rounded-xl flex items-center justify-center gap-2.5 hover:bg-white/[0.12] transition-all hover:scale-105 active:scale-95">
                                                <span className="material-symbols-outlined text-xl">download</span>
                                                Download Story
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center pt-2">
                                    <button
                                        onClick={generateStory}
                                        disabled={aiLoading || !aiHint.trim()}
                                        className="w-full max-w-sm py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black text-base rounded-2xl hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/30"
                                    >
                                        {aiLoading ? (
                                            <><span className="ai-spin size-5 border-[3px] border-white/30 border-t-white rounded-full inline-block"></span>Generating...</>
                                        ) : (
                                            <><span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>{aiPreview ? 'Try New Variation' : 'Generate Masterpiece'}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

// HELPER COMPONENTS

function NavItem({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <div onClick={onClick} className={`flex items-center gap-3.5 px-6 py-3.5 rounded-2xl cursor-pointer transition-all group relative ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined text-xl transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>{icon}</span>
            <span className="text-sm font-bold tracking-tight">{label}</span>
            {active && (
                <div className="absolute left-0 w-1.5 h-6 bg-indigo-300 rounded-r-full shadow-[2px_0_12px_rgba(165,180,252,0.6)]"></div>
            )}
        </div>
    );
}

function EditorBtn({ icon, onClick, active = false, tooltip }: { icon: string; onClick?: () => void; active?: boolean; tooltip?: string }) {
    const btn = (
        <button onClick={onClick} type="button" className={`size-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700 border border-transparent hover:border-slate-300'}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </button>
    );
    if (!tooltip) return btn;
    return (
        <div className="relative group/ebtn">
            {btn}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/ebtn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[999]">
                {tooltip}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 bg-slate-900 rotate-45"></div>
            </div>
        </div>
    );
}

function SidebarTrigger({ icon, active, onClick, tooltip }: { icon: string; active: boolean; onClick: () => void; tooltip: string }) {
    return (
        <div className="relative group/trigger">
            <button onClick={onClick} className={`size-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </button>
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/trigger:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">{tooltip}</div>
        </div>
    );
}

function SidebarToggle({ label, description, active, onChange }: { label: string; description: string; active: boolean; onChange: () => void }) {
    return (
        <div onClick={onChange} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`size-10 rounded-xl flex items-center justify-center ${active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-xl">{active ? 'check_circle' : 'radio_button_unchecked'}</span>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-800">{label}</p>
                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{description}</p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors p-1 ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <div className={`size-4 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );
}

const AnalyticsView: React.FC<{ stories: any[]; onStoryClick: (s: any) => void }> = ({ stories, onStoryClick }) => {
    const publishedStories = stories.filter(s => s.status === 'Published');
    const totalReads = stories.reduce((sum, s) => sum + (s.reads_count || 0), 0);
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [readerDistribution, setReaderDistribution] = useState<any>({ morning: 0, evening: 0, night: 0 });
    const [lastReadTime, setLastReadTime] = useState<string>('');
    const savedAuthorName = localStorage.getItem('author_name') || 'Author Name';

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch(`${API_URL}/analytics/reads-over-time?author_name=${savedAuthorName}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.reads) {
                        setAnalyticsData(data.reads);
                    }
                    if (data && data.distribution) {
                        setReaderDistribution(data.distribution);
                    }

                    // Also find the overall last read time for any story
                    if (data.reads && data.reads.length > 0) {
                        const latest = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                        setLastReadTime(`Last read: Just now at ${latest}`);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            }
        };
        fetchAnalytics();
    }, [savedAuthorName, stories]); // Refresh when stories change (e.g. after a read)

    return (
        <div className="pb-20 space-y-8 min-h-full font-roboto text-slate-900 overflow-x-hidden">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics</h1>
                {lastReadTime && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
                        <span className="size-2 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{lastReadTime}</span>
                    </div>
                )}
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Reads" value={totalReads.toLocaleString()} icon="trending_up" iconBg="bg-emerald-500" />
                <StatCard label="Published Stories" value={publishedStories.length.toString()} icon="auto_stories" iconBg="bg-blue-500" />
                <StatCard label="Drafts" value={stories.filter(s => s.status === 'Draft').length.toString()} icon="edit_note" iconBg="bg-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - 7/12 */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Reads Over Time */}
                    {/* Reading Rhythm - Premium Integrated UI */}
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8 px-2">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight font-outfit">Reading Rhythm</h2>
                                <p className="text-slate-400 mt-1 font-bold uppercase text-[10px] tracking-widest opacity-70">Engagement Analytics</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select className="bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black py-2 px-5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase tracking-widest cursor-pointer hover:bg-slate-100 outline-none">
                                    <option>Last 24 Hours</option>
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>Last 90 Days</option>
                                    <option>This Year</option>
                                    <option>All Time</option>
                                </select>
                            </div>
                        </div>

                        {/* Internal Light Graph Container - "The Rhythm Screen" */}
                        <div className="bg-slate-50 rounded-[32px] p-10 shadow-sm relative mb-10 overflow-hidden border border-slate-100">
                            {/* Soft Ambient Glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 blur-[100px] pointer-events-none" />

                            <div className="h-80 w-full relative overflow-visible">
                                <LineChart data={analyticsData} />
                            </div>
                        </div>

                        {/* Reader Insights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 px-2">
                            <ReaderInsightCard
                                label="Morning Reader"
                                count={readerDistribution.morning}
                                icon="light_mode"
                                color="amber"
                            />
                            <ReaderInsightCard
                                label="Evening Reader"
                                count={readerDistribution.evening}
                                icon="wb_twilight"
                                color="pink"
                            />
                            <ReaderInsightCard
                                label="Night Owl"
                                count={readerDistribution.night}
                                icon="dark_mode"
                                color="violet"
                            />
                        </div>

                        {/* Bottom Stats Glow Bar */}
                        <div className="mt-10 px-2 py-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-10">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Activities</span>
                                    <span className="text-slate-800 text-2xl font-black font-outfit">{analyticsData.reduce((acc, d) => acc + (d.count || 0), 0)} <span className="text-xs text-slate-400 font-medium ml-1 tracking-normal">Sessions</span></span>
                                </div>
                                <div className="w-px h-10 bg-slate-100" />
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Read Time</span>
                                    <span className="text-slate-800 text-2xl font-black font-outfit">
                                        {Math.round(analyticsData.reduce((acc, d) => acc + (d.count || 0), 0) * 4.5)} <span className="text-xs text-slate-400 font-medium ml-1 tracking-normal">mins</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-12 bg-indigo-50/50 rounded-2xl overflow-hidden relative border border-slate-100">
                                    <MiniSparkline data={analyticsData} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Story Performance */}
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight font-outfit">Story Performance</h2>
                            <div className="h-1 w-12 bg-indigo-500 rounded-full mt-2" />
                        </div>

                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                            {publishedStories.length > 0 ? (
                                publishedStories.slice(0, 2).map((story, i) => (
                                    <StoryPerformanceCard
                                        key={story.id}
                                        story={story}
                                        isTrending={i === 0}
                                        isDropped={i === 1 && story.reads_count < 5}
                                        color={i === 0 ? 'indigo' : 'blue'}
                                    />
                                ))
                            ) : (
                                <div className="col-span-1 2xl:col-span-2 py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">analytics</span>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No Story Performance Data</p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Total Avg bar */}
                        <div className="mt-8 p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-between group/bar hover:bg-slate-50 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 transition-transform group-hover/bar:scale-110">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'fill' 1" }}>timer</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-70">Global Performance</p>
                                    <p className="text-xl font-black text-slate-800 font-outfit">Avg. Read Time: <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-4">
                                        {Math.floor((totalReads * 4.5) / Math.max(1, publishedStories.length))}m {Math.round(((totalReads * 4.5) / Math.max(1, publishedStories.length)) % 1 * 60)}s
                                    </span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                                <span className="material-symbols-outlined text-indigo-500 font-black animate-bounce">trending_up</span>
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">+28% <span className="text-slate-400 font-bold ml-1">last week</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - 5/12 */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Stories Breakdown */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-base font-black text-slate-800 tracking-tight">Stories Breakdown</h3>
                            <select className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 outline-none">
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="flex flex-col items-center gap-8">
                            <div className="size-48 flex-shrink-0 animate-in slide-in-from-top-4 duration-1000">
                                <DonutChart published={publishedStories.length} drafts={stories.length - publishedStories.length} />
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                <BreakdownRow label="Published" value={publishedStories.length} total={stories.length} colorGrad="from-blue-500 to-cyan-400" />
                                <BreakdownRow label="Total Reads" value={totalReads} total={totalReads + 10} colorGrad="from-indigo-600 to-violet-500" />
                                <BreakdownRow label="Status" value="Live" isStatus colorGrad="from-emerald-500 to-teal-400" />
                            </div>
                        </div>
                    </div>

                    {/* Top Performing Stories */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                        <h3 className="text-base font-black text-slate-800 mb-6 tracking-tight">Top Performing Stories</h3>
                        <div className="space-y-4">
                            {publishedStories.slice(0, 3).map((story, i) => (
                                <TopStoryRow key={i} story={story} rank={i + 1} onClick={() => onStoryClick(story)} />
                            ))}
                            {publishedStories.length === 0 && <p className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No published stories yet</p>}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

// SVG CHARTS & UTILS components
const ReaderInsightCard = ({ label, count, icon, color }: { label: string; count: number; icon: string; color: string }) => {
    const colors: any = {
        amber: 'from-amber-500/5 to-transparent text-amber-600 border-amber-100',
        pink: 'from-pink-500/5 to-transparent text-pink-600 border-pink-100',
        violet: 'from-violet-500/5 to-transparent text-violet-600 border-violet-100'
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 border transition-all hover:shadow-md group/card`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover/card:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div>
                    <p className="font-black text-[9px] uppercase tracking-widest opacity-60">{label}</p>
                    <p className="text-slate-800 text-2xl font-black font-outfit mt-0.5">{count} <span className="text-[10px] text-slate-400 font-medium tracking-normal mb-2 uppercase">Hits</span></p>
                </div>
            </div>
        </div>
    );
};

const MiniSparkline = ({ data }: { data: any[] }) => {
    if (data.length < 2) return null;
    const points = data.slice(-10).map((d, i) => `${(i / 10) * 128},${40 - (d.count / 15) * 30}`).join(' ');
    return (
        <svg viewBox="0 0 128 40" className="w-full h-full">
            <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
const StoryPerformanceCard = ({ story, isTrending, isDropped, color }: any) => {
    const totalReads = story.reads_count || 0;
    const totalMins = totalReads * 4.5;
    const hours = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);
    const score = Math.min(99, Math.round((totalReads / 20) * 100) || 0);

    return (
        <div className={`p-8 rounded-[32px] border transition-all hover:shadow-lg ${color === 'indigo' ? 'bg-indigo-50/30 border-indigo-100/50' : 'bg-blue-50/30 border-blue-100/50'}`}>
            <div className="flex items-center gap-5 mb-8">
                <div className="size-16 rounded-full overflow-hidden border-4 border-white shadow-sm flex-shrink-0 animate-in fade-in zoom-in duration-700">
                    {story.coverImage ? <img src={story.coverImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><span className="material-symbols-outlined text-slate-300">image</span></div>}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-black text-slate-800 truncate tracking-tight font-outfit uppercase">{story.title}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span className="text-[11px] font-black uppercase tracking-wider">{hours}h {mins}m</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-10">
                <div className="flex gap-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                            <span className="text-base font-black text-slate-800">{totalReads}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap opacity-70 underline decoration-slate-200 underline-offset-4 decoration-2">Total Readers</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="material-symbols-outlined text-slate-400 text-sm">trending_up</span>
                            <span className="text-base font-black text-slate-800">High <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-lg text-[9px] ml-1">{score}</span></span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap opacity-70 underline decoration-slate-200 underline-offset-4 decoration-2">Growth Level</span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-60">Engagement Score</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black shadow-sm ${isTrending ? 'bg-emerald-400 text-white' : 'bg-amber-400 text-white'}`}>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{isTrending ? 'local_fire_department' : 'warning'}</span>
                        {isTrending ? 'High' : (isDropped ? 'Drop' : 'Fair')} {score}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${isTrending ? 'text-orange-500' : 'text-blue-500'}`}>
                    <span className="material-symbols-outlined text-lg">{isTrending ? 'local_fire_department' : (isDropped ? 'book' : 'monitoring')}</span>
                    {isTrending ? 'Trending this week' : (isDropped ? 'Engagement dropped' : 'Stable performance')}
                </div>
                <div className="w-24 h-8 opacity-40">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                        <path d={isTrending ? "M 0 25 Q 25 10, 50 15 T 100 5" : "M 0 5 Q 25 20, 50 15 T 100 25"} fill="none" stroke={isTrending ? "#a855f7" : "#3b82f6"} strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const LineChart = ({ data }: { data: any[] }) => {
    const AVG_READ_MINS = 4.5;
    const points_count = 30;

    const formatTime = (mins: number) => {
        if (mins < 60) return `${Math.round(mins)}m`;
        const h = Math.floor(mins / 60);
        const m = Math.round(mins % 60);
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    const processData = () => {
        const result = [];
        const hasRealData = data.some(d => (d.count || 0) > 0);
        // Richer sample data for more visual complexity
        const plotData = hasRealData ? data : [
            { date: '2026-03-01', count: 1 },
            { date: '2026-03-04', count: 3 },
            { date: '2026-03-06', count: 5 },
            { date: '2026-03-08', count: 2 },
            { date: '2026-03-11', count: 12 },
            { date: '2026-03-13', count: 6 },
            { date: '2026-03-15', count: 15 },
            { date: '2026-03-18', count: 4 },
            { date: '2026-03-21', count: 14 },
            { date: '2026-03-23', count: 3 },
            { date: '2026-03-24', count: 10 }
        ];

        const maxCount = Math.max(...plotData.map(d => d.count || 0), 0);
        // Round up to nearest multiple of 4 to ensure clean linear intervals for Y-axis
        const displayMax = Math.max(Math.ceil(maxCount / 4) * 4, 20);

        for (let i = points_count - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = plotData.find(item => item.date?.startsWith(dateStr));
            const count = found ? (found.count || 0) : 0;
            result.push({
                x: ((points_count - 1 - i) / (points_count - 1)) * 240 + 45,
                y: 80 - (count / displayMax) * 65,
                count: count,
                timeMins: count * AVG_READ_MINS,
                label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                date: d.toLocaleDateString('en-US', { day: 'numeric' }), // Added for X-axis labels
                isPeak: count > 0 && count === maxCount
            });
        }
        return { processed: result, displayMax };
    };

    const { processed, displayMax } = processData();

    // Generate Smooth Bezier Path
    const getBezierPath = (points: any[]) => {
        if (points.length < 2) return "";
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            path += ` C ${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
        }
        return path;
    };

    const pathData = getBezierPath(processed);

    const yLevels = [
        { label: formatTime(displayMax * AVG_READ_MINS), pos: 15 },
        { label: formatTime(displayMax * 0.75 * AVG_READ_MINS), pos: 31.25 },
        { label: formatTime(displayMax * 0.5 * AVG_READ_MINS), pos: 47.5 },
        { label: formatTime(displayMax * 0.25 * AVG_READ_MINS), pos: 63.75 },
        { label: '0m', pos: 80 }
    ];

    const xLabels = (() => {
        if (processed.length < 2) return [];
        // Day 1, 11, 21, 31 (Linear 10-day interval)
        const indices = [0, 10, 20, processed.length - 1];
        return indices.map(idx => processed[idx] ? {
            x: processed[idx].x,
            label: processed[idx].date.toUpperCase()
        } : null).filter(Boolean);
    })();

    return (
        <div className="w-full h-full relative cursor-crosshair">
            <style>{`
                @keyframes drawRhythm {
                    from { stroke-dashoffset: 1200; opacity: 0; }
                    to { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes badgeFloat {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                .rhythm-line {
                    stroke-dasharray: 1200;
                    stroke-dashoffset: 1200;
                    animation: drawRhythm 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                .badge-anim {
                    animation: badgeFloat 3s infinite ease-in-out;
                }
            `}</style>

            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="rhythmGrad" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="30%" stopColor="#ec4899" />
                        <stop offset="60%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                    <filter id="rhythmGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Y Grid Lines */}
                {yLevels.map((l, i) => (
                    <g key={i}>
                        <line x1="45" y1={l.pos} x2="295" y2={l.pos} stroke="#e2e8f0" strokeWidth="0.2" strokeDasharray="2,2" />
                        <text x="40" y={l.pos} textAnchor="end" dominantBaseline="middle" style={{ fontSize: '3.5px' }} className="fill-slate-500 font-bold">{l.label}</text>
                    </g>
                ))}

                {/* X Labels */}
                {xLabels.map((p, i) => p && (
                    <text key={i} x={p.x} y="95" textAnchor="middle" style={{ fontSize: '3.5px' }} className="fill-slate-700 font-extrabold uppercase tracking-widest">{p.label}</text>
                ))}

                {/* Area Fill */}
                <path d={`${pathData} L 285,80 L 45,80 Z`} fill="url(#areaGrad)" className="animate-in fade-in duration-1000 delay-700" />

                {/* Main Curve */}
                <path d={pathData} fill="none" stroke="url(#rhythmGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="rhythm-line" filter="url(#rhythmGlow)" />

                {/* Data Points (Glow dots) */}
                {processed.map((p, i) => p.count > 0 && (
                    <circle key={i} cx={p.x} cy={p.y} r="0.8" fill="white" className="animate-in fade-in zoom-in duration-1000 delay-1000" />
                ))}                {/* Pulse for Current Point */}
                {processed.length > 0 && (
                    <g transform={`translate(${processed[processed.length - 1].x}, ${processed[processed.length - 1].y})`}>
                        <circle r="4" fill="#6366f1" fillOpacity="0.1" className="animate-pulse" />
                        <circle r="2" fill="#6366f1" stroke="white" strokeWidth="1" />
                    </g>
                )}
            </svg>
        </div>
    );
};

const DonutChart = ({ published, drafts }: { published: number; drafts: number }) => {
    const total = published + drafts || 0;
    const pubPercent = total > 0 ? (published / total) * 100 : 0;
    const draftPercent = total > 0 ? (drafts / total) * 100 : 0;

    return (
        <div className="relative size-full flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 animate-in spin-in-12 duration-1000">
                <defs>
                    <linearGradient id="pubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <linearGradient id="draftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                {total > 0 && (
                    <>
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#pubGrad)" strokeWidth="4"
                            strokeDasharray={`${pubPercent} ${100 - pubPercent}`} strokeLinecap="round" strokeDashoffset="0" filter="url(#donutGlow)" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#draftGrad)" strokeWidth="4"
                            strokeDasharray={`${draftPercent} ${100 - draftPercent}`} strokeLinecap="round" strokeDashoffset={-pubPercent} />
                    </>
                )}
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800 font-outfit leading-none">{total}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Stories</span>
            </div>
        </div>
    );
};


const BreakdownRow = ({ label, value, total, isStatus, colorGrad }: any) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="flex items-center gap-5 group cursor-pointer hover:bg-white p-3.5 rounded-[24px] border border-transparent hover:border-slate-100 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
            <div className={`size-11 rounded-2xl bg-gradient-to-br ${colorGrad} flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 transition-transform group-hover:scale-110 group-active:scale-95`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {label === 'Published' ? 'auto_stories' : label === 'Total Reads' ? 'visibility' : 'stars'}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{label}</span>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full group-hover:bg-indigo-50 transition-colors">
                        <span className="text-sm font-black text-slate-900 font-outfit">{value === 'Live' ? value : value.toLocaleString()}</span>
                        <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">chevron_right</span>
                    </div>
                </div>
                {!isStatus ? (
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                        <div
                            className={`h-full bg-gradient-to-r ${colorGrad} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-emerald-100/50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Active Status</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const TopStoryRow = ({ story, rank, onClick }: any) => (
    <div onClick={onClick} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50 transition-all group cursor-pointer border border-transparent hover:border-indigo-100">
        <div className="size-10 flex-shrink-0 flex items-center justify-center">
            {rank === 1 ? <span className="material-symbols-outlined text-amber-400 text-xl font-black">emoji_events</span> : <span className="text-sm font-black text-slate-300">{rank}</span>}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{story.title}</h4>
            <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[8px] font-black uppercase">Published</span>
            </div>
        </div>
        <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end">
                <span className="text-[10px] font-black text-slate-800">{story.reads_count || 0}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Rds</span>
            </div>
            <div className="flex items-center gap-2 justify-end mt-0.5">
                <span className="text-[10px] font-black text-slate-400 tracking-tight">{story.wordCount}</span>
                <span className="material-symbols-outlined text-slate-300 text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
        </div>
    </div>
);



const StatCard: React.FC<{ label: string; value: string; trend?: string; icon: string; iconBg: string }> = ({ label, value, trend, icon, iconBg }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm h-full">
        <div className={`size-12 rounded-xl ${iconBg} flex items-center justify-center text-white flex-shrink-0`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{label}</p>
            <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl font-black text-slate-900">{value}</span>
                {trend && <span className="text-[9px] font-bold text-emerald-500 whitespace-nowrap">{trend}</span>}
            </div>
        </div>
    </div>
);

const EarningsView: React.FC = () => (
    <div className="pb-32 space-y-10 min-h-full font-roboto text-slate-900 overflow-x-hidden">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings</h1>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined text-sm">payments</span>
                Withdrawal
            </button>
        </div>

        {/* Top Earnings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Balance" value="$0.00" icon="account_balance_wallet" iconBg="bg-emerald-500" />
            <StatCard label="Month Earnings" value="$0.00" icon="calendar_month" iconBg="bg-blue-500" />
            <StatCard label="Total Reads Earnings" value="$0.00" icon="payments" iconBg="bg-indigo-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Earnings Overview Chart */}
            <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Earnings Overview</h3>
                    <select className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 outline-none">
                        <option>Last 12 Months</option>
                    </select>
                </div>
                <div className="h-64 w-full relative">
                    <EarningsLineChart data={[0.2, 0.3, 0.25, 0.4, 0.8, 1.0, 0.6, 0.4, 0.3, 0.2]} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-100 shadow-sm animate-pulse">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Apr</p>
                        <p className="text-sm font-black text-slate-800 text-center">$0.00</p>
                    </div>
                </div>
                <div className="flex justify-between mt-4 px-2">
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map(m => (
                        <span key={m} className="text-[10px] font-bold text-slate-400">{m}</span>
                    ))}
                </div>
            </div>

            {/* Right Column - Earnings Breakdown Donut */}
            <div className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Earnings Breakdown</h3>
                    <select className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 outline-none">
                        <option>Last 12 Months</option>
                    </select>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="size-48 relative flex items-center justify-center mb-8">
                        <EarningsDonutChart />
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-black text-slate-800">$0.00</span>
                        </div>
                    </div>
                    <div className="w-full space-y-3">
                        <BreakdownRowSimple label="Reads" value="$0.00" color="bg-blue-400" />
                        <BreakdownRowSimple label="Referrals" value="$0.00" color="bg-indigo-500" />
                        <BreakdownRowSimple label="Bonuses" value="$0.00" color="bg-emerald-400" />
                    </div>
                </div>
            </div>
        </div>

        {/* Second Row - Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Earnings Overview</h3>
                    <select className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 outline-none">
                        <option>All time</option>
                    </select>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Date</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Description</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Type</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="group">
                            <td className="py-4 text-xs font-bold text-slate-800">May</td>
                            <td className="py-4 text-xs text-slate-400">Monthly earnings</td>
                            <td className="py-4 text-xs text-slate-400">-</td>
                            <td className="py-4 text-right text-xs font-black text-slate-800">$0.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Recent Transactions</h3>
                    <select className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 outline-none">
                        <option>View All</option>
                    </select>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Date</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Description</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Type</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase text-right">Status</th>
                        </tr>
                    </thead>
                </table>
                <div className="py-20 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">No transactions yet.</p>
                </div>
            </div>
        </div>

        {/* Bottom Section - Referrals */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-base font-black text-slate-800 tracking-tight">Referrals Summary</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all">
                    View All
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
            </div>
            <div className="space-y-6">
                <table className="w-full text-left mb-8">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Date</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Description</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Type</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Amount</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase text-right">Status</th>
                        </tr>
                    </thead>
                </table>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">person</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between pr-8">
                                <span className="text-xs font-bold text-slate-800">Total Referrals</span>
                                <span className="text-base font-black text-slate-900">0</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">person_check</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between pr-8">
                                <span className="text-xs font-bold text-slate-800">Successful Referrals</span>
                                <span className="text-base font-black text-slate-900">0</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <div className="size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                <span className="material-symbols-outlined">link</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-800">Copy Referral Link</h4>
                                <p className="text-[10px] font-bold text-slate-500 mt-1">Earn up to 10% commission for every referred user!</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/10">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const NotificationView: React.FC = () => (
    <div className="pb-20 space-y-8 min-h-full font-roboto text-slate-900">
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
        </div>
        <div className="bg-white p-20 rounded-[40px] border border-slate-200 text-center shadow-sm">
            <div className="size-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl text-slate-400">notifications_off</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">No notifications yet</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">When you receive updates, they'll appear here</p>
        </div>
    </div>
);

const EarningsLineChart = ({ data }: { data: number[] }) => {
    const points = data.map((val, i) => `${(i / (data.length - 1)) * 300},${100 - (val / Math.max(...data)) * 80}`).join(' ');
    return (
        <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id="earningsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`M 0,100 L ${points} L 300,100 Z`} fill="url(#earningsGrad)" className="animate-in fade-in duration-1000" />
            <path d={`M ${points}`} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in slide-in-from-left duration-1000" />
            <circle cx={(data.length - 1) * 300 / (data.length - 1)} cy={100 - (data[data.length - 1] / Math.max(...data)) * 80} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
        </svg>
    );
};

const EarningsDonutChart = () => (
    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 animate-in spin-in-12 duration-1000">
        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="45 55" strokeLinecap="round" strokeDashoffset="0" />
        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="25 75" strokeLinecap="round" strokeDashoffset="-45" />
        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="15 85" strokeLinecap="round" strokeDashoffset="-70" />
    </svg>
);

const BreakdownRowSimple = ({ label, value, color }: any) => (
    <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-all">
        <div className="flex items-center gap-3">
            <div className={`size-2.5 rounded-full ${color}`}></div>
            <span className="text-[11px] font-bold text-slate-500">{label}</span>
        </div>
        <span className="text-[11px] font-black text-slate-800">{value}</span>
    </div>
);

const ConnectedAccount = ({ name, icon, connected = false }: { name: string; icon: string; connected?: boolean }) => (
    <div className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 group transition-all">
        <div className="flex items-center gap-3">
            <img src={icon} alt={name} className="size-5 rounded-md grayscale group-hover:grayscale-0 transition-all" />
            <span className="text-xs font-bold text-slate-700">{name}</span>
        </div>
        <button className={`text-[10px] font-black uppercase ${connected ? 'text-slate-400' : 'text-blue-500 hover:text-blue-600'}`}>
            {connected ? 'Connected' : 'Connect'}
        </button>
    </div>
);

const SettingToggle = ({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-transparent border-b border-transparent hover:border-slate-50 group transition-all">
        <div className="flex items-center gap-4">
            <div className={`size-10 rounded-xl ${active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'} flex items-center justify-center transition-colors group-hover:scale-110`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800">{label}</span>
                {active && <span className="text-[10px] font-bold text-slate-300">Enabled</span>}
            </div>
        </div>
        <button onClick={onClick} className={`w-12 h-6.5 rounded-full relative transition-all p-1 items-center flex ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
            <div className={`size-4.5 bg-white rounded-full shadow-sm transition-all shadow-indigo-600/10 ${active ? 'translate-x-5.5' : 'translate-x-0'}`}></div>
        </button>
    </div>
);

interface SettingsViewProps {
    authorName: string;
    authorEmail: string;
    setAuthorName: (v: string) => void;
    setAuthorEmail: (v: string) => void;
    currentPassword: string;
    setCurrentPassword: (v: string) => void;
    newPassword: string;
    setNewPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    passwordError: string;
    passwordSuccess: boolean;
    handleChangePassword: () => void;
    handleSaveChanges: () => void;
    settingsNotifications: boolean;
    setSettingsNotifications: (v: boolean) => void;
    authorBio: string;
    setAuthorBio: (v: string) => void;
    settingsIncomeAnalytics: boolean;
    setSettingsIncomeAnalytics: (v: boolean) => void;
    handleLogout: () => void;
    passwordRules: any[];
}

const SettingsView: React.FC<SettingsViewProps> = ({
    authorName, authorEmail, setAuthorName, setAuthorEmail,
    currentPassword, setCurrentPassword, newPassword, setNewPassword,
    confirmPassword, setConfirmPassword, passwordError, passwordSuccess,
    handleChangePassword, handleSaveChanges, settingsNotifications, setSettingsNotifications,
    authorBio, setAuthorBio,
    settingsIncomeAnalytics, setSettingsIncomeAnalytics, handleLogout, passwordRules
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(localStorage.getItem('author_profile_image') || null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(base64String);
                localStorage.setItem('author_profile_image', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="pb-32 space-y-8 min-h-full font-roboto text-slate-900 overflow-x-hidden">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>

            <div className="flex flex-col gap-8 w-full">
                {/* Profile Settings Section */}
                <div className="w-full bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group/settings">
                    {/* Decorative Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-[100px] pointer-events-none -mr-32 -mt-32 rounded-full" />

                    <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                        <div className="relative group/avatar">
                            {/* Animated Gradient Border */}
                            <div className="absolute inset-0 -m-1.5 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 animate-spin-slow opacity-20 group-hover/avatar:opacity-100 transition-opacity duration-700 blur-[2px]" />
                            <div className="size-36 rounded-full bg-white p-1 relative z-10 overflow-hidden">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover shadow-inner" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-inner">
                                        {authorName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {/* Camera Icon Overlay */}
                            <div onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-2 z-20 size-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-500 group-hover/avatar:text-indigo-600 group-hover/avatar:scale-110 transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-xl">photo_camera</span>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>

                        <div className="flex-1 w-full space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Author</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-60">Writer Profile</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-indigo-100 shadow-sm animate-pulse">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                        Pro Writer
                                    </span>
                                    <button onClick={() => setIsEditingProfile(!isEditingProfile)} className={`p-2 rounded-xl transition-colors flex items-center justify-center shadow-sm ${isEditingProfile ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`} title={isEditingProfile ? "Stop Editing" : "Edit Profile"}>
                                        <span className="material-symbols-outlined text-sm">{isEditingProfile ? 'close' : 'edit'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-slate-50">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</p>
                                    <div className="relative group/input">
                                        <input
                                            type="email"
                                            value={authorEmail}
                                            onChange={(e) => setAuthorEmail(e.target.value)}
                                            readOnly={!isEditingProfile}
                                            className={`w-full bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold text-slate-700 px-5 py-3.5 rounded-2xl transition-all ${!isEditingProfile ? 'cursor-not-allowed opacity-80' : ''}`}
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors">mail</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pen Name</p>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            value={authorName}
                                            onChange={(e) => setAuthorName(e.target.value)}
                                            readOnly={!isEditingProfile}
                                            className={`w-full bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold text-slate-700 px-5 py-3.5 rounded-2xl transition-all ${!isEditingProfile ? 'cursor-not-allowed opacity-80' : ''}`}
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors">edit</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between pl-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Author</p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${authorBio.length > 480 ? 'text-orange-500' : 'text-slate-300'}`}>
                                            {authorBio.length} / 500
                                        </span>
                                    </div>
                                    <textarea
                                        value={authorBio}
                                        onChange={(e) => setAuthorBio(e.target.value.slice(0, 500))}
                                        readOnly={!isEditingProfile}
                                        placeholder="Add a short bio to improve your profile..."
                                        className={`w-full h-32 bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold text-slate-600 px-5 py-4 rounded-[24px] transition-all resize-none leading-relaxed ${!isEditingProfile ? 'cursor-not-allowed opacity-80' : ''}`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={() => {
                                        handleSaveChanges();
                                        setIsEditingProfile(false);
                                    }}
                                    className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                                >
                                    Save Changes
                                </button>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="material-symbols-outlined text-sm">history</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Last updated 2 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Settings Section */}
                <div className="space-y-8 w-full">
                    <div className="w-full bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                        <h3 className="text-base font-black text-slate-800 mb-8 tracking-tight">Account Settings</h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Change Password</p>
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showCurrentPassword ? "text" : "password"} 
                                        value={currentPassword} 
                                        onChange={(e) => setCurrentPassword(e.target.value)} 
                                        placeholder="Current Password" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400 pr-10" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {showCurrentPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>

                                <div className="relative">
                                    <input 
                                        type={showNewPassword ? "text" : "password"} 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        placeholder="New Password" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400 pr-10" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {showNewPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>

                                {newPassword.length > 0 && (
                                    <ul className="space-y-1 px-1">
                                        {passwordRules.map((rule, i) => (
                                            <li key={i} className={`flex items-center gap-2 text-[10px] font-bold ${rule.ok ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                <span className="material-symbols-outlined text-[12px]">{rule.ok ? 'check_circle' : 'radio_button_unchecked'}</span>{rule.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="Confirm New Password" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400 pr-10" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                {passwordError && <p className="text-[10px] text-red-500 font-bold px-1">{passwordError}</p>}
                                {passwordSuccess && <p className="text-[10px] text-emerald-600 font-bold px-1">Password updated!</p>}
                                <button onClick={handleChangePassword} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all">
                                    Update Password
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected Accounts</h4>
                                <div className="space-y-3">
                                    <ConnectedAccount name="Google" icon="https://www.google.com/favicon.ico" connected />
                                    <ConnectedAccount name="Facebook" icon="https://www.facebook.com/favicon.ico" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings Section */}
                <div className="lg:col-span-6 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-base font-black text-slate-800 tracking-tight">Notification Settings</h3>
                    </div>
                    <div className="space-y-2">
                        <SettingToggle label="Email Notifications" icon="mail" active={settingsNotifications} onClick={() => setSettingsNotifications(!settingsNotifications)} />
                        <SettingToggle label="Weekly Recap Emails" icon="event_note" active={settingsIncomeAnalytics} onClick={() => setSettingsIncomeAnalytics(!settingsIncomeAnalytics)} />
                        <SettingToggle label="Earnings Updates" icon="payments" active />
                    </div>
                </div>

                {/* Security Settings Section */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-base font-black text-slate-800 mb-8 tracking-tight">Security Settings</h3>
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">verified_user</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800">Two-Factor Authentication</h4>
                                    <p className="text-[10px] font-bold text-slate-400">Add an extra layer of security</p>
                                </div>
                            </div>
                            <div className="w-12 h-6.5 rounded-full bg-slate-200 relative p-1 items-center flex cursor-pointer">
                                <div className="size-4.5 bg-white rounded-full shadow-md"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Login Activity</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-start gap-3">
                                        <div className="size-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400">
                                            <span className="material-symbols-outlined text-sm">laptop_mac</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-700">Chrome on Windows</p>
                                            <p className="text-[10px] font-bold text-slate-400">Los Angeles, California, USA</p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-all flex items-center gap-1">
                                        View History <span className="material-symbols-outlined text-xs">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="bg-white p-8 rounded-[32px] border border-red-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined text-2xl">logout</span>
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-800 tracking-tight">Sign Out</h3>
                            <p className="text-xs font-bold text-slate-400">Sign out from your account and return to the landing page</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="px-8 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                    >
                        Log Out Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReadingView: React.FC<{ story: any; onBack: () => void }> = ({ story, onBack }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isEntering, setIsEntering] = useState(true);

    useEffect(() => {
        // Wait for book opening zoom animation to finish
        const timer = setTimeout(() => setIsEntering(false), 1600);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#faf9f6] flex flex-col relative">
            {/* Reading Progress Bar */}
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group">
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-sm">Back to Dashboard</span>
                </button>
                <div className="text-center">
                    <h2 className="text-sm font-black text-slate-800 font-lora">{story.title}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Story Reader</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{Math.round(scrollProgress)}% Read</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full py-12 px-6 reading-content-area relative">
                <div className="glitter-shatter-wrapper p-[8px] rounded-[56px] shadow-2xl min-h-[80vh] flex overflow-hidden">
                    <div className="bg-white rounded-[48px] overflow-hidden flex flex-col md:flex-row w-full flex-1 relative z-10">
                    <div className={`md:w-1/3 p-10 bg-white/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-200/50 flex flex-col items-center transition-all duration-[700ms] ease-out z-20 relative overflow-hidden ${isEntering ? 'opacity-0 -translate-x-full pointer-events-none absolute md:relative' : 'opacity-100 translate-x-0'}`}>
                        {/* Background shade from cover image for immersive feel */}
                        {story.coverImage && (
                            <div className="absolute inset-0 pointer-events-none -z-10 opacity-20 overflow-hidden">
                                <img src={story.coverImage} alt="" className="w-full h-full object-cover blur-3xl scale-150 rotate-12" />
                            </div>
                        )}
                        <div className="sticky top-32 w-full flex flex-col items-center">
                            <div className="w-56 h-80 bg-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] mb-10 overflow-hidden group">
                                {story.coverImage ? (
                                    <img src={story.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Story Cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                        <span className="material-symbols-outlined text-7xl text-slate-300">auto_stories</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-8">
                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-slate-900 mb-3 font-lora leading-tight">{story.title}</h1>
                                    <div className="flex flex-col py-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Author</span>
                                            <span className="text-sm font-bold text-slate-800">{story.author}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/60 p-4 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Genre</p>
                                        <p className="text-xs font-bold text-indigo-600">{story.genre}</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Words</p>
                                        <p className="text-xs font-bold text-slate-800">{story.wordCount}</p>
                                    </div>
                                </div>

                                {story.description && (
                                    <div className="bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Synopsis</p>
                                        <p className="text-slate-600 text-[13px] leading-relaxed italic font-medium">
                                            "{story.description}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`flex-1 p-10 md:p-16 paper-texture overflow-hidden transition-all duration-[700ms] ease-out ${isEntering ? 'md:mx-auto max-w-4xl' : ''}`}>
                        <div className="max-w-prose mx-auto">
                            <div className="flex items-center gap-4 mb-12 opacity-30">
                                <div className="h-px flex-1 bg-slate-300"></div>
                                <span className="material-symbols-outlined text-slate-400">auto_stories</span>
                                <div className="h-px flex-1 bg-slate-300"></div>
                            </div>

                            <div
                                className="story-body-text font-lora select-text select-none"
                                dangerouslySetInnerHTML={{ __html: story.content || '<p className="italic text-slate-400">This story has no content yet.</p>' }}
                            />

                            <div className="mt-20 flex flex-col items-center gap-6 py-12 border-t border-slate-100">
                                <span className="material-symbols-outlined text-indigo-200 text-5xl">workspace_premium</span>
                                <div className="text-center">
                                    <h4 className="text-xl font-black text-slate-800 font-lora">The End</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Thank you for reading</p>
                                </div>
                                <button
                                    onClick={onBack}
                                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </main>

            {/* Float Action Buttons? */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-3">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="size-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-slate-100">
                    <span className="material-symbols-outlined">vertical_align_top</span>
                </button>
            </div>
        </div>
    );
};

export default AuthorDashboard;

