// // server.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const crypto = require('crypto');
// const CryptoJS = require('crypto-js');
// const cors = require('cors');

// const app = express();
// app.use(bodyParser.json({ limit: '1mb' }));
// app.use(cors());

// // Generate keypair (or load from disk)
// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: { type: 'spki', format: 'pem' },
//   privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
// });

// app.get('/public-key', (req, res) => {
//   res.type('text/plain').send(publicKey);
// });

// app.post('/secure-submit', (req, res) => {
//   try {
//     const { encryptedData, encryptedKey } = req.body;
//     if (!encryptedData || !encryptedKey) {
//       return res.status(400).json({ success: false, error: 'Missing fields' });
//     }

//     // RSA-OAEP decrypt (sha256)
//     const decryptedKeyBuffer = crypto.privateDecrypt(
//       {
//         key: privateKey,
//         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//         oaepHash: 'sha256',
//       },
//       Buffer.from(encryptedKey, 'base64')
//     );
//     const sessionKey = decryptedKeyBuffer.toString('utf8');

//     // AES decrypt (CryptoJS expects the passphrase string used client-side)
//     const bytes = CryptoJS.AES.decrypt(encryptedData, sessionKey);
//     const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

//     if (!decryptedText) {
//       throw new Error('Malformed AES data or wrong session key');
//     }

//     const userData = JSON.parse(decryptedText);

//     console.log('✅ Decryption Success!', userData);
//     res.json({ success: true, message: 'Data received safely', data: userData });
//   } 
//   catch (err) {
//     console.error('❌ Decryption Failed:', err.message);
//     res.status(400).json({ success: false, error: 'Decryption Failed', details: err.message });
//   }
// });

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));


const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const cors = require('cors');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cors());

// Generate RSA keys
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Send public key to frontend
app.get('/public-key', (req, res) => {
  res.type('text/plain').send(publicKey);
});

app.post('/secure-submit', (req, res) => {
  try {
    const { encryptedData, encryptedKey, key } = req.body;
    if (!encryptedData || !encryptedKey) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    // RSA decrypt session key
    const decryptedKeyBuffer = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptedKey, 'base64')
    );

    const sessionKey = decryptedKeyBuffer.toString('utf8');

    // AES decrypt incoming data
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, sessionKey);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

    const userData = JSON.parse(decryptedText);

    console.log("✅ Data Decrypted:", userData);

    // Prepare response object
    const responsePayload = {
      ...userData,
      received: true,
      timestamp: Date.now()
    };

    // AES encrypt the response with SAME session key
    const encryptedResponse = CryptoJS.AES.encrypt(
      JSON.stringify(responsePayload),
      sessionKey
    ).toString();

    return res.json({
      success: true,
      encryptedResponse: encryptedResponse
    });

  } catch (err) {
    console.error("❌ Backend Decryption Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
