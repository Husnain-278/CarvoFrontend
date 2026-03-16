import { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { executePaypalPayment } from "../store/features/rentalSlice";
import Navbar from "../components/Navbar";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { bookingStatus, bookingError, bookingResult } = useSelector((s) => s.rental);
  const executed = useRef(false);

  // PayPal appends: ?paymentId=PAY-xxx&PayerID=yyy&token=zzz
  const paypalPaymentId = searchParams.get("paymentId");
  const payerId = searchParams.get("PayerID");

  useEffect(() => {
    if (paypalPaymentId && payerId && !executed.current) {
      executed.current = true;
      dispatch(executePaypalPayment({ paypal_payment_id: paypalPaymentId, payer_id: payerId }));
    }
  }, [dispatch, paypalPaymentId, payerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center text-center space-y-6">
        {/* Loading */}
        {bookingStatus === "loading" && (
          <>
            <svg
              className="animate-spin h-12 w-12 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-lg font-semibold text-slate-300">Confirming your payment…</p>
            <p className="text-slate-500 text-sm">Please wait while we verify your PayPal transaction.</p>
          </>
        )}

        {/* Success */}
        {bookingStatus === "succeeded" && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-emerald-400">Payment Successful!</h1>
            <p className="text-slate-300 text-sm">
              {bookingResult?.detail ?? "Your rental has been confirmed and is now active."}
            </p>
            <p className="text-slate-500 text-xs">You'll receive a confirmation email shortly.</p>
            <Link
              to="/"
              className="mt-4 px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition"
            >
              Browse more cars
            </Link>
          </>
        )}

        {/* Error */}
        {bookingStatus === "failed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-400">Payment Failed</h1>
            <p className="text-slate-300 text-sm">{bookingError}</p>
            <Link
              to="/"
              className="mt-4 px-8 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition"
            >
              Back to home
            </Link>
          </>
        )}

        {/* Fallback (no params) */}
        {!paypalPaymentId && bookingStatus === "idle" && (
          <>
            <p className="text-slate-400 text-sm">No payment information found.</p>
            <Link to="/" className="text-emerald-400 hover:underline text-sm">
              Go home
            </Link>
          </>
        )}
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
