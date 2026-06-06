import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchCars, setLastPage } from "../store/features/rentalSlice";

const cloudinaryBase = import.meta.env.VITE_CLOUDINARY_BASE_URL || "";

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

const buildCloudinaryUrl = (rawUrl, width, height) => {
  const url = ensureCloudinaryUrl(rawUrl);
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  const sizePart = height ? `w_${width},h_${height}` : `w_${width}`;
  const transformation = `f_auto,q_auto,c_fill,g_auto,${sizePart}`;
  return url.includes("/upload/")
    ? url.replace("/upload/", `/upload/${transformation}/`)
    : url;
};

const buildImageSources = (url) => {
  const widths = [480, 768, 1080];
  const defaultHeight = Math.round(768 * 9 / 16);
  const defaultSrc = buildCloudinaryUrl(url, 768, defaultHeight) || url;
  const srcSet = widths
    .map((width) => {
      const height = Math.round(width * 9 / 16);
      return `${buildCloudinaryUrl(url, width, height) || url} ${width}w`;
    })
    .join(", ");
  return { defaultSrc, srcSet };
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { cars, status, error, page, lastPage, totalPages } = useSelector((state) => state.rental);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [appliedFilters, setAppliedFilters] = useState({ startDate: "", endDate: "" });
  const [searchError, setSearchError] = useState("");
  const [isInitialMount, setIsInitialMount] = useState(true);
  const isResetDisabled = !appliedFilters.startDate && !appliedFilters.endDate;

  useEffect(() => {
    if (isInitialMount) {
      dispatch(fetchCars({ page: lastPage || 1 }));
      setIsInitialMount(false);
    }
  }, [dispatch, isInitialMount, lastPage]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    dispatch(setLastPage(nextPage));
    dispatch(fetchCars({ page: nextPage, ...appliedFilters }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!filters.startDate || !filters.endDate) {
      setSearchError("Please select both a start date and an end date.");
      return;
    }
    setSearchError("");
    setAppliedFilters(filters);
    dispatch(setLastPage(1));
    dispatch(fetchCars({ page: 1, ...filters }));
  };

  const handleReset = () => {
    const cleared = { startDate: "", endDate: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setSearchError("");
    dispatch(setLastPage(1));
    dispatch(fetchCars({ page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <section className="text-center space-y-4">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 text-sm font-semibold border border-emerald-500/30">Premium fleet · Curated for you</p>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Find your next drive with Carvo</h1>
            <p className="text-slate-300 max-w-2xl mx-auto">Browse a tailored selection of rides with responsive imagery and a sleek glassmorphism look that mirrors the auth pages.</p>
          </div>
        </section>

        <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-3xl p-6 md:p-8">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Available Cars</h2>
            </div>
            <div className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </div>
          </header>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900/70 to-slate-900/40 p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Search by rental dates</h3>
                  <p className="text-sm text-slate-300">Pick a start and end date to see cars available for your full trip.</p>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">Availability</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Start date
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  End date
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </label>
                <div className="flex flex-col md:flex-row md:items-end gap-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-4 py-2 text-sm md:px-5 md:py-2.5 md:text-base rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-600 transition"
                  >
                    Search availability
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isResetDisabled}
                    className="w-full md:w-auto px-4 py-2 text-sm md:px-5 md:py-2.5 md:text-base rounded-xl border border-slate-700 bg-slate-800/70 text-slate-200 hover:border-emerald-500/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-200 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400">Tip: results update after you press Search.</div>
              {searchError && (
                <div className="mt-3 text-sm text-red-300">{searchError}</div>
              )}
              {appliedFilters.startDate && appliedFilters.endDate && (
                <div className="mt-3 text-sm text-emerald-300">
                  Showing availability for {appliedFilters.startDate} to {appliedFilters.endDate}.
                </div>
              )}
            </div>
          </form>

          {status === "loading" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-2xl bg-slate-800/70 border border-slate-800 animate-pulse" />
              ))}
            </div>
          )}

          {status === "failed" && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3">{String(error)}</div>
          )}

          {status === "succeeded" && cars.length === 0 && (
            <div className="text-center text-slate-300">No cars available for the selected dates.</div>
          )}

          {cars.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => {
                const sources = car.image ? buildImageSources(car.image) : null;
                return (
                  <Link key={car.id} to={`/cars/${car.slug || car.id}`} className="group block focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl">
                    <article className="rounded-2xl border border-slate-800 bg-slate-800/70 backdrop-blur group-hover:-translate-y-1 transition transform shadow-lg overflow-hidden">
                      {car.image && sources ? (
                        <img
                          src={sources.defaultSrc}
                          srcSet={sources.srcSet}
                          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                          alt={`${car.brand} ${car.name}`}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400 text-sm">Image coming soon</div>
                      )}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold">{car.brand} {car.name}</h3>
                          <span className="text-sm px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">${car.price_per_day} / day</span>
                        </div>
                        <p className="text-slate-300 text-sm">{car.model_year} · {car.car_type} · {car.transmission}</p>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>Seats: {car.seats}</span>
                          <span className={car.is_available ? "text-emerald-400" : "text-red-400"}>
                            {car.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          <footer className="mt-8 flex flex-col items-center gap-3 text-center">
            <div className="text-slate-400 text-sm">Page {page} of {totalPages}</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || status === "loading"}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/70 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500/60 hover:text-white transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || status === "loading"}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default HomePage;