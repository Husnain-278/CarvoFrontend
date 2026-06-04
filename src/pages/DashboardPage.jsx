import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Dashboard</p>
          <h1 className="text-3xl font-bold">Welcome back to Carvo</h1>
          <p className="text-slate-300 text-sm">Manage your bookings and account details in one place.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Profile snapshot</h2>
            <p className="text-sm text-slate-300">
              Keep your contact information up to date so we can reach you quickly about your rentals.
            </p>
            <Link
              to="/profile/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-600 transition"
            >
              View profile
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-linear-to-br from-emerald-500/10 via-slate-900/70 to-slate-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Recent rentals</h2>
            <p className="text-sm text-slate-300">
              Track the status of each booking and keep receipts handy for your next trip.
            </p>
            <Link
              to="/my-rentals/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-emerald-500/60 text-emerald-200 hover:text-white hover:border-emerald-400 transition"
            >
              View rentals
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold mb-2">Ready for another ride?</h2>
          <p className="text-sm text-slate-300 mb-4">Browse the latest cars and start a new booking in minutes.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:border-emerald-500/50 border border-slate-700 transition"
          >
            Browse cars
          </Link>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;