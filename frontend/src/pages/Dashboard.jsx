import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    if (user) {
      // Simulated fetch; replace with real backend/API call
      setResumes([
        { id: 1, title: "Frontend Developer Resume", date: "2024-07-01" },
        { id: 2, title: "Privacy Policy Scan Report", date: "2024-06-29" }
      ]);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="px-6 py-20 text-center">
        <h2 className="text-xl font-semibold">Please sign in to access your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.displayName}</h1>

      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Recent Documents</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {resumes.map((item) => (
            <li key={item.id} className="py-3 flex justify-between">
              <span>{item.title}</span>
              <span className="text-sm text-gray-500">{item.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}