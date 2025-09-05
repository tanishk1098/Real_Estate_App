import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// SignIn Component
const SignIn = ({ setIsSignup, setEmail, setPassword, email, password, role, setRole }) => {
  const navigate = useNavigate();
  const handleSignIn = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, role }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Sign-in failed:', response.statusText);
          return;
        }
        navigate('/'); // Redirect to home or dashboard after successful sign-in
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form className="space-y-4" onSubmit={handleSignIn}>
      <select
        className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="BUYER">Buyer</option>
        <option value="AGENT">Agent</option>
      </select>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
        type="submit"
      >
        Sign In
      </button>
    </form>
  );
};

// SignUp Component
const SignUp = ({
  setIsSignup,
  setEmail,
  setPassword,
  email,
  password,
  fullName,
  setFullName,
  role,
  setRole,
}) => {
  const navigate = useNavigate();
  const handleSignUp = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: fullName, email, password, role }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/'); // Redirect to home or dashboard after successful sign-up
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form className="space-y-4" onSubmit={handleSignUp}>
      <select
        className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="BUYER">Buyer</option>
        <option value="AGENT">Agent</option>
      </select>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
};

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');

  const handleToggle = () => {
    setIsSignup((prev) => !prev);
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
          {isSignup ? "Create Account" : "Sign In"}
        </h2>
        {isSignup ? (
          <SignUp
            setIsSignup={setIsSignup}
            setEmail={setEmail}
            setPassword={setPassword}
            email={email}
            password={password}
            fullName={fullName}
            setFullName={setFullName}
            role={role}
            setRole={setRole}
          />
        ) : (
          <SignIn
            setIsSignup={setIsSignup}
            setEmail={setEmail}
            setPassword={setPassword}
            email={email}
            password={password}
            role={role}
            setRole={setRole}
          />
        )}
        <p className="text-center text-gray-400 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={handleToggle}
            className="text-blue-400 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
