import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResumePage from "./pages/ResumePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/resume-builder" element={<ResumePage />} />
      </Routes>
    </BrowserRouter>
  );
}