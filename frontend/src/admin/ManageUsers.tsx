import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mealBg from "../assets/logo/form.png";
import Sidebar from "./Sidebar";

//const LOGO = "https://cdn-icons-png.flaticon.com/128/3839/3839530.png";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
  password?: string;
}

const Avatar = ({ name, size = 38 }: { name: string; size?: number }) => {
  const colors = ['#5a7a3a', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#10B981'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  
  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: "50%", 
      background: colors[colorIndex], 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      color: "#fff", 
      fontWeight: "700", 
      fontSize: size * 0.4, 
      flexShrink: 0 
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
};

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "Never logged in";
  return new Date(dateString).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const ManageUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<{ name: string; email: string; password: string; role: string; isRegistered: boolean } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!t || u.role !== "admin") { 
      navigate("/login"); 
      return; 
    }
    
    axios.get("http://localhost:5000/api/admin/users", { 
      headers: { Authorization: `Bearer ${t}` } 
    })
    .then(res => setUsers(res.data))
    .catch(() => navigate("/login"));
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (error) {
      alert("Error deleting user");
    }
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/users/${editUser._id}`, 
        { name: editUser.name, email: editUser.email, role: editUser.role, ...(editUser.password && { password: editUser.password }) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => prev.map(u => u._id === editUser._id ? res.data : u));
      setEditUser(null);
      setShowEditPassword(false);
    } catch (error) {
      alert("Error updating user");
    }
  };

  const handleAddUser = async () => {
    if (!newUser || !newUser.name || !newUser.email || !newUser.password) { 
      alert("Please fill all fields"); 
      return; 
    }
    try {
      const res = await axios.post("http://localhost:5000/api/admin/users", newUser, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUsers(prev => [...prev, res.data]);
      setNewUser(null);
    } catch (error) {
      alert("Error creating user");
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem("token"); 
    localStorage.removeItem("user"); 
    navigate("/login"); 
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const loggedInUsers = filteredUsers.filter(u => u.lastLogin !== null);
  const adminUsers = users.filter(u => u.role === "admin");

  const StatCard = ({ icon, count, label }: { icon: string; count: number; label: string }) => (
    <div style={{ 
      background: "rgba(255,255,255,0.88)", 
      borderRadius: "12px", 
      padding: "16px 20px", 
      display: "flex", 
      alignItems: "center", 
      gap: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: "1px solid rgba(255,255,255,0.8)"
    }}>
      <div style={{ 
        width: "48px", 
        height: "48px", 
        borderRadius: "50%", 
        background: icon === "users" ? "#5a7a3a" : icon === "active" ? "#3b82f6" : icon === "registered" ? "#f59e0b" : "#8b5cf6", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        fontSize: "24px",
        flexShrink: 0
      }}>
        <img src={
          icon === "users" ? "https://cdn-icons-png.flaticon.com/128/681/681494.png" :
          icon === "active" ? "https://cdn-icons-png.flaticon.com/128/5968/5968204.png" :
          icon === "registered" ? "https://cdn-icons-png.flaticon.com/128/4306/4306892.png" :
          "https://cdn-icons-png.flaticon.com/128/1794/1794749.png"
        } alt={icon} style={{ width: "24px", height: "24px", filter: "brightness(0) invert(1)" }} />
      </div>
      <div>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#1a1a1a" }}>{count}</div>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>{label}</div>
      </div>
    </div>
  );

  const UserTable = ({ title, data, showCount }: { title: string; data: User[]; showCount: string }) => (
    <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.8)" }}>
      <div style={{ 
        padding: "14px 20px", 
        borderBottom: "1px solid #f0ede6", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a" }} />
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#1a1a1a" }}>{title}</span>
        </div>
        <span style={{ fontSize: "12px", background: "#f0fdf4", color: "#16a34a", fontWeight: "700", padding: "2px 10px", borderRadius: "20px" }}>{showCount}</span>
      </div>
      
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fafaf8" }}>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>USER</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>EMAIL</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>ROLE</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>JOINED</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>LAST LOGIN</th>
            <th style={{ padding: "12px 4px", textAlign: "right", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px" }}>
                No users found
              </td>
            </tr>
          ) : (
            data.map(user => (
              <tr key={user._id} style={{ borderTop: "1px solid #f5f3f0" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar name={user.name} />
                    <span style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a1a" }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{user.email}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ 
                    background: user.role === "admin" ? "#fef3c7" : "#dcfce7", 
                    color: user.role === "admin" ? "#d97706" : "#16a34a", 
                    fontSize: "12px", 
                    fontWeight: "700", 
                    padding: "3px 10px", 
                    borderRadius: "20px" 
                  }}>
                    {user.role === "admin" ? "Admin" : "Member"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>
                  {formatDate(user.createdAt)}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px" }}>
                  {user.lastLogin ? (
                    <span style={{ color: "#16a34a" }}>● {formatDateTime(user.lastLogin)}</span>
                  ) : (
                    <span style={{ color: "#6b7280" }}>Never logged in</span>
                  )}
                </td>
                <td style={{ padding: "14px 4px" }}>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => setEditUser({ ...user })}
                      style={{ 
                        padding: "7px 16px", 
                        background: "#5a7a3a", 
                        border: "none", 
                        borderRadius: "6px", 
                        fontSize: "12px", 
                        fontWeight: "700", 
                        color: "#fff", 
                        cursor: "pointer"
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id)}
                      style={{ 
                        padding: "7px 16px", 
                        background: "#fef2f2", 
                        border: "1px solid #fca5a5", 
                        borderRadius: "6px", 
                        fontSize: "12px", 
                        fontWeight: "700", 
                        color: "#e05a5a", 
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", minHeight: "100vh", backgroundImage: `url(${mealBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div style={{ background: "rgba(245,243,240,0.93)", minHeight: "100vh", display: "flex" }}>
        
        {/* Sidebar */}
        <Sidebar activePage="users" onLogout={handleLogout} />

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: "240px" }}>
          {/* Top Navbar */}
          <nav style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(229,231,235,0.6)", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky", top: 0, zIndex: 100 }}>
            <span onClick={handleLogout} style={{ fontSize: "14px", color: "#6b7280", cursor: "pointer", fontWeight: "500" }}>Logout</span>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ position: "relative" }}>
                <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <Avatar name={adminUser.name || "A"} size={32} />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Admin</span>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>▾</span>
                </div>
                {userMenuOpen && (
                  <div style={{ position: "absolute", right: 0, top: "110%", background: "#fff", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "200px", padding: "1rem", zIndex: 200 }}>
                    <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "2px" }}>{adminUser.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}>{adminUser.email}</div>
                    <button onClick={handleLogout} style={{ width: "100%", padding: "7px 0", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "6px", color: "#e05a5a", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Log Out</button>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <div style={{ flex: 1, padding: "1.5rem 2rem", maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontWeight: "800", fontSize: "22px", color: "#1a1a1a", margin: 0, fontFamily: "'Georgia',serif" }}>Manage Users</h2>
                <p style={{ color: "#6b7280", fontSize: "13px", margin: "4px 0 0" }}>Total 6 users • 2 currently logged in</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.88)", border: "1.5px solid #e5e7eb", borderRadius: "8px", padding: "0 12px" }}>
                  <img src="https://cdn-icons-png.flaticon.com/128/149/149852.png" alt="Search" style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ border: "none", outline: "none", fontSize: "14px", padding: "9px 0", background: "transparent", width: "200px" }} />
                </div>
                <button onClick={() => setNewUser({ name: "", email: "", password: "", role: "user", isRegistered: false })} style={{ padding: "10px 20px", background: "#5a7a3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                  + Add User
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "1.5rem" }}>
              <StatCard icon="users" count={users.length} label="Total Users" />
              <StatCard icon="active" count={loggedInUsers.length} label="Logged In Users" />
              <StatCard icon="registered" count={users.length} label="Registered Users" />
              <StatCard icon="admin" count={adminUsers.length} label="Admin Users" />
            </div>

            {/* Tables */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <UserTable 
                title="Logged In Users" 
                data={loggedInUsers} 
                showCount={`${loggedInUsers.length} users`}
              />
              <UserTable 
                title="All Registered Users" 
                data={filteredUsers} 
                showCount={`${filteredUsers.length} users`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div onClick={() => setEditUser(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontWeight: "800", fontSize: "18px", marginBottom: "1.2rem" }}>Edit User</h3>
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Name</label>
              <input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Email</label>
              <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                type="email"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input 
                  value={(editUser as any).password || ""} 
                  onChange={e => setEditUser({ ...editUser, password: e.target.value } as any)}
                  placeholder="Enter new password" 
                  type={showEditPassword ? "text" : "password"}
                  style={{ width: "100%", padding: "9px 12px", paddingRight: "40px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} 
                />
                <button
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#6b7280",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {showEditPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Role</label>
              <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                <option value="user">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => { setEditUser(null); setShowEditPassword(false); }} style={{ padding: "9px 20px", background: "#f3f4f6", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleEditSave} style={{ padding: "9px 24px", background: "#5a7a3a", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {newUser && (
        <div onClick={() => setNewUser(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontWeight: "800", fontSize: "18px", marginBottom: "1.2rem" }}>Add New User</h3>
            {[
              { label: "Name", key: "name", type: "text", placeholder: "Enter name" },
              { label: "Email", key: "email", type: "email", placeholder: "Enter email" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: "0.8rem" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>{f.label}</label>
                <input value={(newUser as any)[f.key]} onChange={e => setNewUser({ ...newUser, [f.key]: e.target.value })}
                  placeholder={f.placeholder} type={f.type}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input 
                  value={newUser.password} 
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password" 
                  type={showPassword ? "text" : "password"}
                  style={{ width: "100%", padding: "9px 12px", paddingRight: "40px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} 
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#6b7280",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Role</label>
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                <option value="user">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                <input 
                  type="checkbox" 
                  checked={!newUser.isRegistered}
                  onChange={e => setNewUser({ ...newUser, isRegistered: !e.target.checked })}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span>Login</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                <input 
                  type="checkbox" 
                  checked={newUser.isRegistered}
                  onChange={e => setNewUser({ ...newUser, isRegistered: e.target.checked })}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span>Register</span>
              </label>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => { setNewUser(null); setShowPassword(false); }} style={{ padding: "9px 20px", background: "#f3f4f6", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAddUser} style={{ padding: "9px 24px", background: "#5a7a3a", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;