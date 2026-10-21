/**
 * EmpatIA Digital · Galería
 *
 * Google Apps Script that saves the images the students upload at /subir into the Fundación's
 * Drive: one folder per school, inside the folder whose id is in FOLDER_ID. It runs as the
 * account that deploys it. Only the website can use it: every call must carry SECRET, the same
 * value as GALERIA_SECRET in Vercel. Setup steps: CLAUDE.md, "Subir a la galería".
 *
 * Script properties (Project Settings → Script properties):
 *   SECRET     the same value as GALERIA_SECRET
 *   FOLDER_ID  id of the "Galería EmpatIA" folder (the last part of its Drive address)
 */

var TYPES = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" };
var EXTENSIONS = { png: "png", jpeg: "jpg", webp: "webp" };
var MAX_BYTES = 4000000;
/** Same rule as the website's school list: letters, digits, spaces and dots. */
var SCHOOL_NAME = /^[\p{L}\d .]{1,120}$/u;

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== props.getProperty("SECRET")) return reply(false);
    if (!TYPES[body.kind] || typeof body.school !== "string" || !SCHOOL_NAME.test(body.school)) return reply(false);

    var bytes = Utilities.base64Decode(body.data);
    if (bytes.length === 0 || bytes.length > MAX_BYTES) return reply(false);

    var folder = schoolFolder(DriveApp.getFolderById(props.getProperty("FOLDER_ID")), body.school);
    var name = Utilities.formatDate(new Date(), "America/Bogota", "yyyy-MM-dd HH.mm.ss") + " " +
      Utilities.getUuid().slice(0, 4) + "." + EXTENSIONS[body.kind];
    folder.createFile(Utilities.newBlob(bytes, TYPES[body.kind], name));
    return reply(true);
  } catch (error) {
    return reply(false);
  }
}

/** The school's folder, created the first time. The lock stops two uploads from creating it twice. */
function schoolFolder(root, school) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var found = root.getFoldersByName(school);
    return found.hasNext() ? found.next() : root.createFolder(school);
  } finally {
    lock.releaseLock();
  }
}

function reply(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON);
}
