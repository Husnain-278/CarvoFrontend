import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-yellow-400">Payment Cancelled</h1>
        <p className="text-slate-300 text-sm">
          You cancelled the PayPal payment. Your booking has not been confirmed.
        </p>
        <p className="text-slate-500 text-xs">
          No charges were made. You can try again anytime.
        </p>
        <Link
          to="/"
          className="mt-4 px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition"
        >
          Back to cars
        </Link>
      </main>
    </div>
  );
};

export default PaymentCancelPage;
