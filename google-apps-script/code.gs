/**
 * Malith & Sandeepani – Wedding RSVP & Wishes backend
 *
 * Paste this whole file into Extensions > Apps Script of the Google Sheet,
 * run setupSheets() once, then Deploy > New deployment > Web app.
 *
 * The "RSVP" and "Wishes" tabs (with formatted headers) are created
 * automatically if they don't exist.
 */

const SPREADSHEET_ID = '15eD2uVY2C9y4G_mGZfcqbImO9GMXIgQdlHQI9K3__Gg';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Name', 'Invited As', 'Attendance', 'Guests', 'Notes'],
    widths: [170, 200, 200, 130, 80, 360],
  },
  WISH: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Message', 'Show On Website'],
    widths: [170, 200, 460, 140],
  },
};

const MAX_FIELD_LENGTH = 1000;
const MAX_WISHES_RETURNED = 200;

/** Run once from the editor to create both tabs and grant permissions. */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach(function (key) {
    getOrCreateSheet_(ss, SHEETS[key]);
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const payload = parsePayload_(e);
    const sheetKey = String(payload.sheet || '').toUpperCase();
    const config = SHEETS[sheetKey];

    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, config);

    if (sheetKey === 'RSVP') {
      if (!clean_(payload.name)) {
        return jsonResponse_({ ok: false, error: 'Name is required.' });
      }
      sheet.appendRow([
        new Date(),
        clean_(payload.name),
        clean_(payload.invitedAs),
        clean_(payload.attendance) || 'Attending',
        Number(payload.guests) || 0,
        clean_(payload.notes),
      ]);
    } else {
      if (!clean_(payload.name) || !clean_(payload.message)) {
        return jsonResponse_({ ok: false, error: 'Name and message are required.' });
      }
      sheet.appendRow([
        new Date(),
        clean_(payload.name),
        clean_(payload.message),
        true,
      ]);
      sheet.getRange(sheet.getLastRow(), 4).insertCheckboxes().setValue(true);
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';

  if (action === 'wishes') {
    try {
      return jsonResponse_({ ok: true, wishes: getWishes_() });
    } catch (error) {
      return jsonResponse_({
        ok: false,
        error: String(error && error.message ? error.message : error),
      });
    }
  }

  return jsonResponse_({ ok: true, message: 'Wedding form endpoint is running.' });
}

/** Wishes ticked "Show On Website", newest first. Untick a row to hide it. */
function getWishes_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet_(ss, SHEETS.WISH);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, SHEETS.WISH.headers.length).getValues();
  const wishes = [];

  for (let i = rows.length - 1; i >= 0 && wishes.length < MAX_WISHES_RETURNED; i--) {
    const row = rows[i];
    const timestamp = row[0];
    const name = String(row[1] || '').trim();
    const message = String(row[2] || '').trim();
    const show = row[3] !== false && String(row[3]).toUpperCase() !== 'FALSE';

    if (!name || !message || !show) continue;

    wishes.push({
      name: name,
      message: message,
      createdAt: timestamp instanceof Date ? timestamp.toISOString() : new Date().toISOString(),
    });
  }

  return wishes;
}

function getOrCreateSheet_(ss, config) {
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }

  if (sheet.getLastRow() === 0) {
    const header = sheet.getRange(1, 1, 1, config.headers.length);
    header
      .setValues([config.headers])
      .setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground('#061e14')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    config.widths.forEach(function (width, i) {
      sheet.setColumnWidth(i + 1, width);
    });
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }

  return sheet;
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) {
    return params;
  }

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

/** Trims, caps length, and stops user text from being run as a spreadsheet formula. */
function clean_(value) {
  let text = String(value == null ? '' : value).trim().slice(0, MAX_FIELD_LENGTH);
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }
  return text;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
