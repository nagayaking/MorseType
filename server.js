const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set();
const messageHistory = [];
const HISTORY_LIMIT = 50;

wss.on('connection', function connection(ws) {
  clients.add(ws);
  console.log('New client connected.');

  // Send message history to the new client
  ws.send(JSON.stringify({ type: 'info', message: '以前の会話履歴を読み込んでいます...' }));
  for (const message of messageHistory) {
    ws.send(message); // History is already stringified JSON
  }
  ws.send(JSON.stringify({ type: 'info', message: '履歴の読み込みが完了しました。' }));


  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);

    // Add message to history
    messageHistory.push(data.toString());
    if (messageHistory.length > HISTORY_LIMIT) {
        messageHistory.shift(); // Remove the oldest message
    }

    // Broadcast to all clients except the sender
    for (const client of clients) {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data.toString());
      }
    }
  });

  ws.on('close', function() {
    clients.delete(ws);
    console.log('Client disconnected.');
  });
});

console.log('WebSocket server started on port 8080');
