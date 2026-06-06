import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const PaymentCancelPage = () => {
  const isFromStripe = localStorage.getItem("stripe_redirect") === "true";
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => {
    if (isFromStripe) {
      // Clear the redirect flag
      localStorage.removeItem("stripe_redirect");
    }
  }, [isFromStripe]);

  useEffect(() => {
    if (isFromStripe && !canRetry) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanRetry(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFromStripe, canRetry]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center text-center space-y-6">
        {/* If not from Stripe redirect, show warning */}
        {!isFromStripe && (
          <>
            <p className="text-slate-400 text-sm">No payment information found.</p>
            <Link to="/" className="text-emerald-400 hover:underline text-sm">
              Go home
            </Link>
          </>
        )}

        {/* Payment Failed message - only show if from Stripe */}
        {isFromStripe && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-400">Payment Failed</h1>
            <p className="text-slate-300 text-sm">
              Your payment could not be processed. Your booking has not been confirmed.
            </p>
            <p className="text-slate-500 text-xs mt-3">
              You can try again to book the same car after <span className="text-yellow-400 font-semibold">{formatTime(countdown)}</span>
            </p>
            <p className="text-slate-500 text-xs">
              Other available cars can be booked instantly.
            </p>
            
            <div className="flex flex-col gap-4 w-full mt-6">
              <button
                disabled={!canRetry}
                className={`px-8 py-3 rounded-xl font-bold transition ${
                  canRetry
                    ? "bg-blue-500 text-white hover:bg-blue-400 cursor-pointer"
                    : "bg-slate-600 text-slate-400 cursor-not-allowed"
                }`}
              >
                {canRetry ? "Try Again" : `Try Again in ${formatTime(countdown)}`}
              </button>
              <Link
                to="/"
                className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition text-center"
              >
                Browse Cars
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PaymentCancelPage;
