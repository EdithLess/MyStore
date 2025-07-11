import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-2xl font-bold text-white cursor-default">VictorSecret</div>

        <ul className="flex flex-wrap gap-4 items-center text-gray-300 font-medium">
          <li><Link to="/" className="hover:text-white transition">Home</Link></li>
          <li><Link to="/catalog" className="hover:text-white transition">Catalog</Link></li>
          <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          <li><Link to="/about" className="hover:text-white transition">About</Link></li>
          <li><Link to="/cart" className="hover:text-white transition text-xl" title="Cart">🛒</Link></li>
        </ul>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for 🔎"
            className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <ul className="flex gap-4 text-gray-300">
          {!isAuthenticated ? (
            <>
              <li><Link to="/register" className="hover:text-white">Register</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
            </>
          ) : (
            <li>
              <button onClick={logout} className="text-red-500 hover:text-white transition">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
