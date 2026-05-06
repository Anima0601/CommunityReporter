import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ReportCard from "../components/ReportCard";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col items-center pb-16">
      {/* Hero Section */}
      <section className="text-center w-full mb-10 pt-10 pb-12 bg-linear-to-b from-green-100 to-brand-bg rounded-3xl px-8 shadow-sm border border-green-50">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-br from-brand-primary to-lime-500">
          EcoReport Feed
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8 text-slate-600">
          Scroll through local issues, like, comment, and collaborate with
          neighbors to keep your community clean and green.
        </p>
        <Link
          to="/create-report"
          className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-full font-semibold text-lg hover:bg-brand-hover transition-colors shadow-md hover:shadow-lg gap-2"
        >
          Post an Issue <FiArrowRight />
        </Link>
      </section>

      {/* Feed Section */}
      <section className="w-full max-w-150">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-2xl font-bold text-slate-800 m-0">
            Community Feed
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-10 font-medium">
            Loading feed...
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center text-slate-500 py-10 font-medium bg-white rounded-2xl border border-slate-200 shadow-sm">
            No posts yet. Be the first to report!
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                fetchReports={fetchReports}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
