import { expect, test } from "@playwright/test";
import { MARKER, say, startSession } from "./ayudas";

test.beforeEach(async ({ page }) => {
  // Accept the "leave page?" prompt that protects an open conversation
  page.on("dialog", (dialog) => dialog.accept());
});

test("el botón flotante lleva al Oráculo y se esconde durante la intro", async ({ page }) => {
  await page.goto("/docentes");
  await expect(page.getByRole("link", { name: /Necesitas hablar|Oráculo/ })).toBeHidden();

  await page.goto("/");
  await page.getByRole("link", { name: /Necesitas hablar|Oráculo/ }).click();
  await expect(page).toHaveURL(/\/oraculo$/);
  await expect(page.getByRole("heading", { name: "¿Quién eres?" })).toBeVisible();
});

test("no se puede empezar sin aceptar", async ({ page }) => {
  await page.goto("/oraculo");
  await page.getByRole("button", { name: /Soy docente/ }).click();
  const start = page.getByRole("button", { name: "Empezar" });
  await expect(start).toBeDisabled();
  await page.getByLabel("Entiendo y quiero empezar").check();
  await expect(start).toBeEnabled();
});

test("una conversación normal responde, descuenta mensajes y sobrevive a una recarga", async ({ page }) => {
  await startSession(page);
  await say(page, "me molestan en el grupo del curso");
  await expect(page.getByText("Respuesta simulada")).toBeVisible();
  await expect(page.getByText("Te quedan 29 mensajes")).toBeVisible();

  await page.reload();
  await expect(page.getByText(`me molestan en el grupo del curso ${MARKER}`)).toBeVisible();
  await expect(page.getByText("Respuesta simulada")).toBeVisible();
});

test("alto riesgo: responde y muestra el panel con botones para llamar", async ({ page }) => {
  await startSession(page);
  await say(page, "#alto todos los días se burlan de mí");
  await expect(page.getByText("Respuesta simulada")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Esto no es una broma" })).toBeVisible();
  await expect(page.getByRole("link", { name: /141/ }).first()).toHaveAttribute("href", "tel:141");
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toBeVisible();
});

test("peligro inmediato de un estudiante: pausa, sigue pausada al recargar y cierra con ayuda", async ({ page }) => {
  await startSession(page);
  await say(page, "#peligro esta noche");
  await expect(page.getByRole("heading", { name: "Tu seguridad es lo primero" })).toBeVisible();
  await expect(page.getByText("La conversación se pausó")).toBeVisible();
  await expect(page.getByText("Respuesta simulada")).toBeHidden();
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toBeHidden();

  await page.reload();
  await expect(page.getByText("La conversación se pausó")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toBeHidden();

  await page.getByRole("status").getByRole("button", { name: "Finalizar" }).click();
  await expect(page.getByRole("heading", { name: "Busca ayuda ahora" })).toBeVisible();
  await expect(page.getByRole("link", { name: /123/ }).first()).toHaveAttribute("href", "tel:123");
});

test("peligro inmediato contado por un docente: panel de emergencia y respuesta, sin pausar", async ({ page }) => {
  await startSession(page, /Soy docente/);
  await say(page, "#peligro un estudiante está armado");
  await expect(page.getByRole("heading", { name: "Puede ser una emergencia" })).toBeVisible();
  await expect(page.getByText("Respuesta simulada")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toBeVisible();
});

test("si la IA falla, lo explica y deja el texto para reintentar", async ({ page }) => {
  await startSession(page);
  await say(page, "#falla hola");
  await expect(page.getByRole("alert").filter({ hasText: "El Oráculo no pudo responder" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toHaveValue(`#falla hola ${MARKER}`);
  await expect(page.getByText("Te quedan 30 mensajes")).toBeVisible();
});

test("al finalizar muestra el resumen para copiar o imprimir", async ({ page }) => {
  await startSession(page, /Soy padre/);
  await say(page, "mi hijo no quiere ir al colegio");
  await expect(page.getByText("Respuesta simulada")).toBeVisible();
  await page.getByRole("banner").getByRole("button", { name: "Finalizar" }).click();
  await page.getByRole("button", { name: "Sí, finalizar" }).click();
  await expect(page.getByRole("heading", { name: "Resumen de la conversación" })).toBeVisible();
  await expect(page.getByText("Resumen simulado.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Imprimir" })).toBeVisible();

  await page.getByRole("button", { name: "Nueva conversación" }).click();
  await expect(page.getByRole("heading", { name: "¿Quién eres?" })).toBeVisible();
});

test("los textos legales son la versión final, sin aviso de borrador", async ({ page }) => {
  for (const path of ["/oraculo/terminos", "/oraculo/autorizacion"]) {
    await page.goto(path);
    await expect(page.getByText("Borrador pendiente de revisión jurídica")).toHaveCount(0);
  }
  await page.goto("/oraculo/privacidad");
  await expect(page.getByRole("heading", { name: "Política de privacidad", exact: true })).toBeVisible();
  await expect(page.getByText("Borrador pendiente de revisión jurídica")).toHaveCount(0);
});
