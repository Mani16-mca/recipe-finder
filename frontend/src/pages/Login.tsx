import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import loginBg from "../assets/logo/forms.png";

const Login: React.FC<{ setIsLoggedIn: (v: boolean) => void }> = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const prefillEmail = (location.state as any)?.email || "";
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!email || !password) { setApiError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email, role: data.role }));
      setIsLoggedIn(true);
      if (data.role === "admin") navigate("/admin");
      else navigate("/home");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Server error. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 2rem" }}>
      <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(6px)", borderRadius: "20px", padding: "3rem 2.8rem", width: "100%", maxWidth: "500px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.8)" }}>

          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <img src="https://cdn-icons-png.flaticon.com/128/3839/3839530.png" alt="chef" style={{ width: "75px", height: "75px", objectFit: "contain" }} />
          </div>

          <h2 style={{ textAlign: "center", fontWeight: "800", fontSize: "24px", color: "#2d2d2d", marginBottom: "4px", fontFamily: "'Georgia', serif" }}>Welcome Back!</h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", marginBottom: "1.8rem", fontFamily: "'Inter', sans-serif" }}>Login to your account</p>

          {apiError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem", color: "#dc2626", fontSize: "13px", fontFamily: "'Inter',sans-serif" }}>
              {apiError}
              {apiError.toLowerCase().includes("sign up") && (
                <> <Link to="/signup" style={{ color: "#d97941", fontWeight: "700", textDecoration: "underline" }}>Sign Up</Link></>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                <img src="https://cdn-icons-png.flaticon.com/128/5825/5825999.png" alt="email" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </span>
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", padding: "13px 14px 13px 42px", background: "#fffffff1", border: "1.5px solid #e0ddd6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Inter',sans-serif", color: "#1a1a1a", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#7C9653")}
                onBlur={e => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
            </div>

            {/* Password */}
            <div style={{ position: "relative", marginBottom: "0.5rem" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                <img src="https://cdn-icons-png.flaticon.com/128/12796/12796042.png" alt="password" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </span>
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: "13px 42px 13px 42px", background: "#ffffff", border: "1.5px solid #e0ddd6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Inter',sans-serif", color: "#1a1a1a", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#7C9653")}
                onBlur={e => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "18px" }}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: "15px", height: "15px", accentColor: "#7C9653" }} />
                Remember me
              </label>
              <span style={{ fontSize: "13px", color: "#6b7280", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Forgot password?</span>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "#8aab6a" : "#5a7a3a", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "700", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.5px", transition: "background 0.2s" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#4a6a2a"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#5a7a3a"; }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "13px", color: "#6b7280", fontFamily: "'Inter',sans-serif" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#5a7a3a", fontWeight: "700", textDecoration: "underline" }}>Create account</Link>
          </p>
      </div>
    </div>
  );
};

export default Login;
