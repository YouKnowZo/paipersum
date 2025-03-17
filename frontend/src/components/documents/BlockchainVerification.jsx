import React, { useEffect, useState } from 'react';
import blockchainService from '../../services/blockchainService';

const BlockchainVerification = ({ documentId }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await blockchainService.getVerificationStatus(documentId);
      setStatus(data.status);
    };

    fetchStatus();
  }, [documentId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Blockchain Verification</h2>
      <p>{status}</p>
    </div>
  );
};

export default BlockchainVerification;
