import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import signupBg from "../assets/logo/forms.png";

const Signup: React.FC<{ setIsLoggedIn?: (v: boolean) => void }> = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const LOGO = "https://cdn-icons-png.flaticon.com/128/3183/3183463.png";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = { name: "", email: "", password: "" };
    if (!form.name) newErrors.name = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      const data = res.data;
      console.log("✅ Signup successful:", data);
      navigate("/login", { state: { email: form.email } });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Server error. Please try again.";
      console.error("❌ Signup failed:", msg);
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "13px 14px 13px 42px",
    background: "#ffffff",
    border: `1.5px solid ${hasError ? "#dc3545" : "#e0ddd6"}`,
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: "'Inter',sans-serif",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  return (
    <div style={{ backgroundImage: `url(${signupBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", minHeight: "100vh", flexDirection: "column" }}>
      {/* Navbar */}
      <div style={{ 
        width: "100%",
        padding: "20px 80px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "50px",
          padding: "10px 30px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "80%",
          boxSizing: "border-box",
          gap: "30px"
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <img src={LOGO} alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <span style={{ color: "#1f2937", fontSize: "15px", fontWeight: "700", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
              Recipe <span style={{ color: "#d97706" }}>Finder</span>
            </span>
          </Link>

          {/* Navigation Links - Center */}
          <div style={{ display: "flex", gap: "30px", alignItems: "center", margin: "0 auto" }}>
            <Link to="/home" style={{ 
              textDecoration: "none",
              color: "#6b7280", 
              fontSize: "13px", 
              fontWeight: "500", 
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")} 
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              <img src="https://cdn-icons-png.flaticon.com/128/747/747376.png" alt="Home" style={{ width: "16px", height: "16px" }} />
              Home
            </Link>

            <Link to="/favorites" style={{ 
              textDecoration: "none",
              color: "#6b7280", 
              fontSize: "13px", 
              fontWeight: "500", 
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s"
            }} 
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")} 
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              <img src="https://cdn-icons-png.flaticon.com/128/833/833472.png" alt="Favorites" style={{ width: "16px", height: "16px" }} />
              Favorites
            </Link>

            <Link to="/about" style={{ 
              textDecoration: "none",
              color: "#6b7280", 
              fontSize: "13px", 
              fontWeight: "500", 
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s"
            }} 
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")} 
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              <img src="https://cdn-icons-png.flaticon.com/128/1995/1995505.png" alt="About Us" style={{ width: "16px", height: "16px" }} />
              About Us
            </Link>
          </div>

          {/* Auth section - Right */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{ 
                  background: "transparent", 
                  border: "none", 
                  color: "#6b7280", 
                  fontSize: "13px", 
                  fontWeight: "500", 
                  padding: "6px 12px", 
                  cursor: "pointer", 
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                Log In
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(6px)", borderRadius: "20px", padding: "3rem 2.8rem", width: "100%", maxWidth: "500px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.8)" }}>

        <div style={{ textAlign: "center", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "52px", lineHeight: 1 }}><img src="https://cdn-icons-png.flaticon.com/128/5839/5839151.png" alt="register" style={{ width: "70px", height: "75px", objectFit: "contain", alignItems: "center", justifyContent: "center"}} /></span>
        </div>
        <h2 style={{ textAlign: "center", fontWeight: "800", fontSize: "24px", color: "#2d2d2d", marginBottom: "4px", fontFamily: "'Georgia', serif" }}>Create Account</h2>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", marginBottom: "1.8rem", fontFamily: "'Inter', sans-serif" }}>Sign up to get started</p>

        {apiError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem", color: "#dc2626", fontSize: "13px" }}>
            ⚠️ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "16px" }}><img src="https://cdn-icons-png.flaticon.com/128/16385/16385147.png" alt="email" style={{ width: "22px", height: "23px", objectFit: "contain", alignItems: "center", justifyContent: "center"}} /></span>
            <input name="name" type="text" placeholder="Full name" value={form.name} onChange={handleChange}
              style={inputStyle(!!errors.name)}
              onFocus={e => (e.currentTarget.style.borderColor = "#7C9653")}
              onBlur={e => (e.currentTarget.style.borderColor = errors.name ? "#dc3545" : "#e0ddd6")}
            />
            {errors.name && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "3px" }}>{errors.name}</div>}
          </div>

          {/* Email */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "16px" }}><img src="https://cdn-icons-png.flaticon.com/128/5825/5825999.png" alt="email" style={{ width: "20px", height: "20px", objectFit: "contain", alignItems: "center", justifyContent: "center"}} /></span>
            <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange}
              style={inputStyle(!!errors.email)}
              onFocus={e => (e.currentTarget.style.borderColor = "#7C9653")}
              onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#dc3545" : "#e0ddd6")}
            />
            {errors.email && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "3px" }}>{errors.email}</div>}
          </div>

          {/* Password */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "16px" }}><img src="https://cdn-icons-png.flaticon.com/128/12796/12796042.png" alt="password" style={{ width: "20px", height: "20px", objectFit: "contain", alignItems: "center", justifyContent: "center"}} /></span>
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={handleChange}
              style={{ ...inputStyle(!!errors.password), paddingRight: "42px" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#7C9653")}
              onBlur={e => (e.currentTarget.style.borderColor = errors.password ? "#dc3545" : "#e0ddd6")}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "18px" }}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {errors.password && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "3px" }}>{errors.password}</div>}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", background: loading ? "#8aab6a" : "#5a7a3a", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "700", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.5px" }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#4a6a2a"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#5a7a3a"; }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "15px", color: "#6b7280", fontFamily: "'Inter',sans-serif" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#5a7a3a", fontWeight: "700", textDecoration: "underline" }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
