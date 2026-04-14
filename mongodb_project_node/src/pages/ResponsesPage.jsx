import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://mongodb-response-sheet.onrender.com";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "gender", label: "Gender" },
  { key: "studies", label: "Studies" },
  { key: "age", label: "Age" },
  { key: "schoolName", label: "School Name" },
  { key: "collegeName", label: "College Name" },
];

export default function ResponsesPage({ onEdit, onDeleteSuccess, showToast }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", dir: "desc" });

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/responses`); // ✅ Fixed
      setResponses(res.data.data);
    } catch (err) {
      showToast("Failed to load responses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResponses(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/responses/${id}`); // ✅ Fixed
      setResponses((prev) => prev.filter((r) => r._id !== id));
      setDeleteId(null);
      onDeleteSuccess();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const filtered = responses
    .filter((r) =>
      Object.values(r).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      const av = a[sortConfig.key] ?? "";
      const bv = b[sortConfig.key] ?? "";
      return sortConfig.dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  return (
    <div className="responses-page">
      <div className="responses-toolbar">
        <div className="toolbar-left">
          <h2>📊 Response Sheet</h2>
          <span className="count-badge">{filtered.length} response{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search responses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch("")}>✕</button>}
          </div>
          <button className="btn-refresh" onClick={fetchResponses}>↻ Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading responses…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>{search ? "No matching results" : "No responses yet"}</h3>
          <p>{search ? "Try a different search term." : "Submit the first response using the form!"}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="response-table">
            <thead>
              <tr>
                <th className="col-num">#</th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`sortable ${sortConfig.key === col.key ? "sorted" : ""}`}
                  >
                    {col.label}
                    <span className="sort-icon">
                      {sortConfig.key === col.key
                        ? sortConfig.dir === "asc" ? " ▲" : " ▼"
                        : " ⇅"}
                    </span>
                  </th>
                ))}
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row._id} className="table-row">
                  <td className="col-num">{i + 1}</td>
                  <td className="td-name">
                    <span className="avatar">{row.name?.charAt(0).toUpperCase()}</span>
                    {row.name}
                  </td>
                  <td>
                    <span className={`gender-badge gender-${row.gender?.toLowerCase().replace(/\s+/g, "-")}`}>
                      {row.gender}
                    </span>
                  </td>
                  <td>{row.studies}</td>
                  <td className="td-age">{row.age}</td>
                  <td>{row.schoolName}</td>
                  <td>{row.collegeName}</td>
                  <td className="col-actions">
                    <button className="btn-edit" onClick={() => onEdit(row)} title="Edit">✏️</button>
                    <button className="btn-delete" onClick={() => setDeleteId(row._id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>Delete Response?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}