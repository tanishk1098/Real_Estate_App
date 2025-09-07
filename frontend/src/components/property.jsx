import { nav } from 'framer-motion/client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Property = () => {
    const navigate=useNavigate();
    const { id} = useParams();
    const propertyId = id;
    // console.log(id);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        // Fetch property details
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://real-estate-app-backend-g38w.onrender.com/api/property/${propertyId}`, { credentials: 'include' });
                const data = await res.json();
                setProperty(data);
                setForm(data);
            } catch (err) {
                console.error('Failed to fetch property:', err);
            }
            setLoading(false);
        };
        fetchProperty();
    }, [propertyId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://real-estate-app-backend-g38w.onrender.com/api/property/${propertyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include'
            });
            if (res.ok) {
                const updated = await res.json();
                setProperty(updated);
                setEditing(false);
            }
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            const res = await fetch(`https://real-estate-app-backend-g38w.onrender.com/api/property/${propertyId}`, { method: 'DELETE' ,credentials: 'include'});
            if (res.ok) {
                // Redirect or show message
                alert('Property deleted');
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!property) return <div>Property not found.</div>;

    return (
        <div
            className="relative min-h-screen w-full flex justify-center items-center"
            style={{
                backgroundColor: "#111827",
                backgroundImage: property?.images
                    ? `linear-gradient(rgba(17,24,39,0.85), rgba(17,24,39,0.85)), url(${property.images})`
                    : "linear-gradient(rgba(17,24,39,0.95), rgba(17,24,39,0.95))",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                paddingTop: "64px", // height of navbar
            }}
        >
            {/* Decorative blurred image behind card */}
            {property?.images && (
                <img
                    src={property.images}
                    alt="Property"
                    className="absolute top-0 left-0 w-full h-full object-cover blur-lg opacity-40 z-0"
                    style={{ pointerEvents: "none" }}
                />
            )}
            <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-80 rounded-xl shadow-2xl p-8 text-gray-100 backdrop-blur-md border border-gray-700">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-400 drop-shadow-lg">Property Details</h2>
                {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium text-blue-300">Title:</label>
                            <input
                                name="title"
                                value={form.title || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-blue-300">Address:</label>
                            <input
                                name="address"
                                value={form.address || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-blue-300">Price:</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold shadow"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <p className="mb-2"><strong className="text-blue-300">Title:</strong> {property.title}</p>
                        <p className="mb-2"><strong className="text-blue-300">Address:</strong> {property.address}</p>
                        <p className="mb-6"><strong className="text-blue-300">Price:</strong> ${property.price}</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold ml-2 shadow"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Property;