"use client"

import { useState } from "react";

export default function DashboardPage() {
  const [name, setName] = useState("");

  console.log("Dashboard client component");

  return (
    <div>
      <h1 className="text-2xl font-bold underline">Dashboard</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-white border-2 border-white p-2 rounded-lg w-96 outline-none"
      />
      <p>Hello, {name}</p>
    </div>
  );
}