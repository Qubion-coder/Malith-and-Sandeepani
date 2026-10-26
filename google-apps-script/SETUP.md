1. Open the Google Sheet:
   https://docs.google.com/spreadsheets/d/15eD2uVY2C9y4G_mGZfcqbImO9GMXIgQdlHQI9K3__Gg/edit
2. Open Extensions > Apps Script.
3. Replace the script content with the code from google-apps-script/code.gs and save.
4. In the function dropdown pick `setupSheets` and click Run. Approve the permissions prompt.
   This creates the "RSVP" and "Wishes" tabs with formatted headers.
   (They are also created automatically on the first submission.)
5. Click Deploy > New deployment.
6. Select type: Web app.
7. Execute as: Me.
8. Who has access: Anyone.
9. Deploy and copy the Web App URL (ends with /exec).
10. In the project root, create a file named .env with:

VITE_GOOGLE_APPS_SCRIPT_URL=YOUR_WEB_APP_URL

11. Restart the Vite dev server. On your hosting provider (Vercel/Netlify), add the same
    environment variable and redeploy.

Sheets:
- RSVP:   Timestamp | Name | Invited As | Attendance | Guests | Notes
- Wishes: Timestamp | Name | Message | Show On Website

Notes:
- Wishes appear on the website. Untick "Show On Website" to hide a wish.
- If you update the Apps Script code later, use Deploy > Manage deployments > Edit >
  Version: New version, so the URL stays the same.
