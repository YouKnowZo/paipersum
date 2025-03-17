import React, { useEffect, useState } from 'react';
import aiService from '../../services/aiService';

const AISummary = ({ documentId }) => {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await aiService.getAISummary(documentId);
      setSummary(data.summary);
    };

    fetchSummary();
  }, [documentId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">AI Summary</h2>
      <p>{summary}</p>
    </div>
  );
};

export default AISummary;
