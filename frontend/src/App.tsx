import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Cafenea from "./pages/Cafenea";
import CafeneaSettings from "./pages/CafeneaSettings";
const App = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="cafenea/:id_cafenea" element={<Cafenea />} />
      <Route path="cafenea/:id_cafenea/settings" element={<CafeneaSettings />} />
    </Routes>
  );
};

export default App;
