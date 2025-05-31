import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/candidates")
            .then((res) => setCandidates(res.data))
            .catch(() => alert("Failed to fetch data"));
    }, []);

    return (
        <div className="mt-10 bg-white shadow rounded p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Submitted Candidates</h2>

            {candidates.length === 0 ? (
                <p className="text-gray-500">No submissions yet.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {candidates.map((c) => (
                        <div key={c._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{c.fullName}</h3>
                                    <p className="text-gray-600 text-sm">{c.postAppliedFor}</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Exam Date: {new Date(c.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {c.passportImage && (
                                    <img
                                        src={`http://localhost:5000/uploads/${c.passportImage}`}
                                        alt="Passport"
                                        className="w-16 h-16 object-cover rounded-md border"
                                    />
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span
                                    className={`text-sm font-bold px-3 py-1 rounded-full ${c.fitStatus === "FIT"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {c.fitStatus}
                                </span>

                                <a
                                    href={c.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    View Report
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default Dashboard;
