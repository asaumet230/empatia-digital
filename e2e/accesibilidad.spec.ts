import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { say, startSession } from "./ayudas";

/** Serious or critical accessibility problems (contrast, names, labels, structure). */
async function audit(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`accesibilidad · ${colorScheme === "light" ? "claro" : "oscuro"}`, () => {
    test.use({ colorScheme });
    test.beforeEach(async ({ page }) => page.on("dialog", (d) => d.accept()));

    test("perfil, consentimiento, chat con panel, emergencia y cierre", async ({ page }) => {
      await page.goto("/oraculo");
      expect(await audit(page), "perfil").toEqual([]);

      await page.getByRole("button", { name: /Soy estudiante/ }).click();
      expect(await audit(page), "consentimiento").toEqual([]);

      await page.getByLabel("Entiendo y quiero empezar").check();
      await page.getByRole("button", { name: "Empezar" }).click();
      await say(page, "#alto se burlan de mí");
      await expect(page.getByRole("heading", { name: "Esto no es una broma" })).toBeVisible();
      expect(await audit(page), "chat con panel de ayuda").toEqual([]);

      await page.getByRole("button", { name: "Ayuda" }).or(page.getByRole("button", { name: "Líneas de ayuda" })).first().click();
      expect(await audit(page), "líneas de ayuda").toEqual([]);
      await page.keyboard.press("Escape");

      await say(page, "#peligro");
      await expect(page.getByText("La conversación se pausó")).toBeVisible();
      expect(await audit(page), "emergencia").toEqual([]);
    });

    test("resumen de cierre", async ({ page }) => {
      await startSession(page);
      await say(page, "hola");
      await expect(page.getByText("Respuesta simulada")).toBeVisible();
      await page.getByRole("banner").getByRole("button", { name: "Finalizar" }).click();
      await page.getByRole("button", { name: "Sí, finalizar" }).click();
      await expect(page.getByRole("heading", { name: "Resumen de la conversación" })).toBeVisible();
      expect(await audit(page), "cierre").toEqual([]);
    });

    test("política y formato de autorización", async ({ page }) => {
      for (const path of ["/oraculo/privacidad", "/oraculo/autorizacion"]) {
        await page.goto(path);
        expect(await audit(page), path).toEqual([]);
      }
    });
  });
}
