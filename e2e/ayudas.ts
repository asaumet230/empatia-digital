import { expect, type Page } from "@playwright/test";

/** A phrase that must never show up in the server log: every test message carries it. */
export const MARKER = "MARCADOR-PRIVADO-7731";

export async function startSession(page: Page, profile: RegExp = /Soy estudiante/) {
  await page.goto("/oraculo");
  await page.getByRole("button", { name: profile }).click();
  await page.getByLabel("Entiendo y quiero empezar").check();
  await page.getByRole("button", { name: "Empezar" }).click();
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toBeVisible();
}

export async function say(page: Page, text: string) {
  await page.getByRole("textbox", { name: "Tu mensaje" }).fill(`${text} ${MARKER}`);
  await page.getByRole("button", { name: "Enviar" }).click();
}
