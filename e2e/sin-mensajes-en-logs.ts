import { readFileSync } from "node:fs";
import { MARKER } from "./ayudas";
import { SERVER_LOG } from "../playwright.config";

/** After every run: no message written in the tests may appear in the server log. */
export default function noMessagesInLogs() {
  const log = readFileSync(SERVER_LOG, "utf8");
  if (log.includes(MARKER)) throw new Error(`Privacidad: un mensaje de prueba apareció en ${SERVER_LOG}`);
  console.log(`Privacidad: ningún mensaje en el registro del servidor (${log.split("\n").length} líneas revisadas).`);
}
