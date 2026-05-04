import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, newStatus) => {
    setUpdating(reportId);
    try {
      await api.patch(`/admin/reports/${reportId}/status`, { status: newStatus });
      toast.success(`Report marked as ${newStatus}`);
      fetchReports();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to permanently delete this report?")) return;
    try {
      await api.delete(`/reports/${reportId}`);
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  const getBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) return <div className="text-center text-slate-500 py-10 font-medium">Loading dashboard...</div>;

  return (
    <div className="pb-16 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Admin Dashboard</h1>
      
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider font-bold">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-500">#{report.id}</td>
                  <td className="p-4 font-semibold text-slate-800">{report.title}</td>
                  <td className="p-4 text-slate-600">{report.author?.name || 'Unknown'}</td>
                  <td className="p-4 text-slate-500 text-sm">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeClass(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <select 
                        value={report.status}
                        onChange={(e) => handleUpdateStatus(report.id, e.target.value)}
                        disabled={updating === report.id}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <button 
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Delete Report"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    No reports found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
