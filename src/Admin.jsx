import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3001/products";
const empty = { name: "", price: "", description: "", image: "", count: "" };

function Admin({ setIsAdmin }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const getProducts = () => {
    axios
      .get(API)
      .then((res) => setProducts(res.data))
      .catch((err) => showToast("Can't load data: " + err.message));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // one handler for all inputs (input name = form key)
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setForm(empty);
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
      count: item.count,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(empty);
    setEditId(null);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.description || !form.image || !form.count) {
      showToast("⚠️ Please fill the all fields");
      return;
    }
    const product = {
      ...form,
      price: Number(form.price),
      count: Number(form.count),
    };

    if (editId === null) {
      axios
        .post(API, product)
        .then(() => {
          getProducts();
          closeModal();
          showToast("✅ Product added");
        })
        .catch((err) => showToast("Add error: " + err.message));
    } else {
      axios
        .put(`${API}/${editId}`, product)
        .then(() => {
          getProducts();
          closeModal();
          showToast("✏️ Product updated");
        })
        .catch((err) => showToast("Update error: " + err.message));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Can we delete")) return;
    axios
      .delete(`${API}/${id}`)
      .then(() => {
        getProducts();
        showToast("🗑️ Product deleted");
      })
      .catch((err) => showToast("Delete error: " + err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    navigate("/login");
  };

  // dashboard numbers
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.count, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.count, 0);
  const lowStock = products.filter((p) => p.count <= 5).length;
  const maxCount = Math.max(...products.map((p) => p.count), 1);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="top">
        <div>
          <h2>Dashboard</h2>
          <p className="sub">Welcome back, Admin 👋</p>
        </div>
        <div>
          <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
          <button className="btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat s1"><span>📦</span><h3>{totalProducts}</h3><p>Total Products</p></div>
        <div className="stat s2"><span>🗃️</span><h3>{totalStock}</h3><p>Total Stock</p></div>
        <div className="stat s3"><span>💰</span><h3>₹{totalValue.toLocaleString("en-IN")}</h3><p>Inventory Value</p></div>
        <div className="stat s4"><span>⚠️</span><h3>{lowStock}</h3><p>Low / Out of Stock</p></div>
      </div>

      {/* Stock chart */}
      <div className="panel">
        <h3>Stock Overview</h3>
        {products.slice(0, 6).map((p) => (
          <div className="bar-row" key={p.id}>
            <span className="bar-name">{p.name}</span>
            <div className="bar-track">
              <div
                className={`bar-fill ${p.count <= 5 ? "low" : ""}`}
                style={{ width: `${(p.count / maxCount) * 100}%` }}
              ></div>
            </div>
            <span className="bar-val">{p.count}</span>
          </div>
        ))}
        {products.length === 0 && <p className="empty">No data</p>}
      </div>

      {/* Table */}
      <div className="panel">
        <div className="panel-top">
          <h3>All Products</h3>
          <input
            className="table-search"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7">No products found</td></tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td><img src={item.image} alt={item.name} /></td>
                    <td className="bold">{item.name}</td>
                    <td>₹{item.price}</td>
                    <td className="left">{item.description}</td>
                    <td>
                      <span className={`pill ${item.count === 0 ? "red" : item.count <= 5 ? "orange" : "green"}`}>
                        {item.count === 0 ? "Out of Stock" : item.count}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editId === null ? "Add New Product" : "Edit Product"}</h3>
            <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
            <input name="count" type="number" placeholder="Stock count" value={form.count} onChange={handleChange} />
            <div className="modal-btns">
              <button className="btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit}>
                {editId === null ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Admin;