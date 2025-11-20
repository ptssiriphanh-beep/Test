/*
  drive_upload_server.js

  Minimal Express endpoint to accept a multipart/form-data upload and
  store the attached file to Google Drive using a Service Account.

  Configuration (environment variables):
  - GOOGLE_SERVICE_ACCOUNT_JSON : JSON content of the service account key (base64 or raw). Optional if using GOOGLE_APPLICATION_CREDENTIALS.
  - GOOGLE_APPLICATION_CREDENTIALS : path to service account JSON file (optional alternative)
  - DRIVE_FOLDER_ID : Drive folder ID where to put uploaded files (required)
  - PORT : port to listen on (defaults to 4000)

  Security: do NOT commit service account keys to the repo. Use environment variables or platform secret storage.

  Usage: `node drive_upload_server.js` after installing dependencies.
*/

const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const stream = require('stream');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

const PORT = process.env.PORT || 4000;
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;

if (!DRIVE_FOLDER_ID) {
  console.warn('Warning: DRIVE_FOLDER_ID not set. Uploads will fail until configured.');
}

// Create an authenticated Google API client using a service account JSON.
function getDriveClient() {
  let key = null;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      key = JSON.parse(raw);
    } catch (err) {
      // allow base64-encoded JSON
      try {
        const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON, 'base64').toString('utf8');
        key = JSON.parse(decoded);
      } catch (err2) {
        console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON');
      }
    }
  }

  // If GOOGLE_APPLICATION_CREDENTIALS is set, google.auth will pick it up automatically.
  const scopes = ['https://www.googleapis.com/auth/drive.file'];

  if (key) {
    const jwt = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      scopes
    );
    return google.drive({ version: 'v3', auth: jwt });
  }

  // Fallback to default client (uses GOOGLE_APPLICATION_CREDENTIALS)
  const auth = new google.auth.GoogleAuth({ scopes });
  return google.drive({ version: 'v3', auth });
}

const drive = getDriveClient();

app.post('/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded (field name: receipt)' });
    if (!DRIVE_FOLDER_ID) return res.status(500).json({ error: 'Server not configured with DRIVE_FOLDER_ID' });

    const { originalname, mimetype, buffer } = req.file;
    const name = `${Date.now()}_${originalname}`;

    // create a readable stream from buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const response = await drive.files.create({
      requestBody: {
        name,
        parents: [DRIVE_FOLDER_ID]
      },
      media: {
        mimeType: mimetype,
        body: bufferStream
      },
      fields: 'id, name'
    });

    // Optionally, you could create a permission or return a share link here.
    res.json({ success: true, fileId: response.data.id, name: response.data.name });
  } catch (err) {
    console.error('Upload error', err?.message || err);
    res.status(500).json({ error: 'Upload failed', details: err?.message || String(err) });
  }
});

app.get('/', (req, res) => res.json({ ok: true, upload: '/upload-receipt' }));

app.listen(PORT, () => console.log(`Drive upload server listening on http://localhost:${PORT}`));
