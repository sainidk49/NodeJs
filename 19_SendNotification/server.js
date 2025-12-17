const express = require('express');
const bodyParser = require('body-parser');
const { Expo } = require('expo-server-sdk');

// Initialize Express app and Expo SDK
const app = express();
const expo = new Expo();

// Middleware
app.use(bodyParser.json());

// Route to send push notification
app.post('/send-notification', async (req, res) => {
  const { users, title, body, data } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ error: 'User list must be a non-empty array.' });
  }

  const messages = [];

  for (const user of users) {
    const token = user.token;

    if (!Expo.isExpoPushToken(token)) {
      console.warn(`Skipping invalid token: ${token}`);
      continue;
    }

    messages.push({
      to: token,
      sound: 'default',
      title: title || 'Notification Title',
      body: body || 'Notification Body',
      data: data || {},
    });
  }

  try {
    const chunks = expo.chunkPushNotifications(messages);

    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log('Tickets:', ticketChunk);
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }

    res.status(200).json({ success: true, message: 'Notifications sent.' });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});


app.get("/",  async (req, res) => {
  res.end("Hello world")
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on::  http://localhost:${PORT}`);
});


//   const { token, title, body, data } = req.body;

//   // Validate token
//   if (!Expo.isExpoPushToken(token)) {
//     return res.status(400).json({ error: 'Invalid Expo push token' });
//   }

//   const messages = [{
//     to: token,
//     sound: 'default',
//     title: title || 'Notification Title',
//     body: body || 'Notification Body',
//     data: data || {},
//   }];

//   try {
//     let chunks = expo.chunkPushNotifications(messages);

//     for (let chunk of chunks) {
//       try {
//         let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//         // console.log(ticketChunk);
//       } catch (error) {
//         console.error('Error sending chunk:', error);
//       }
//     }

//     res.status(200).json({ success: true, message: 'Notification sent.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to send notification' });
//   }
// });