import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const { signup } = useAuthStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      nav("/");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8">Join and start chatting</p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Username"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="email" placeholder="Email"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password" placeholder="Password"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition">
            Sign Up
          </button>
        </form>
        <p className="text-slate-400 text-center mt-6 text-sm">
          Already have account? <Link to="/login" className="text-violet-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
