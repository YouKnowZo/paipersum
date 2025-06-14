const Document = require('../models/Document');

module.exports = {
  checkDocumentOwnership: async (req, res, next) => {
    const doc = await Document.findOne({
      _id: req.params.docId,
      $or: [
        { user: req.user.id },
        { team: { $in: [req.user.id] } }
      ]
    });
    
    if (!doc) return res.status(403).json({ 
      error: 'Document access forbidden',
      legalNotice: 'Violation logged per DMCA §1202' 
    });
    
    req.document = doc;
    next();
  },

  auditTrail: async (req, res, next) => {
    await AuditLog.create({
      user: req.user.id,
      action: req.method + ' ' + req.path,
      metadata: {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    });
    next();
  }
};