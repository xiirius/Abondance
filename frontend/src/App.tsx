import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Merci from "@/pages/Merci";
import Admin from "@/pages/Admin";
import Legal from "@/pages/Legal";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merci" element={<Merci />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mentions-legales" element={<Legal />} />
        <Route path="/confidentialite" element={<Legal />} />
        <Route path="/cgv" element={<Legal />} />
        <Route path="/remboursement" element={<Legal />} />
      </Routes>
      <Toaster />
    </>
  );
}
