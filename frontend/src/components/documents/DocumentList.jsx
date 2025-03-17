import React from 'react';
import { Link } from 'react-router-dom';

const DocumentList = ({ documents }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Documents</h2>
      <ul>
        {documents.map((document) => (
          <li key={document._id} className="mb-4">
            <Link to={`/documents/${document._id}`} className="text-blue-600 hover:underline">
              {document.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;
