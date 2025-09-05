import { u } from 'framer-motion/client';
import React, { useEffect, useState } from 'react';

const AllProperties = () => {
    const [properties, setProperties] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [visitTime, setVisitTime] = useState("");
    const[refetch,setRefetch]=useState(false);
    useEffect(() => {

        fetch(`http://localhost:3000/api/appointments`, { credentials: 'include' }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch user data');
        }).then(userData => {
            console.log('User data:', userData);
            setAppointments(userData || []);
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });

        fetch('http://localhost:3000/api/properties', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setProperties(data);
                fetch('http://localhost:3000/api/wishlist', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setWishlist(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching wishlist:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching properties:', error);
            });
    }, [refetch]);

    const handleAddToWishlist = (id) => {
        fetch('http://localhost:3000/api/add-to-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ propertyId: id }),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    setWishlist(prev => [...prev, id]);
                    alert('Added to wishlist');
                } else {
                    alert('Failed to add to wishlist');
                }
                setRefetch(!refetch);
            })
            .catch(() => {
                alert('Error adding to wishlist');
            });
    };

    const openModal = (id) => {
        setSelectedPropertyId(id);
        setShowModal(true);
        setVisitTime("");
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPropertyId(null);
        setVisitTime("");
    };

    const handleMakeAppointment = () => {
       fetch(`http://localhost:3000/api/make-appointment`, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({ propertyId: selectedPropertyId, scheduledAt: visitTime }),
           credentials: 'include'
       })
           .then(response => {
               if (response.ok) {
                   alert(`Appointment requested for property ID: ${selectedPropertyId} at ${visitTime}`);
                   closeModal();
               } else {
                   alert('Failed to make appointment');
               }
               setRefetch(!refetch);
           })
           .catch(() => {
               alert('Error making appointment');
           });
    };

    return (
        <div className="pt-20 px-8 bg-gray-900 min-h-screen text-gray-100 relative">
            {/* Blur overlay when modal is open */}
            {showModal && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm pointer-events-none select-none"></div>
            )}
            <h2 className="text-3xl font-bold mb-8 text-gray-100">All Properties</h2>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${showModal ? "pointer-events-none select-none" : ""}`}>
                {properties.map((property) => {
                    const isInWishlist = wishlist.includes(property._id);
                    return (
                        <div
                            key={property._id}
                            className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col group"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={property.images || "https://via.placeholder.com/400x250?text=No+Image"}
                                    alt={property.title}
                                    className="h-48 w-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: "#1a2236" }}
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <h4 className="text-lg font-bold text-gray-100 mb-2">{property.title}</h4>
                                <p className="text-gray-400 mb-1">{property.location}</p>
                                <p className="text-blue-400 font-semibold mb-2">{property.price}</p>
                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => handleAddToWishlist(property._id)}
                                        disabled={isInWishlist}
                                        className={`px-3 py-2 rounded transition ${
                                            isInWishlist
                                                ? "bg-gray-800 text-blue-400 cursor-not-allowed"
                                                : "bg-blue-700 text-white hover:bg-blue-800"
                                        }`}
                                    >
                                        {isInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
                                    </button>
                                    <button
                                        onClick={() => openModal(property._id)}
                                        disabled={appointments.includes(property._id)}
                                        className={`px-3 py-2 rounded transition ${
                                            appointments.includes(property._id)
                                                ? "bg-gray-800 text-blue-400 cursor-not-allowed"
                                                : "bg-blue-700 text-white hover:bg-blue-800"
                                        }`}
                                    >
                                        {appointments.includes(property._id) ? "Appointment Requested" : "Make Appointment"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Modal on top, not blurred */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-md mx-auto text-gray-100 relative">
                        <h3 className="text-xl font-bold mb-4">Set Visit Time</h3>
                        <input
                            type="datetime-local"
                            value={visitTime}
                            onChange={e => setVisitTime(e.target.value)}
                            className="w-full p-2 mb-4 rounded bg-gray-900 text-gray-100 border border-gray-700"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMakeAppointment}
                                className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white"
                                disabled={!visitTime}
                            >
                                Make Visit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AllProperties;