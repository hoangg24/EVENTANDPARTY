import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

// Tạo context
export const UserContext = createContext();

// Provider để quản lý trạng thái người dùng
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    // Kiểm tra và load user từ localStorage (nếu có token)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
        if (decoded.exp < currentTime) {
          console.warn("Token đã hết hạn");
          localStorage.removeItem("token"); // Xóa token hết hạn
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Xóa token lỗi
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.error("Token đã hết hạn");
        return;
      }
      setUser(decoded); // Lưu thông tin user vào state
      localStorage.setItem("role", decoded.role); // Lưu vai trò
      localStorage.setItem("token", token); // Lưu token vào localStorage
      localStorage.setItem("userId", decoded.id); // Lưu userId
    } catch (error) {
      console.error("Error decoding token on login:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Xóa token khi logout
    localStorage.removeItem("role"); // Xóa vai trò
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
