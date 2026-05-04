import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMessageSquare, FiHeart, FiSend, FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ReportCard = ({ report, fetchReports }) => {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const hasUpvoted = user && report.upvoters?.some(v => v.id === user.id);

  const handleUpvote = async () => {
    if (!user) return toast.error("Please login to like this post");
    try {
      await api.post(`/reports/${report.id}/upvote`);
      if (fetchReports) fetchReports(); // Refresh the feed
    } catch (error) {
      toast.error("Failed to like");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to comment");
    if (!commentText.trim()) return;
    
    try {
      await api.post('/comments', { reportId: report.id, text: commentText });
      setCommentText('');
      if (fetchReports) fetchReports();
      toast.success('Comment posted');
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await api.delete(`/reports/${report.id}`);
      if (fetchReports) fetchReports();
      toast.success('Report deleted');
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  const canDelete = user && (user.id === report.userId || user.role === 'admin');

  // Map status to dynamic tailwind badge classes
  const getBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-inner">
            {report.author?.name ? report.author.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 m-0 leading-tight">{report.author?.name || 'Unknown User'}</h4>
            <span className="text-slate-500 text-xs font-medium flex items-center gap-1 mt-0.5">
              {new Date(report.createdAt).toLocaleDateString()} • <FiMapPin className="inline" /> {report.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeClass(report.status)}`}>
            {report.status}
          </span>
          {canDelete && (
            <button 
              onClick={handleDelete} 
              className="text-red-400 hover:text-red-600 transition-colors p-1"
              title="Delete Post"
            >
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-800 mb-2 leading-snug">
          <Link to={`/reports/${report.id}`} className="hover:text-brand-primary transition-colors">
            {report.title}
          </Link>
        </h3>
        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* Image */}
      {report.imageUrl && (
        <img src={report.imageUrl} alt={report.title} className="w-full max-h-[500px] object-cover" />
      )}

      {/* Actions */}
      <div className={`px-5 py-4 flex gap-6 ${report.imageUrl ? '' : 'border-t border-slate-100'} border-b border-slate-100`}>
        <button 
          onClick={handleUpvote} 
          className={`flex items-center gap-2 font-semibold transition-colors ${hasUpvoted ? 'text-red-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <FiHeart className={hasUpvoted ? 'fill-red-500' : ''} size={20} /> 
          {report.upvoters ? report.upvoters.length : 0} Likes
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <FiMessageSquare size={20} /> 
          {report.Comments ? report.Comments.length : 0} Comments
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-5 bg-slate-50">
          <div className="flex flex-col gap-3 mb-4 max-h-[300px] overflow-y-auto pr-2">
            {report.Comments && report.Comments.length > 0 ? (
              report.Comments.map(comment => (
                <div key={comment.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-1.5">
                    <strong className="text-sm font-semibold text-slate-800">{comment.author?.name || 'User'}</strong>
                    <span className="text-xs font-medium text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 m-0">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center py-4 bg-white rounded-xl border border-slate-200 border-dashed">No comments yet. Be the first to start the conversation!</p>
            )}
          </div>
          
          <form onSubmit={handleAddComment} className="flex gap-2 items-center mt-2">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 m-0 px-4 py-2.5 bg-white border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
            <button type="submit" className="flex items-center justify-center w-10 h-10 bg-brand-primary text-white rounded-full hover:bg-brand-hover transition-colors shadow-sm shrink-0 disabled:opacity-50" disabled={!commentText.trim()}>
              <FiSend size={16} className="ml-[-2px] mt-[2px]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
