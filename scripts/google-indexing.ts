import { google } from 'googleapis';

async function sendToIndexApi() {
  const keySecret = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keySecret) {
    console.log('Google Service Account key not found in environment secrets.');
    return;
  }

  const credentials = JSON.parse(keySecret);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({
    version: 'v3',
    auth,
  });

  // URLs of the site pages or latest videos to instantly trigger indexing
  const urlsToUpdate = [
    'https://gamecastle.store/',
    'https://gamecastle.store/gaming-hub',
    'https://gamecastle.store/anime'
  ];

  for (const url of urlsToUpdate) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`Successfully indexed: ${url}`, res.data);
    } catch (error) {
      console.error(`Failed to index ${url}:`, error);
    }
  }
}

sendToIndexApi();
