import { useEffect, useState } from "react";
import axios from "axios";

type Slide = {
  image: string;
  slug: string;
};

export default function Banner() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  // забираємо перші 5 товарів‑картинок
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/?limit=5")
      .then((res) => {
        const picked = res.data.slice(0, 5).map((p: any) => ({
          image: p.image,
          slug: `/${p.slug}`,
        }));
        setSlides(picked);
      })
      .catch((err) => console.error("Couldn't load the banner:", err));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(id);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded">
        Loading…
      </div>
    );
  }

return (
  <div
    className="w-full h-64 overflow-hidden rounded"
  >
    <img
      src={slides[current].image}
      alt="Product banner"
      className="w-full h-full object-cover rounded"
    />
  </div>
);
}
