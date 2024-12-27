"use client";

import "@/styles/loader.css";

export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <span className="loader"></span>
    </div>
  );
}
