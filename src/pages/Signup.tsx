import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-6">
        {success ? (
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-muted-foreground text-sm">We sent a confirmation link to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="w-full max-w-sm space-y-5">
            <h1 className="text-2xl font-bold text-center">Sign Up</h1>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
