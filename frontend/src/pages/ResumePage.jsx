import ResumeBuilder from "../components/ResumeBuilder.jsx";

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Resume Builder</h1>
      <ResumeBuilder />
    </main>
  );
}