import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResumePage from "./pages/ResumePage.jsx";
import DocumentAnalyzer from "./components/DocumentAnalyzer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DocumentAnalyzer />} />
        <Route path="/resume-builder" element={<ResumePage />} />
      </Routes>
    </BrowserRouter>
  );
}