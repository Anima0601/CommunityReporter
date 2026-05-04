import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import ReportCard from '../components/ReportCard';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      const userReports = response.data.filter(r => r.userId === user.id);
      setReports(userReports);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center pb-16">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 mb-10 w-full max-w-[800px] flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-brand-primary to-lime-500">{user.name}</h2>
          <p className="text-slate-600 font-medium">{user.email}</p>
          <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider">
            {user.role}
          </span>
        </div>
        <div className="w-24 h-24 rounded-full bg-brand-primary text-white flex items-center justify-center text-4xl font-bold shadow-inner">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="w-full max-w-[600px]">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">My Reports</h3>
        {loading ? (
          <div className="text-center text-slate-500 py-10 font-medium">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center text-slate-500 font-medium">
            You haven't submitted any reports yet.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} fetchReports={fetchReports} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
