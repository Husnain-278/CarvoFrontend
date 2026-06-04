import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchUserRentals } from "../store/features/rentalSlice";

const statusStyles = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  completed: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const UserRentalsPage = () => {
  const dispatch = useDispatch();
  const { userRentals, userRentalsStatus, userRentalsError } = useSelector((state) => state.rental);

  useEffect(() => {
    dispatch(fetchUserRentals());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">History</p>
          <h1 className="text-3xl font-bold">Your Rentals</h1>
          <p className="text-slate-300 text-sm">Track every car you have booked with Carvo.</p>
        </header>

        {userRentalsStatus === "loading" && (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-24 rounded-2xl bg-slate-900/70 border border-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {userRentalsStatus === "failed" && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-200">
            {String(userRentalsError)}
          </div>
        )}

        {userRentalsStatus === "succeeded" && userRentals.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-6 text-slate-300">
            You have not booked any rentals yet.
          </div>
        )}

        {userRentalsStatus === "succeeded" && userRentals.length > 0 && (
          <div className="grid gap-4">
            {userRentals.map((rental) => (
              <article
                key={rental.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">{rental.car_name}</h2>
                  <div className="text-sm text-slate-300">
                    {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                  </div>
                  <div className="text-xs text-slate-400">Total: ${rental.total_price}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs uppercase tracking-[0.2em] border px-3 py-1 rounded-full ${
                      statusStyles[rental.status] || "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {rental.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserRentalsPage;
