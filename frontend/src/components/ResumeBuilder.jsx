import React, { useState } from "react";
import axios from "axios";

export default function ResumeBuilder() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  // ...other state

  const saveResume = async () => {
    await axios.post("http://localhost:5000/api/resumes", {
      template_name: "default",
      resume_content: resumeText
    });
  };

  const formatResume = async () => {
    const { data } = await axios.post("http://localhost:5000/api/resumes/format", {
      content: resumeText
    });
    setResumeText(data.formatted);
  };

  const enhanceResume = async () => {
    const { data } = await axios.post("http://localhost:5000/api/resumes/suggest", {
      content: resumeText,
      job_title: "Frontend Developer"
    });
    alert("Suggestions:\n" + data.suggestion);
  };

  const checkATS = async () => {
    const { data } = await axios.post("http://localhost:5000/api/resumes/ats-check", {
      content: resumeText,
      job_description: jobDesc
    });
    alert("ATS Results:\n" + data.atsAnalysis);
  };

  // ...UI with buttons to trigger above functions
  return (
    <div>
      {/* Your form and UI here */}
    </div>
  );
}