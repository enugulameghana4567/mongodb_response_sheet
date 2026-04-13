import { useState, useEffect } from "react";
import FormPage from "./pages/FormPage";
import ResponsesPage from "./pages/ResponsesPage";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("form");
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <div>
              <h1>StudentForm</h1>
              <p>Response Management System</p>
            </div>
          </div>
          <nav className="nav">
            <button
              className={`nav-btn ${currentPage === "form" ? "active" : ""}`}
              onClick={() => { setCurrentPage("form"); setEditData(null); }}
            >
              + Submit Response
            </button>
            <button
              className={`nav-btn ${currentPage === "responses" ? "active" : ""}`}
              onClick={() => setCurrentPage("responses")}
            >
              📊 View Responses
            </button>
          </nav>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      {/* Pages */}
      <main className="main-content">
        {currentPage === "form" ? (
          <FormPage
            editData={editData}
            onSuccess={() => {
              showToast(editData ? "Response updated!" : "Response submitted successfully!");
              setEditData(null);
              setCurrentPage("responses");
            }}
          />
        ) : (
          <ResponsesPage
            onEdit={(data) => { setEditData(data); setCurrentPage("form"); }}
            onDeleteSuccess={() => showToast("Response deleted!")}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}
