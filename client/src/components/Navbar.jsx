import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useDemoUser } from "../context/useDemoUser.js";

const Navbar = () => {
  const { currentUser, identities, setCurrentUser } = useDemoUser();
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { to: "/marketplace", label: "Explore" },
    { to: "/post-gig", label: "Post a Gig" },
    { to: "/my-bookings", label: "My Bookings" },
    { to: "/creator-dashboard", label: "Creator Dashboard" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-[-0.05em] text-slate-950"
        >
          Creator<span className="text-indigo-600">Gig</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => <Link key={link.to} to={link.to} className="text-sm font-semibold text-slate-600 transition hover:text-indigo-600">{link.label}</Link>)}
        </nav>

        {/* Demo identity */}
        <label className="hidden items-center gap-2 text-xs text-gray-500 md:flex">
          Viewing as
          <select
            value={currentUser.email}
            onChange={(event) => setCurrentUser(identities.find((user) => user.email === event.target.value))}
            className="rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500"
            aria-label="Demo identity"
          >
            {identities.map((user) => (
              <option key={user.email} value={user.email}>{user.name} — {user.role}</option>
            ))}
          </select>
        </label>
        <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden" aria-label="Toggle navigation" aria-expanded={isOpen}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isOpen && <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden"><nav className="grid gap-1">{links.map((link) => <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">{link.label}</Link>)}</nav><label className="mt-3 grid gap-1 px-3 text-xs text-gray-500">Viewing as<select value={currentUser.email} onChange={(event) => setCurrentUser(identities.find((user) => user.email === event.target.value))} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none">{identities.map((user) => <option key={user.email} value={user.email}>{user.name} — {user.role}</option>)}</select></label></div>}
    </header>
  );
};

export default Navbar;
