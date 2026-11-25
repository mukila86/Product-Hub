import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3001/products";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  // search + sort
  let list = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div>
      <section className="hero">
        <h1>Discover <span>Amazing</span> Products</h1>
        <p>Best quality products at the best price</p>
        <div className="hero-search">
          <input
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </section>

      <div className="container">
        {loading ? (
          <p className="empty">Loading products...</p>
        ) : list.length === 0 ? (
          <p className="empty">No products found 😕</p>
        ) : (
          <div className="cards">
            {list.map((item) => (
              <div className="card" key={item.id}>
                <div className="card-img">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.target.src = "https://placehold.co/300x200?text=No+Image")}
                  />
                  {item.count === 0 && <span className="badge red">Out of Stock</span>}
                  {item.count > 0 && item.count <= 5 && (
                    <span className="badge orange">Only {item.count} left</span>
                  )}
                </div>
                <div className="card-body">
                  <h3>{item.name}</h3>
                  <p className="desc">{item.description}</p>
                  <div className="card-footer">
                    <span className="price">₹{item.price}</span>
                    <span className="stock">Stock: {item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;