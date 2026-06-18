import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
  const { login } = useAuthStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm">{error}</p>}
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
      <button
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <p className="text-slate-400 text-center mt-6">
        No account? <Link to="/signup" className="text-violet-400 hover:underline">Sign up</Link>
      </p>
    </form>
  );
}
