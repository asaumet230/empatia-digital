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

/** Says who is talking, accepts the consent and answers the optional nickname (none by default). */
export async function startSession(page: Page, answer = "soy estudiante", alias = "sigamos") {
  await page.goto("/oraculo");
  await introduce(page, answer);
  await page.getByLabel("Entiendo y quiero empezar").check();
  await page.getByRole("button", { name: "Empezar" }).click();
  // After the consent the Oráculo asks for a nickname; the conversation opens once it is answered
  await expect(page.getByText(/¿Cómo te gustaría que te llame\?/)).toBeVisible();
  await introduce(page, alias);
  await expect(page.getByRole("button", { name: "Cambiar perfil" })).toBeVisible();
}

export async function say(page: Page, text: string) {
  await page.getByRole("textbox", { name: "Tu mensaje" }).fill(`${text} ${MARKER}`);
  await page.getByRole("button", { name: "Enviar" }).click();
}
