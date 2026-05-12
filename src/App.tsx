import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AuthorLogin from "./AuthorLogin";
import AuthorSignup from "./AuthorSignup";
import AuthorDashboard from "./AuthorDashboard";
import { ThemeProvider } from "./ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/author-login" element={<AuthorLogin />} />
          <Route path="/author-signup" element={<AuthorSignup />} />
          <Route path="/author-dashboard" element={<AuthorDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}