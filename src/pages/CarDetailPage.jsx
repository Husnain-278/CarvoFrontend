import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchCarDetail, bookAndPay, resetBooking, fetchBranchList } from "../store/features/rentalSlice";

const cloudinaryBase = import.meta.env.VITE_CLOUDINARY_BASE_URL || "";

/** Ensure a relative Cloudinary path is turned into an absolute HTTPS URL. */
const ensureCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("http")) return url;
  if (cloudinaryBase && url.includes("image/upload")) {
    const base = cloudinaryBase.endsWith("/") ? cloudinaryBase.slice(0, -1) : cloudinaryBase;
    const path = url.startsWith("/") ? url.slice(1) : url;
    return `${base}/${path}`;
  }
  return url;
};

/**
 * Inject a Cloudinary transformation string into an upload URL.
 * Skips non-Cloudinary URLs unchanged.
 */
const buildCloudinaryUrl = (rawUrl, transforms) => {
  const url = ensureCloudinaryUrl(rawUrl);
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  return url.includes("/upload/")
    ? url.replace("/upload/", `/upload/${transforms}/`)
    : url;
};

/**
 * Build hero srcSet entries across responsive breakpoints.
 * Each entry uses an explicit w + h to keep the 16:9 crop consistent.
 */
const HERO_WIDTHS = [640, 960, 1280, 1600];
const buildHeroSources = (rawUrl) => {
  const base = ensureCloudinaryUrl(rawUrl);
  const defaultWidth = 1280;
  const defaultHeight = Math.round(defaultWidth * 9 / 16);
  const defaultSrc =
    buildCloudinaryUrl(base, `f_auto,q_auto:good,c_fill,g_auto,w_${defaultWidth},h_${defaultHeight},dpr_1.0`) || base;
  const srcSet = HERO_WIDTHS.map((w) => {
    const h = Math.round(w * 9 / 16);
    return `${buildCloudinaryUrl(base, `f_auto,q_auto:good,c_fill,g_auto,w_${w},h_${h},dpr_1.0`) || base} ${w}w`;
  }).join(", ");
  return { defaultSrc, srcSet };
};

/** Build a retina-ready thumbnail URL (displays at 80×56, fetched at 160×112). */
const buildThumbUrl = (rawUrl) =>
  buildCloudinaryUrl(
    ensureCloudinaryUrl(rawUrl),
    "f_auto,q_auto:eco,c_fill,g_auto,w_160,h_112,dpr_auto"
  ) || ensureCloudinaryUrl(rawUrl);

const SPECS = [
  { label: "Brand", key: "brand", icon: "🏷️" },
  { label: "Model Year", key: "model_year", icon: "📅" },
  { label: "Type", key: "car_type", icon: "🚗" },
  { label: "Transmission", key: "transmission", icon: "⚙️" },
  { label: "Fuel Type", key: "fuel_type", icon: "⛽" },
  { label: "Fuel", key: "fuel", icon: "🧾" },
  { label: "Seats", key: "seats", icon: "💺" },
];

const formatSpecValue = (key, value) => {
  if (key === "fuel") {
    return value === "included" ? "Included in rental" : "Excluded in rental";
  }
  return String(value).replace(/_/g, " ");
};

const CarDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const {
    selectedCar: car,
    selectedCarStatus: status,
    selectedCarError: error,
    bookingStatus,
    bookingError,
    bookingResult,
    paypalApprovalUrl,
    branches,
    branchesStatus,
    branchesError,
  } = useSelector((state) => state.rental);

  const [activeImage, setActiveImage] = useState(0);
  const [step, setStep] = useState("dates"); // "dates" | "payment"
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropoffBranchId, setDropoffBranchId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const today = new Date().toISOString().split("T")[0];

  // Redirect to PayPal approval page when URL is available
  useEffect(() => {
    if (paypalApprovalUrl) {
      window.location.href = paypalApprovalUrl;
    }
  }, [paypalApprovalUrl]);

  // Compute number of days and estimated total
  const diffDays =
    startDate && endDate
      ? Math.max(0, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
      : 0;
  const estimatedTotal =
    diffDays > 0 && car?.price_per_day
      ? (diffDays * parseFloat(car.price_per_day)).toFixed(2)
      : null;

  const formValid =
    startDate &&
    endDate &&
    new Date(endDate) >= new Date(startDate) &&
    Boolean(dropoffBranchId);

  useEffect(() => {
    if (slug) {
      dispatch(fetchCarDetail(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    setActiveImage(0);
    setShowBookingForm(false);
    setStep("dates");
    setStartDate("");
    setEndDate("");
    setDropoffBranchId("");
    setPaymentMethod("cash");
    dispatch(resetBooking());
  }, [car?.id]);

  const handleOpenForm = () => {
    dispatch(resetBooking());
    setStartDate("");
    setEndDate("");
    setDropoffBranchId("");
    setPaymentMethod("cash");
    setStep("dates");
    setShowBookingForm(true);
  };

  const handleCancel = () => {
    setShowBookingForm(false);
    setStep("dates");
    setDropoffBranchId("");
    dispatch(resetBooking());
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formValid) return;
    setStep("payment");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid || !car) return;
    dispatch(
      bookAndPay({
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
        dropoff_branch_id: Number(dropoffBranchId),
        payment_method: paymentMethod,
      })
    );
  };

  const images = car?.images ?? [];
  const activeRawUrl = images[activeImage]?.image ?? null;
  const heroSources = activeRawUrl ? buildHeroSources(activeRawUrl) : null;
  const currentBranch = car?.current_branch ?? null;
  const pickupLabel = currentBranch
    ? [currentBranch.city, currentBranch.address].filter(Boolean).join(" · ")
    : "";
  const selectedDropoff = branches.find((branch) => String(branch.id) === String(dropoffBranchId));

  useEffect(() => {
    if (showBookingForm && branchesStatus === "idle") {
      dispatch(fetchBranchList());
    }
  }, [showBookingForm, branchesStatus, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition"
        >
          ← Back to all cars
        </Link>

        {/* Loading skeleton */}
        {status === "loading" && (
          <div className="space-y-6">
            <div className="h-72 md:h-96 rounded-3xl bg-slate-800/70 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 rounded-2xl bg-slate-800/70 animate-pulse" />
              <div className="h-48 rounded-2xl bg-slate-800/70 animate-pulse" />
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "failed" && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 text-red-200 px-5 py-4">
            {String(error)}
          </div>
        )}

        {/* Car detail */}
        {status === "succeeded" && car && (
          <div className="space-y-8">
            {/* Hero image + thumbnail gallery */}
            <section className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
              {heroSources ? (
                <img
                  key={heroSources.defaultSrc}
                  src={heroSources.defaultSrc}
                  srcSet={heroSources.srcSet}
                  sizes="(min-width: 1024px) 960px, (min-width: 640px) 100vw, 100vw"
                  alt={`${car.brand} ${car.name}`}
                  width={1280}
                  height={720}
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-72 md:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-72 md:h-96 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400">
                  No image available
                </div>
              )}

              {images.length > 1 && (
                <div className="flex gap-3 p-4 overflow-x-auto">
                  {images.map((img, idx) => {
                    const thumbUrl = buildThumbUrl(img.image);
                    return (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(idx)}
                        className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition ${
                          idx === activeImage
                            ? "border-emerald-400"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`View ${idx + 1}`}
                          width={160}
                          height={112}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Title + price + availability */}
            <section className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold">
                  {car.brand} {car.name}
                </h1>
                <p className="text-slate-400 text-sm">
                  {car.model_year} · {car.car_type} · {car.transmission}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span className="text-2xl font-bold text-emerald-400">
                  ${car.price_per_day}
                  <span className="text-base font-normal text-slate-400"> / day</span>
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full border font-medium ${
                    car.is_available
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : "bg-red-500/15 text-red-300 border-red-500/30"
                  }`}
                >
                  {car.is_available ? "Available" : "Unavailable"}
                </span>
              </div>
            </section>

            {/* Specs grid + description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specifications */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold">Specifications</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {SPECS.map(({ label, key, icon }) =>
                    car[key] != null ? (
                      <div key={key} className="space-y-0.5">
                        <dt className="text-xs text-slate-400 uppercase tracking-wide">
                          {icon} {label}
                        </dt>
                        <dd className="text-sm font-medium capitalize">
                          {formatSpecValue(key, car[key])}
                        </dd>
                      </div>
                    ) : null
                  )}
                </dl>
                {currentBranch && (currentBranch.city || currentBranch.address) && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Car Current Location</p>
                    <div className="text-sm text-slate-200 space-y-1">
                      {currentBranch.city && (
                        <p className="font-medium">{currentBranch.city}</p>
                      )}
                      {currentBranch.address && (
                        <p className="text-slate-400">{currentBranch.address}</p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Description */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold">Description</h2>
                {car.description ? (
                  <p className="text-slate-300 text-sm leading-relaxed">{car.description}</p>
                ) : (
                  <p className="text-slate-500 text-sm italic">No description provided.</p>
                )}
              </section>
            </div>

            {/* Book Now CTA */}
            <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl shadow-lg p-6 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-lg font-semibold">Ready to hit the road?</p>
                  <p className="text-slate-400 text-sm">
                    Book this car at ${car.price_per_day} per day. Pick your dates and confirm.
                  </p>
                </div>
                {!showBookingForm && (
                  <button
                    type="button"
                    onClick={handleOpenForm}
                    disabled={!car.is_available}
                    className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold text-base hover:bg-emerald-400 active:scale-95 transition disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    {car.is_available ? "Book Now" : "Unavailable"}
                  </button>
                )}
              </div>

              {/* ── Success (cash) ── */}
              {bookingStatus === "succeeded" && bookingResult && !bookingResult.approval_url && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 space-y-2">
                  <p className="text-emerald-300 font-semibold text-base">Booking confirmed! 🎉</p>
                  <p className="text-slate-300 text-sm">
                    <span className="font-medium">{bookingResult.rental?.car?.brand} {bookingResult.rental?.car?.name}</span>
                    {" · "}
                    <span className="font-medium">{bookingResult.rental?.start_date}</span>
                    {" → "}
                    <span className="font-medium">{bookingResult.rental?.end_date}</span>
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-slate-400">
                      Total:{" "}
                      <span className="text-emerald-400 font-bold">${bookingResult.rental?.total_price}</span>
                    </span>
                    <span className="text-slate-400">
                      Payment:{" "}
                      <span className="capitalize font-medium text-white">{bookingResult.payment?.payment_method}</span>
                    </span>
                    <span className="text-slate-400">
                      Status:{" "}
                      <span className="capitalize font-medium text-white">{bookingResult.rental?.status}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="mt-1 text-sm text-slate-400 hover:text-white transition underline underline-offset-2"
                  >
                    Book another date
                  </button>
                </div>
              )}

              {/* ── PayPal redirect pending ── */}
              {bookingStatus === "succeeded" && bookingResult?.approval_url && (
                <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 py-4 flex items-center gap-3 text-blue-200">
                  <svg className="animate-spin h-5 w-5 text-blue-300 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <span className="text-sm font-medium">Redirecting you to PayPal to complete payment…</span>
                </div>
              )}

              {/* ── Step 1: Date selection ── */}
              {showBookingForm && bookingStatus !== "succeeded" && step === "dates" && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Step 1 of 2 · Choose dates</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 uppercase tracking-wide" htmlFor="start_date">
                        Pick-up date
                      </label>
                      <input
                        id="start_date"
                        type="date"
                        min={today}
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          if (endDate && e.target.value > endDate) setEndDate("");
                        }}
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 uppercase tracking-wide" htmlFor="end_date">
                        Return date
                      </label>
                      <input
                        id="end_date"
                        type="date"
                        min={startDate || today}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 uppercase tracking-wide" htmlFor="pickup_location">
                        Pickup location
                      </label>
                      <input
                        id="pickup_location"
                        type="text"
                        value={pickupLabel || "Not set"}
                        disabled
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 uppercase tracking-wide" htmlFor="dropoff_branch">
                        Dropoff location
                      </label>
                      <select
                        id="dropoff_branch"
                        value={dropoffBranchId}
                        onChange={(e) => setDropoffBranchId(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select dropoff branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {[branch.city, branch.address].filter(Boolean).join(" · ")}
                          </option>
                        ))}
                      </select>
                      {branchesStatus === "loading" && (
                        <p className="text-xs text-slate-500">Loading branches…</p>
                      )}
                      {branchesStatus === "failed" && branchesError && (
                        <p className="text-xs text-red-300">{branchesError}</p>
                      )}
                    </div>
                  </div>

                  {estimatedTotal && (
                    <div className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {diffDays} day{diffDays !== 1 ? "s" : ""} × ${car.price_per_day}
                      </span>
                      <span className="text-emerald-400 font-bold text-base">${estimatedTotal}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={!formValid}
                      className="flex-1 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 active:scale-95 transition disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      Next: Choose Payment →
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* ── Step 2: Payment method ── */}
              {showBookingForm && bookingStatus !== "succeeded" && step === "payment" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Step 2 of 2 · Payment method</p>

                  {/* Booking summary */}
                  <div className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dates</span>
                      <span className="font-medium">{startDate} → {endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pickup</span>
                      <span className="font-medium">{pickupLabel || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dropoff</span>
                      <span className="font-medium">
                        {selectedDropoff
                          ? [selectedDropoff.city, selectedDropoff.address].filter(Boolean).join(" · ")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{diffDays} day{diffDays !== 1 ? "s" : ""} × ${car.price_per_day}</span>
                      <span className="text-emerald-400 font-bold">${estimatedTotal}</span>
                    </div>
                  </div>

                  {/* Payment method options */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Select payment method</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { value: "cash", label: "Cash", desc: "Pay on pickup / delivery", available: true },
                        { value: "paypal", label: "PayPal", desc: "Pay securely via PayPal", available: true },
                      ].map(({ value, label, desc, available }) => (
                        <label
                          key={value}
                          className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                            !available
                              ? "opacity-40 cursor-not-allowed border-slate-800 bg-slate-800/30"
                              : paymentMethod === value
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            value={value}
                            checked={paymentMethod === value}
                            onChange={() => setPaymentMethod(value)}
                            disabled={!available}
                            className="mt-0.5 accent-emerald-500"
                          />
                          <div>
                            <p className="font-semibold text-sm">{label}</p>
                            <p className="text-xs text-slate-400">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* API error */}
                  {bookingStatus === "failed" && bookingError && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
                      {bookingError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={bookingStatus === "loading"}
                      className="flex-1 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 active:scale-95 transition disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      {bookingStatus === "loading"
                        ? (paymentMethod === "paypal" ? "Redirecting to PayPal…" : "Confirming…")
                        : (paymentMethod === "paypal" ? "Pay with PayPal →" : "Confirm Booking")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStep("dates"); dispatch(resetBooking()); }}
                      className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition text-sm"
                    >
                      ← Back
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default CarDetailPage;
