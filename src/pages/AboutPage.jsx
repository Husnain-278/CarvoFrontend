import { CheckCircle2, Shield, Target, Users, Clock, Car } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every vehicle is inspected, sanitized, and tracked so you always feel secure on the road.",
  },
  {
    icon: Clock,
    title: "Always On Time",
    description: "Doorstep delivery, rapid pickups, and 24/7 support to keep your plans moving.",
  },
  {
    icon: Target,
    title: "Built Around You",
    description: "Flexible pricing, transparent policies, and cars that match your exact trip goals.",
  },
  {
    icon: Users,
    title: "People Powered",
    description: "A local team of specialists ready to help with routes, recommendations, and roadside assistance.",
  },
];

const stats = [
  { label: "Trips completed", value: "25K+" },
  { label: "Cities served", value: "18" },
  { label: "Avg. response", value: "< 5 min" },
  { label: "Fleet uptime", value: "99.7%" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-white">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-blue-400 font-semibold uppercase tracking-[0.2em] text-sm">About Carvo</p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                We make car rentals effortless, reliable, and built for every journey.
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Carvo blends a curated fleet with real-time support so you can focus on the road ahead. From weekend
                escapes to business marathons, our team keeps you moving with zero guesswork and no hidden fees.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-200">
                <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Verified, maintained fleet
                </span>
                <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Transparent pricing
                </span>
                <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
                  <CheckCircle2 size={18} className="text-green-400" />
                  24/7 human support
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  Browse cars
                </Link>
                <Link
                  to="/dashboard/"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold border border-gray-800 transition"
                >
                  Go to dashboard
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 via-slate-800 to-gray-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((item) => (
                  <div key={item.label} className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4">
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-gray-400 text-sm mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 bg-gray-900/70 border border-gray-800 rounded-2xl p-4">
                <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-300">
                  <Car size={24} />
                </div>
                <div>
                  <p className="font-semibold text-white">Premium fleet, local expertise</p>
                  <p className="text-gray-400 text-sm">From hybrids to SUVs, every ride is optimized for comfort and fuel efficiency.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/50 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <p className="text-blue-400 font-semibold uppercase tracking-[0.2em] text-sm">Our Mission</p>
                <h2 className="text-2xl md:text-3xl font-bold">Deliver confidence with every mile.</h2>
                <p className="text-gray-300 leading-relaxed">
                  We started Carvo to remove friction from car rentals. Today we partner with trusted local providers,
                  monitor fleet health in real time, and give you full control over your trip—from booking to drop-off.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {values.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="bg-gray-950 border border-gray-800 rounded-2xl p-5 space-y-2">
                    <Icon className="text-blue-300" size={22} />
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-gray-900 border border-gray-800 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <p className="text-blue-300 font-semibold">Ready for your next trip?</p>
              <h3 className="text-2xl md:text-3xl font-bold">Plan it with Carvo and get rolling in minutes.</h3>
              <p className="text-gray-300">Reserve online, choose your pickup, and our team will handle the rest.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                Start booking
              </Link>
              <Link
                to="/register/"
                className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold border border-gray-800 transition"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
