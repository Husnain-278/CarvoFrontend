import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const PaymentSuccessPage = () => {
  const isFromStripe = localStorage.getItem("stripe_redirect") === "true";

  useEffect(() => {
    if (isFromStripe) {
      // Clear the redirect flag
      localStorage.removeItem("stripe_redirect");
    }
  }, [isFromStripe]);

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

        {/* Success Message */}
        {isFromStripe && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-emerald-400">Payment Successful!</h1>
            <p className="text-slate-300 text-sm">
              Your rental has been confirmed and is now active.
            </p>
            <p className="text-slate-500 text-xs">You'll receive a confirmation email shortly.</p>
            <Link
              to="/my-rentals"
              className="mt-4 px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition"
            >
              My Rentals
            </Link>
          </>
        )}
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
