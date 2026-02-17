import { Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/60 border-b border-white/5">
      <Link to="/" className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg tracking-tight">sakn's edits</span>
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

      <a
        href="https://tiktok.com/@Uhsakn"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-primary px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        TikTok
      </a>
    </nav>
  );
};

export default Navbar;
