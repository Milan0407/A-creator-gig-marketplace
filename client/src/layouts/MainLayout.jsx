import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-100 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p><span className="font-bold text-slate-900">Creator<span className="text-indigo-600">Gig</span></span> · AI-powered creator marketplace</p><p>Built for the Creator Economy hackathon</p></div></footer>
    </div>
  );
};

export default MainLayout;
