import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { axiosT, setupInterceptors } from "./config/axios";
import { ROUTES } from "./config/routes";
import Header from "./Header&Footer/Header";
import Footer from "./Header&Footer/Footer";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import UserDetails from "./routes/UserDetails";
import AdminDashboard from "./routes/AdminDashboard";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    setupInterceptors(token);

    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  useEffect(() => {
    axiosT.defaults.headers["authorization"] = `Bearer ${token}`;
  }, [token]);

  return (
    <BrowserRouter>
      <Header />
      <div className="p-2 md:p-5 lg:p-8 xl:p-10 w-full h-full overflow-auto bg-gradient-to-t from-[#8b00bae0] via-[#ffdd00d7] to-[#8b00bae0] text-black">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.USER_DETAILS} element={<UserDetails />} />
          <Route path={ROUTES.ADMIN_HOME} element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
