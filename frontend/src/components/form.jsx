import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Example theme colors (replace with your actual theme if available)
const theme = {
    primary: "#1976d2",
    secondary: "#23272f", // dark card background
    accent: "#ff9800",
    border: "#444", // darker border
    text: "#f5f5f5", // light text
    inputBg: "#181a20", // dark input background
    pageBg: "linear-gradient(135deg, #181a20 0%, #23272f 100%)" // dark background
};

const initialState = {
    title: "",
    price: "",
    location: "",
    image: ""
};

const styles = {
    page: {
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.pageBg
    },
    form: {
        maxWidth: 400,
        width: "100%",
        margin: "0",
        padding: "2rem",
        background: theme.secondary,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        border: `1px solid ${theme.border}`,
        color: theme.text
    },
    heading: {
        color: theme.primary,
        marginBottom: "1.5rem",
        textAlign: "center"
    },
    group: {
        marginBottom: "1.2rem"
    },
    label: {
        display: "block",
        marginBottom: 6,
        fontWeight: 500,
        color: theme.text
    },
    input: {
        width: "100%",
        padding: "0.5rem",
        borderRadius: 4,
        border: `1px solid ${theme.border}`,
        background: theme.inputBg,
        fontSize: "1rem",
        color: theme.text
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        background: theme.primary,
        color: "#fff",
        border: "none",
        borderRadius: 4,
        fontWeight: 600,
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background 0.2s"
    }
};

export default function PropertyForm({ onSubmit }) {
    const navigate=useNavigate();
    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "image" ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(form);
        }
        setForm(initialState);
        fetch('https://real-estate-app-backend-g38w.onrender.com/api/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(form)
        }).then(response => {
            if (response.ok) {
                navigate('/dashboard');
            }
        });
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>Add Property</h2>
                <div style={styles.group}>
                    <label style={styles.label}>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.group}>
                    <label style={styles.label}>Price:</label>
                    <input
                        type="text"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="$2,50,000"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.group}>
                    <label style={styles.label}>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.group}>
                    <label style={styles.label}>Image:</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Add Property</button>
            </form>
        </div>
    );
}