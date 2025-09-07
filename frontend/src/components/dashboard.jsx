import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock API calls (replace with real API integration)
const fetchAgentProperties = async () =>{
    const response = await fetch('https://real-estate-app-backend-g38w.onrender.com/api/agent-properties',{credentials:"include"});
    if (!response.ok) {
        throw new Error('Failed to fetch agent properties');
    }
    return response.json();
}
const fetchSiteVisitRequests = async () => {
    const response = await fetch('https://real-estate-app-backend-g38w.onrender.com/api/agent-appointments',{credentials:"include"});
    if (!response.ok) {
        throw new Error('Failed to fetch site visit requests');
    }
    return response.json();
};
const acceptRequest = async (id) => {/* API call */};
const rejectRequest = async (id) => {/* API call */};

export default function AgentDashboard() {
    const [properties, setProperties] = useState([]);
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    const [reFetch, setReFetch] = useState(false);
    useEffect(() => {
        fetch('https://real-estate-app-backend-g38w.onrender.com/api/protected',{credentials:"include"}).then(response => {
            if (response.status !== 200) {
                navigate('/signin');
                return;
            }
            response.json().then(data => {
                if (data.role !== 'AGENT') {
                    navigate('/');
                }
            });
        }).catch(() => {
            navigate('/signin');
        });
        fetchAgentProperties().then(setProperties);
        fetchSiteVisitRequests().then(setRequests);
    }, [reFetch]);

    const handleAccept = (id) => {
        acceptRequest(id);
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
        fetch(`https://real-estate-app-backend-g38w.onrender.com/api/agent-appointments/${id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'accepted' })    
        }).then(() => {
            setReFetch(!reFetch);
        });
    };

    const handleReject = (id) => {
        rejectRequest(id);
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
         fetch(`https://real-estate-app-backend-g38w.onrender.com/api/agent-appointments/${id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'rejected' })
        }).then(() => {
            setReFetch(!reFetch);
        }); 
    };

    return (
        <div className="pt-20 px-8 bg-gray-900 min-h-screen text-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-100">Agent Dashboard</h2>
            <section className="mb-12 bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-200">Your Listed Properties</h3>
                    <button
                        onClick={() => navigate('/add-property')}
                        className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                    >
                        List New Property
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {properties.map(p => (
                        <div key={p.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col group">
                            <div className="overflow-hidden">
                                <img
                                    src={p.images || "https://via.placeholder.com/400x250?text=No+Image"}
                                    alt={p.title}
                                    className="h-48 w-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <h4 className="text-lg font-bold text-gray-100 mb-2">{p.title}</h4>
                                <p className="text-gray-400 mb-1">{p.location}</p>
                                <p className="text-blue-400 font-semibold mb-2">{p.price}</p>
                                <button
                                    onClick={() => navigate(`/property/${p._id}`)}
                                    className="mt-auto px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">Site Visit Requests</h3>
                <ul>
                    {requests.map(r => (
                        <li key={r.id} className="mb-4 p-4 border border-gray-700 rounded flex flex-col md:flex-row md:items-center md:justify-between bg-gray-900">
                            <div>
                                <span className="font-medium text-gray-100">{r.user_id}</span>
                                <span className="mx-2 text-gray-400">requested to visit</span>
                                <span className="font-semibold text-blue-400">{r.property}</span>
                            </div>
                            <div className="flex items-center mt-2 md:mt-0">
                                <span className="mr-4 text-gray-400">
                                    Status: <em className={
                                        r.status === 'pending' ? 'text-yellow-400' :
                                        r.status === 'accepted' ? 'text-green-400' :
                                        'text-red-400'
                                    }>{r.status}</em>
                                </span>
                                {r.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleAccept(r._id)}
                                            className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 transition mr-2"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(r._id)}
                                            className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 transition"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
