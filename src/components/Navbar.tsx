import { Sparkles, User as UserIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/60 border-b border-white/5">
      <Link to="/" className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg tracking-tight">sakn's clips</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <Link
          to="/"
          className={`transition-colors ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Home
        </Link>
        <Link
          to="/tools"
          className={`transition-colors ${location.pathname === "/tools" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Tools
        </Link>
      </div>

      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <Link
              to="/profile"
              className="btn-ocean inline-flex items-center gap-1.5 rounded-md border border-primary px-4 py-1.5 font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-ocean rounded-md border border-primary px-4 py-1.5 font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
