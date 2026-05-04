import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { FiMapPin, FiMessageSquare, FiHeart, FiSend, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const { user } = useContext(AuthContext);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error("Failed to fetch report", error);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleUpvote = async () => {
    if (!user) return toast.error("Please login to like this post");
    try {
      await api.post(`/reports/${id}/upvote`);
      fetchReport();
    } catch (error) {
      toast.error("Failed to process like");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to comment");
    if (!commentText.trim()) return;
    
    try {
      await api.post('/comments', { reportId: id, text: commentText });
      setCommentText('');
      fetchReport();
      toast.success('Comment added!');
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  if (loading) return <div className="text-center text-slate-500 py-10 font-medium">Loading report...</div>;
  if (!report) return <div className="text-center text-slate-500 py-10 font-medium">Report not found</div>;

  const getBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col items-center pb-16">
      <div className="w-full max-w-[800px]">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-hover font-medium mb-6 transition-colors">
          <FiArrowLeft /> Back to Feed
        </Link>
        
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-8">
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xl shadow-inner">
                {report.author?.name ? report.author.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg m-0">{report.author?.name || 'Unknown User'}</h4>
                <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                  {new Date(report.createdAt).toLocaleDateString()} • <FiMapPin /> {report.category}
                </span>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeClass(report.status)}`}>
              {report.status}
            </span>
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{report.title}</h1>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-lg">
              {report.description}
            </p>
          </div>

          {/* Image */}
          {report.imageUrl && (
            <img src={report.imageUrl} alt={report.title} className="w-full max-h-[600px] object-cover" />
          )}

          {/* Actions */}
          <div className="px-8 py-4 flex gap-8 border-y border-slate-100 bg-slate-50/50">
            <button onClick={handleUpvote} className="flex items-center gap-2 font-semibold text-slate-600 hover:text-red-500 transition-colors">
              <FiHeart size={24} /> {report.upvoters ? report.upvoters.length : 0} Likes
            </button>
            <div className="flex items-center gap-2 font-semibold text-slate-600">
              <FiMessageSquare size={24} /> {report.Comments ? report.Comments.length : 0} Comments
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Discussion</h3>
          
          <form onSubmit={handleAddComment} className="flex gap-4 items-start mb-8">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold shrink-0 shadow-inner">
              {user ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 flex flex-col items-end gap-2">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add to the discussion..."
                rows="3"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all resize-y"
              />
              <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2" disabled={!commentText.trim()}>
                <FiSend /> Post Comment
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-4">
            {report.Comments && report.Comments.length > 0 ? (
              report.Comments.map(comment => (
                <div key={comment.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-sm">
                        {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <strong className="text-sm font-bold text-slate-800">{comment.author?.name || 'User'}</strong>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 m-0 ml-11">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-6 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
