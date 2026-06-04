import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchUserProfile } from "../store/features/authSlice";

const formatLabel = (key) =>
  String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return { type: "text", value: "Not provided" };
  }
  if (typeof value === "boolean") {
    return { type: "text", value: value ? "Yes" : "No" };
  }
  if (typeof value === "object") {
    return { type: "json", value: JSON.stringify(value, null, 2) };
  }
  return { type: "text", value: String(value) };
};

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, profileStatus, profileError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const profileEntries =
    profile && typeof profile === "object" ? Object.entries(profile) : [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Account</p>
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-slate-300 text-sm">
            This view shows every field returned by the profile endpoint.
          </p>
        </header>

        {profileStatus === "loading" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 animate-pulse">
            <div className="h-6 w-40 bg-slate-800 rounded mb-4" />
            <div className="grid gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-5 bg-slate-800 rounded" />
              ))}
            </div>
          </div>
        )}

        {profileStatus === "failed" && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-200">
            {String(profileError)}
          </div>
        )}

        {profileStatus === "succeeded" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            {profileEntries.length === 0 ? (
              <p className="text-sm text-slate-300">No profile data returned.</p>
            ) : (
              <div className="grid gap-4">
                {profileEntries.map(([key, value]) => {
                  const formatted = formatValue(value);
                  return (
                    <div
                      key={key}
                      className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4"
                    >
                      <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                        {formatLabel(key)}
                      </div>
                      {formatted.type === "json" ? (
                        <pre className="mt-2 text-xs text-slate-200 whitespace-pre-wrap break-words">
                          {formatted.value}
                        </pre>
                      ) : (
                        <p className="mt-2 text-sm text-white">{formatted.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default UserProfilePage;
