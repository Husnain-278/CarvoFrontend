import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useSelector , useDispatch} from "react-redux";
import { logout } from "../store/features/authSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout=()=>{
      dispatch(logout())
      setIsOpen(false)
      navigate('/login')
  }
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-0 text-white font-semibold text-xl tracking-wide"
          >
            <img src="/logo.svg" alt="Carvo" className="w-8 h-8" />
            Carvo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-slate-300 font-medium">
            <Link
              to="/"
              className="hover:text-white transition duration-200"
            >
              Home
            </Link>

            <Link
              to="/about/"
              className="hover:text-white transition duration-200"
            >
              About
            </Link>

            {isAuthenticated ? (
              <button
                onClick={()=>handleLogout()}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition duration-200"
              >
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white transition"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-6 pb-6">
          <div className="flex flex-col gap-4 mt-4 text-slate-300 font-medium">

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition"
            >
              Home
            </Link>

            <Link
              to="/about/"
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition"
            >
              About
            </Link>

            {isAuthenticated ? (
              <button
                
                onClick={()=>handleLogout()}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition w-fit"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition w-fit"
              >
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
