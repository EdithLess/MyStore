import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Header from './routes/Header';
import Home from "./routes/Home";
import Catalog from "./routes/Catalog";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Cart from "./routes/Cart";
import ProductPage from "./routes/ProductPage";
import CategoryPage from "./routes/CategoryPage";
import SearchResults from "./routes/SearchResults";
import About from "./routes/About";
import Contact from "./routes/Contact";

import './App.css';
import Footer from "./routes/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:slug" element={<ProductPage />} />
            <Route path="/categories/:categoryName" element={<CategoryPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
