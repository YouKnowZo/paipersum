const WebSocket = require('ws');
const OT = require('ot');
const Document = require('../models/Document');

const wss = new WebSocket.Server({ noServer: true });
const sessions = new Map();

wss.on('connection', (ws, req) => {
  const { docId, userId } = req.session;
  
  if (!sessions.has(docId)) {
    sessions.set(docId, {
      ot: new OT.Server(''),
      users: new Set()
    });
  }

  const session = sessions.get(docId);
  session.users.add(userId);

  ws.send(JSON.stringify({
    type: 'init',
    text: session.ot.document,
    users: Array.from(session.users)
  }));

  ws.on('message', async (data) => {
    const msg = JSON.parse(data);
    
    switch (msg.type) {
      case 'operation':
        const op = session.ot.receiveOperation(msg.operation);
        broadcast(docId, { type: 'operation', operation: op });
        break;
        
      case 'cursor':
        broadcast(docId, { 
          type: 'cursor', 
          userId,
          position: msg.position
        });
        break;
    }
  });

  ws.on('close', () => {
    session.users.delete(userId);
    if (session.users.size === 0) {
      Document.findByIdAndUpdate(docId, { content: session.ot.document }).exec();
      sessions.delete(docId);
    }
  });
});

function broadcast(docId, message) {
  const session = sessions.get(docId);
  if (!session) return;
  
  for (const user of session.users) {
    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(JSON.stringify(message));
    }
  }
}

module.exports = wss;