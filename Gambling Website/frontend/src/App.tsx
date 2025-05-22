// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Simulation } from "./pages/Simulation";
import { Game } from "./pages/Game";
import { AuthPage } from "./pages/Signin";
import { Footer, Navbar } from "./components";
import Dashboard from "./pages/userInfo";
import { Home } from "./pages/Home";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/game" element={<Game />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
