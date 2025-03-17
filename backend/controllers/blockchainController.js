const Document = require('../models/Document');

// Mock blockchain verification
exports.verifyDocument = async (req, res) => {
  try {
    const { documentHash } = req.body;
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Mock blockchain verification
    document.blockchainHash = documentHash;
    document.isVerified = true;
    await document.save();

    res.status(200).json({ message: 'Document verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying document', error: error.message });
  }
};

exports.getVerificationStatus = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ status: document.isVerified ? 'Verified' : 'Not Verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification status', error: error.message });
  }
};
