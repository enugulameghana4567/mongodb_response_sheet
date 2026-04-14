import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://mongodb-response-sheet.onrender.com";

const initialState = {
  name: "",
  gender: "",
  studies: "",
  age: "",
  schoolName: "",
  collegeName: "",
};

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

export default function FormPage({ editData, onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        gender: editData.gender || "",
        studies: editData.studies || "",
        age: editData.age || "",
        schoolName: editData.schoolName || "",
        collegeName: editData.collegeName || "",
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
    setSubmitted(false);
  }, [editData]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.gender) errs.gender = "Please select a gender";
    if (!form.studies.trim()) errs.studies = "Field of studies is required";
    if (!form.age || form.age < 1 || form.age > 120) errs.age = "Enter a valid age (1–120)";
    if (!form.schoolName.trim()) errs.schoolName = "School name is required";
    if (!form.collegeName.trim()) errs.collegeName = "College name is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (editData?._id) {
        await axios.put(`${API}/api/responses/${editData._id}`, form); // ✅ Fixed
      } else {
        await axios.post(`${API}/api/responses`, form); // ✅ Fixed
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm(initialState);
        onSuccess();
      }, 1200);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm(initialState);
    setErrors({});
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header-bar" />
        <div className="form-title-block">
          <h2>{editData ? "✏️ Edit Response" : "Student Information Form"}</h2>
          <p>{editData ? "Update the details below." : "Please fill out all fields accurately."}</p>
          <span className="required-note">* Required</span>
        </div>

        {submitted && (
          <div className="success-banner">
            <span>🎉</span> {editData ? "Updated successfully!" : "Response recorded!"}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`field-group ${errors.name ? "has-error" : ""}`}>
            <label htmlFor="name">Full Name <span className="req">*</span></label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className={`field-group ${errors.gender ? "has-error" : ""}`}>
            <label>Gender <span className="req">*</span></label>
            <div className="radio-group">
              {genderOptions.map((opt) => (
                <label key={opt} className={`radio-option ${form.gender === opt ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="gender"
                    value={opt}
                    checked={form.gender === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {errors.gender && <span className="error-msg">{errors.gender}</span>}
          </div>

          <div className={`field-group ${errors.studies ? "has-error" : ""}`}>
            <label htmlFor="studies">Field of Studies <span className="req">*</span></label>
            <input
              id="studies"
              name="studies"
              type="text"
              placeholder="e.g., Computer Science, Commerce, Arts"
              value={form.studies}
              onChange={handleChange}
            />
            {errors.studies && <span className="error-msg">{errors.studies}</span>}
          </div>

          <div className={`field-group ${errors.age ? "has-error" : ""}`}>
            <label htmlFor="age">Age <span className="req">*</span></label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="Enter your age"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
            />
            {errors.age && <span className="error-msg">{errors.age}</span>}
          </div>

          <div className={`field-group ${errors.schoolName ? "has-error" : ""}`}>
            <label htmlFor="schoolName">School Name <span className="req">*</span></label>
            <input
              id="schoolName"
              name="schoolName"
              type="text"
              placeholder="Enter your school name"
              value={form.schoolName}
              onChange={handleChange}
            />
            {errors.schoolName && <span className="error-msg">{errors.schoolName}</span>}
          </div>

          <div className={`field-group ${errors.collegeName ? "has-error" : ""}`}>
            <label htmlFor="collegeName">College Name <span className="req">*</span></label>
            <input
              id="collegeName"
              name="collegeName"
              type="text"
              placeholder="Enter your college name"
              value={form.collegeName}
              onChange={handleChange}
            />
            {errors.collegeName && <span className="error-msg">{errors.collegeName}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Submitting…" : editData ? "Update Response" : "Submit"}
            </button>
            {!editData && (
              <button type="button" className="btn-clear" onClick={handleClear}>
                Clear Form
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}