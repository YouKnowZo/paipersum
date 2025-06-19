import React from "react";
export default function Footer() {
  return (
    <footer className="py-6 text-center text-slate-400 bg-slate-900 mt-12">
      <div>© {new Date().getFullYear()} PaiperSum. All rights reserved.</div>
      <div className="mt-2">
        <a href="/privacy" className="mx-2 underline">Privacy</a>
        <a href="/terms" className="mx-2 underline">Terms</a>
        <a href="/contact" className="mx-2 underline">Contact</a>
      </div>
    </footer>
  );
}