import { expect, type Page } from "@playwright/test";

/** A phrase that must never show up in the server log: every test message carries it. */
export const MARKER = "MARCADOR-PRIVADO-7731";

/** Waits for the Oráculo's greeting, then says who is talking and accepts the consent. */
export async function introduce(page: Page, answer: string) {
  const box = page.getByRole("textbox", { name: "Tu mensaje" });
  await expect(box).toBeEnabled({ timeout: 10_000 });
  await box.fill(answer);
  await page.getByRole("button", { name: "Enviar" }).click();
}

export async function startSession(page: Page, answer = "soy estudiante") {
  await page.goto("/oraculo");
  await introduce(page, answer);
  await page.getByLabel("Entiendo y quiero empezar").check();
  await page.getByRole("button", { name: "Empezar" }).click();
  // The field exists from the greeting on; the session has started once the counter shows
  await expect(page.getByText(/Te quedan \d+ mensajes/)).toBeVisible();
}

export async function say(page: Page, text: string) {
  await page.getByRole("textbox", { name: "Tu mensaje" }).fill(`${text} ${MARKER}`);
  await page.getByRole("button", { name: "Enviar" }).click();
}
