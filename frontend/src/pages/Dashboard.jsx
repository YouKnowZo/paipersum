import React from "react";
import Card from "../components/Card";

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Upload Documents" description="Quickly upload and manage documents." />
        <Card title="AI Integration" description="Process documents with AI tools." />
        <Card title="Settings" description="Customize your experience." />
      </div>
    </div>
  );
};

export default Dashboard;
