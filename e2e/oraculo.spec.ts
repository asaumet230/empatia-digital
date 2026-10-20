import { expect, test } from "@playwright/test";
import { introduce, MARKER, say, startSession } from "./ayudas";

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
  await expect(page.getByText(/Hola, ¿cómo estás\? Soy el Oráculo/)).toBeVisible({ timeout: 10_000 });
});

test("entra directo al chat: saluda escribiendo, pregunta quién eres y pide la autorización", async ({ page }) => {
  await page.goto("/oraculo");
  // The field stays off while the Oráculo types its greeting
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toBeDisabled({ timeout: 10_000 });
  await expect(page.getByText("El Oráculo está escribiendo…").first()).toBeVisible();

  // An answer that does not say who they are gets a gentle retry, with no AI involved
  await introduce(page, "hola");
  await expect(page.getByText(/Perdona, no te entendí bien/)).toBeVisible();

  await introduce(page, "soy la profe");

  const dialog = page.getByRole("dialog", { name: "Antes de empezar" });
  const start = dialog.getByRole("button", { name: "Empezar" });
  await expect(start).toBeDisabled();
  await dialog.getByLabel("Entiendo y quiero empezar").check();
  await expect(start).toBeEnabled();

  // Closing the dialog goes back to the choice
  await dialog.getByRole("button", { name: "Volver" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText(/Está bien. Cuando quieras, cuéntame/)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Tu mensaje" })).toBeEnabled();
});

test("se puede cambiar el perfil antes del primer mensaje", async ({ page }) => {
  await startSession(page, "soy docente");
  await expect(page.getByText(/Te oriento para manejar una situación/)).toBeVisible();
  await page.getByRole("button", { name: "Cambiar perfil" }).click();
  await expect(page.getByText(/Hola, ¿cómo estás\? Soy el Oráculo/)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/Te oriento para manejar una situación/)).toBeHidden();
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

test("el chat baja solo con cada mensaje y, al subir, ofrece volver al final", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await startSession(page);
  for (const text of ["uno", "dos", "tres"]) {
    await say(page, text);
    await expect(page.getByText("Respuesta simulada").last()).toBeVisible();
  }
  const toEnd = page.getByRole("button", { name: "Ir al final de la conversación" });
  await expect(toEnd).toBeHidden();
  // Let the smooth scroll to the last reply finish before scrolling up
  await page.waitForFunction(() => document.documentElement.scrollHeight - (scrollY + innerHeight) < 2);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(toEnd).toBeVisible();
  // It fades in; clicking mid-animation would make Playwright scroll it into view and hide it again
  await expect(toEnd).toHaveCSS("opacity", "1");
  await toEnd.click();
  await expect(toEnd).toBeHidden();
  await expect(page.getByText(`tres ${MARKER}`)).toBeInViewport();
});

test("con un apodo, la bienvenida lo usa y viaja con cada mensaje para la IA", async ({ page }) => {
  await startSession(page, "soy estudiante", "llámame Lu");
  await expect(page.getByText(/Gracias, Lu\. Aquí puedes hablar/)).toBeVisible();
  const request = page.waitForRequest("**/api/oraculo/mensaje");
  await say(page, "hola");
  expect((await request).postDataJSON()).toMatchObject({ alias: "Lu" });
});

test("sin apodo, la bienvenida no inventa uno y no se envía nada", async ({ page }) => {
  await startSession(page, "soy estudiante", "sigamos");
  await expect(page.getByText(/Gracias\. Aquí puedes hablar/)).toBeVisible();
  const request = page.waitForRequest("**/api/oraculo/mensaje");
  await say(page, "hola");
  expect((await request).postDataJSON()).toMatchObject({ alias: null });
});

test("se pueden agregar emojis de emociones al mensaje", async ({ page }) => {
  await startSession(page);
  const box = page.getByRole("textbox", { name: "Tu mensaje" });
  await box.fill("hoy me siento ");
  await page.getByRole("button", { name: "Agregar un emoji" }).click();
  await page.getByRole("button", { name: "triste", exact: true }).click();
  await expect(box).toHaveValue("hoy me siento 😢");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("group", { name: "¿Cómo te sientes?" })).toBeHidden();
});

test("el tema se elige en un menú (automático, claro u oscuro) y se recuerda al volver", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await startSession(page);
  const html = page.locator("html");
  const theme = page.getByRole("button", { name: /^Tema:/ });
  const pick = async (option: string) => {
    await page.getByRole("button", { name: /^Tema:/ }).click();
    await page.getByRole("button", { name: option, exact: true }).click();
  };

  await expect(theme).toHaveAttribute("title", "Tema: automático");
  await pick("Claro");
  await expect(html).toHaveAttribute("data-oraculo-tema", "claro");
  await pick("Oscuro");
  await expect(html).toHaveAttribute("data-oraculo-tema", "oscuro");
  await expect(page.locator("header")).toHaveCSS("background-color", "rgb(10, 22, 32)");

  await page.reload();
  await expect(html).toHaveAttribute("data-oraculo-tema", "oscuro");
  await pick("Automático");
  await expect(html).not.toHaveAttribute("data-oraculo-tema", /.*/);
});

test("en un celular pequeño el encabezado cabe completo", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 700 });
  await startSession(page);
  const header = page.locator("header > div");
  const overflow = await header.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  for (const name of ["Finalizar", "Líneas de ayuda", "Ayuda"]) {
    const button = page.getByRole("banner").getByRole("button", { name, exact: true });
    if (await button.count()) await expect(button).toBeInViewport({ ratio: 1 });
  }
  await expect(page.getByRole("banner").getByRole("button", { name: /^Tema:/ })).toBeInViewport({ ratio: 1 });
});

test("las líneas de ayuda caben en la ventana sin scroll en un portátil", async ({ page, isMobile }) => {
  test.skip(isMobile, "pantalla de computador");
  await page.setViewportSize({ width: 1280, height: 800 });
  await startSession(page);
  await page.getByRole("button", { name: "Líneas de ayuda" }).click();
  const dialog = page.getByRole("dialog", { name: "Líneas de ayuda" });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(0);
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
  await startSession(page, "soy docente");
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
  await startSession(page, "soy el papá");
  await say(page, "mi hijo no quiere ir al colegio");
  await expect(page.getByText("Respuesta simulada")).toBeVisible();
  await page.getByRole("banner").getByRole("button", { name: "Finalizar" }).click();
  await page.getByRole("button", { name: "Sí, finalizar" }).click();
  await expect(page.getByRole("heading", { name: "Resumen de la conversación" })).toBeVisible();
  await expect(page.getByText("Resumen simulado.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Imprimir" })).toBeVisible();

  await page.getByRole("button", { name: "Nueva conversación" }).click();
  await expect(page.getByText(/Hola, ¿cómo estás\? Soy el Oráculo/)).toBeVisible({ timeout: 10_000 });
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
