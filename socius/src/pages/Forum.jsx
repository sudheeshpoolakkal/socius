import React, { useState, useEffect, createContext, useContext } from 'react';
// import { AppContext } from '../context/AppContext'; // Uncomment this in your local environment
import { toast } from 'react-toastify';
import {
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  User,
  Calendar,
  Filter,
  TrendingUp,
  Heart,
  MessageSquare,
  ChevronRight,
  Clock,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';

/**
 * NOTE: AppContext is mocked here to allow the preview to compile.
 * Please restore your original import: import { AppContext } from '../context/AppContext';
 * and remove the mock definition below when using this in your local project.
 */
const AppContext = createContext({
  token: "mock-token",
  userData: { _id: "user-123", name: "Neighbor" }
});

const Forum = () => {
  // Using the local context for preview; in your project, this will use your AppProvider
  const { token, userData } = useContext(AppContext);

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [postComments, setPostComments] = useState({});

  const categories = [
    { id: 'all', name: 'All Requests', count: 0 },
    { id: 'tools', name: 'Tools', count: 0 },
    { id: 'electronics', name: 'Electronics', count: 0 },
    { id: 'kitchen', name: 'Kitchen', count: 0 },
    { id: 'camping', name: 'Camping', count: 0 },
    { id: 'sports', name: 'Sports', count: 0 },
    { id: 'books', name: 'Books', count: 0 },
    { id: 'party', name: 'Party Supplies', count: 0 },
    { id: 'clothing', name: 'Clothing', count: 0 },
    { id: 'furniture', name: 'Furniture', count: 0 },
    { id: 'other', name: 'Other', count: 0 },
  ];

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/forum?t=' + new Date().getTime());
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return posts.length;
    return posts.filter(post => post.category?.toLowerCase() === categoryId).length;
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          category: selectedCategory !== 'all' ? selectedCategory : 'general'
        }),
      });

      if (response.ok) {
        toast.success('Post created successfully!');
        setTitle('');
        setContent('');
        setSelectedCategory('all');
        setShowCreateForm(false);
        fetchPosts();
      } else {
        toast.error('Error creating post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post');
    }
  };

  const handleUpvote = async (postId) => {
    if (!token) {
      toast.error('Please log in to upvote posts');
      return;
    }
    try {
      const response = await fetch(`/api/forum/${postId}/upvote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setPosts(prevPosts => prevPosts.map(post => post._id === postId ? result.post : post));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error updating vote');
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      toast.error('Error updating vote');
    }
  };

  const handleBookmark = async (postId) => {
    if (!token) {
      toast.error('Please log in to bookmark posts');
      return;
    }
    try {
      const response = await fetch(`/api/forum/${postId}/bookmark`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setPosts(prevPosts => prevPosts.map(post => post._id === postId ? result.post : post));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error updating bookmark');
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Error updating bookmark');
    }
  };

  const handleShare = async (postId, postTitle) => {
    const postUrl = `${window.location.origin}/forum/${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: postTitle, text: `Check out this post: ${postTitle}`, url: postUrl });
      } catch (error) { console.error('Error sharing:', error); }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        prompt('Copy this link:', postUrl);
      }
    }
  };

  const toggleComments = async (postId) => {
    if (!expandedComments[postId]) {
      try {
        const response = await fetch(`/api/forum/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPostComments(prev => ({
            ...prev,
            [postId]: Array.isArray(data.comments) ? data.comments : []
          }));
        }
      } catch (error) { console.error('Error fetching comments:', error); }
    }
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId, postTitle) => {
    const commentText = commentTexts[postId];
    if (!commentText?.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    if (!token) {
      toast.error('Please log in to comment');
      return;
    }
    try {
      const response = await fetch(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        setPostComments(prev => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])]
        }));
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId
              ? { ...post, comments: (Array.isArray(post.comments) ? post.comments.length : (typeof post.comments === 'number' ? post.comments : 0)) + 1 }
              : post
          )
        );
        toast.success('Comment added successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error adding comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category?.toLowerCase() === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingPosts = [...posts]
    .sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[100px]"></div>
      </div>

      <header className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs">Neighborhood</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Request Here</h1>
            <p className="text-slate-500 max-w-xl font-medium">Post what you need, find what you're looking for, or lend a helping hand to a neighbor.</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200 active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Request
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Filter size={16} />
                </div>
                <h3 className="font-bold text-slate-800">Categories</h3>
              </div>
              <div className="space-y-1.5">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-left transition-all font-semibold text-sm group ${selectedCategory === category.id
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'hover:bg-slate-50 text-slate-600'
                      }`}
                  >
                    <span>{category.name}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] ${selectedCategory === category.id ? 'bg-white/20' : 'bg-slate-100'
                      }`}>
                      {getCategoryCount(category.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 p-8 shadow-2xl group">
              {/* Premium Background Layer */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-emerald-600/30 transition-colors"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                    <TrendingUp size={16} />
                  </div>
                  <h3 className="font-bold text-white tracking-tight">Urgent Needs</h3>
                </div>

                <div className="space-y-6">
                  {trendingPosts.map((post) => (
                    <div key={post._id} className="group/item cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover/item:text-white transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/item:text-slate-400 transition-colors">
                            <Heart className="w-3 h-3 mr-1.5" />
                            <span>{Array.isArray(post.upvotes) ? post.upvotes.length : post.upvotes || 0} Supporters</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-8 w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                  View All Urgent
                </button>
              </div>
            </div>
          </aside>

          {/* Feed */}
          <section className="lg:col-span-9">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-3">
                {selectedCategory === 'all' ? 'Activity Feed' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="text-slate-300 font-bold">/ {getCategoryCount(selectedCategory)}</span>
              </h2>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <MessageSquare size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">The hub is quiet.</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Be the first to request an item in this category.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
                >
                  Create New Post
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100 overflow-hidden group"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-bold uppercase shadow-inner group-hover:scale-110 transition-transform">
                            {post.author?.name?.charAt(0) || <User size={20} />}
                          </div>
                          <div>
                            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400">
                              <span className="text-slate-900">{post.author?.name || 'Neighbor'}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
                          {post.category || 'general'}
                        </span>
                      </div>

                      <div className="pl-0 md:pl-16">
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">{post.content}</p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-2 md:gap-6">
                            <button
                              onClick={() => handleUpvote(post._id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${(Array.isArray(post.upvotes) ? post.upvotes : []).some(user => user._id === userData?._id)
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                }`}
                            >
                              <Heart size={18} className={(Array.isArray(post.upvotes) ? post.upvotes : []).some(user => user._id === userData?._id) ? 'fill-current' : ''} />
                              <span>{Array.isArray(post.upvotes) ? post.upvotes.length : post.upvotes || 0}</span>
                            </button>

                            <button
                              onClick={() => toggleComments(post._id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${expandedComments[post._id] ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                              <MessageCircle size={18} />
                              <span>{(Array.isArray(post.comments) ? post.comments.length : post.comments) || 0}</span>
                            </button>

                            <button
                              onClick={() => handleShare(post._id, post.title)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-bold text-sm"
                            >
                              <Share2 size={18} />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleBookmark(post._id)}
                            className={`p-2 rounded-xl transition-all ${(Array.isArray(post.bookmarks) ? post.bookmarks : []).some(user => user._id === userData?._id) ? 'text-orange-500 bg-orange-50' : 'text-slate-300 hover:text-orange-500 hover:bg-orange-50'}`}
                          >
                            <Bookmark className={(Array.isArray(post.bookmarks) ? post.bookmarks : []).some(user => user._id === userData?._id) ? 'fill-current' : ''} />
                          </button>
                        </div>

                        {expandedComments[post._id] && (
                          <div className="mt-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {userData?.name?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1 relative">
                                <textarea
                                  value={commentTexts[post._id] || ''}
                                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                                  placeholder="Offer help or ask a question..."
                                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium resize-none min-h-[100px]"
                                />
                                <button
                                  onClick={() => handleAddComment(post._id, post.title)}
                                  className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                                >
                                  <Send size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4 pt-4">
                              {postComments[post._id]?.map((comment) => (
                                <div key={comment._id} className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 uppercase">
                                    {comment.author?.name?.charAt(0) || 'A'}
                                  </div>
                                  <div className="flex-1 bg-slate-50 rounded-[1.5rem] p-5">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-bold text-sm text-slate-900">{comment.author?.name || 'Anonymous'}</span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {showCreateForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-in fade-in">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="relative p-10">
              <button onClick={() => setShowCreateForm(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                <X size={24} />
              </button>
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 mb-2">New Community Request</h2>
                <p className="text-slate-500 font-medium">Be specific to help your neighbors find what you need.</p>
              </div>
              <form onSubmit={handlePostSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">What do you need?</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Heavy-duty Pressure Washer" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 font-bold text-slate-900" autoFocus />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 font-bold text-slate-900">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Privacy</label>
                    <div className="w-full px-6 py-4 bg-slate-50 rounded-2xl flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <ShieldCheck size={16} /> Verified Neighbors Only
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Details & Duration</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe what you're using it for..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 font-medium text-slate-600 min-h-[150px] resize-none" />
                </div>
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 px-8 py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200">Discard</button>
                  <button type="submit" className="flex-1 px-8 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100">Post Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;