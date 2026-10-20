import { describe, expect, it } from "vitest";
import { deserialize, INITIAL_STATE, oracleReducer, serialize, type OracleAction, type OracleState } from "@/lib/oraculo/estado";

const run = (...actions: OracleAction[]) => actions.reduce(oracleReducer, INITIAL_STATE);
const chatting = (): OracleState =>
  run(
    { type: "elegir", profile: "estudiante" },
    { type: "iniciando" },
    { type: "iniciada", info: { token: "t0", remaining: 30, endsAt: 0 } },
  );
const reply = (text: string, safety: OracleState["locked"] = null): OracleAction => ({
  type: "resultado",
  text,
  result: { type: "respuesta", reply: `re: ${text}`, safety, token: `t-${text}`, remaining: 29, endsAt: 0 },
});

describe("estado del Oráculo en el navegador", () => {
  it("perfil → consentimiento → chat", () => {
    const s = chatting();
    expect(s).toMatchObject({ phase: "chat", profile: "estudiante", token: "t0", busy: null });
  });

  it("cerrar la autorización ya en el chat no reinicia la conversación", () => {
    expect(oracleReducer(chatting(), { type: "volver" })).toMatchObject({ phase: "chat", token: "t0" });
  });

  it("si se cierra la autorización mientras abre la sesión, no entra al chat", () => {
    const s = run(
      { type: "elegir", profile: "docente" },
      { type: "iniciando" },
      { type: "volver" },
      { type: "iniciada", info: { token: "t0", remaining: 30, endsAt: 0 } },
    );
    expect(s).toMatchObject({ phase: "perfil", profile: null, token: null, busy: null });
  });

  it("muestra el mensaje enviado mientras llega la respuesta, y luego guarda ambos", () => {
    let s = oracleReducer(chatting(), { type: "enviando", text: "hola" });
    expect(s).toMatchObject({ busy: "send", pending: "hola" });
    s = oracleReducer(s, reply("hola"));
    expect(s.history).toEqual([
      { role: "usuario", text: "hola" },
      { role: "oraculo", text: "re: hola" },
    ]);
    expect(s).toMatchObject({ pending: null, busy: null, token: "t-hola", remaining: 29 });
  });

  it("ancla el panel de ayuda después de la respuesta y no lo repite en cada mensaje", () => {
    let s = oracleReducer(chatting(), reply("a", "acoso_grave"));
    s = oracleReducer(s, reply("b", "acoso_grave"));
    s = oracleReducer(s, reply("c", "autolesion"));
    expect(s.panels).toEqual([
      { after: 1, key: "acoso_grave" },
      { after: 5, key: "autolesion" },
    ]);
  });

  it("una detención bloquea el chat y muestra el panel tras el mensaje de la persona", () => {
    const s = oracleReducer(chatting(), {
      type: "resultado",
      text: "ayuda",
      result: { type: "detenido", safety: "peligro_inmediato", token: "t1" },
    });
    expect(s).toMatchObject({ locked: "peligro_inmediato", token: "t1" });
    expect(s.history).toEqual([{ role: "usuario", text: "ayuda" }]);
    expect(s.panels).toEqual([{ after: 0, key: "peligro_inmediato" }]);
  });

  it("un límite no agrega el mensaje", () => {
    const s = oracleReducer(chatting(), { type: "resultado", text: "x", result: { type: "limite", reason: "tiempo" } });
    expect(s).toMatchObject({ limit: "tiempo", history: [] });
  });

  it("un error suelta el mensaje pendiente para reintentar", () => {
    let s = oracleReducer(chatting(), { type: "enviando", text: "hola" });
    s = oracleReducer(s, { type: "fallo", error: "ia_no_disponible" });
    expect(s).toMatchObject({ pending: null, busy: null, error: "ia_no_disponible", history: [] });
  });

  it("el cierre guarda el resumen y olvida el pase", () => {
    const s = oracleReducer(chatting(), { type: "cerrada", result: { type: "cierre", summary: "Resumen" } });
    expect(s).toMatchObject({ phase: "cierre", summary: "Resumen", token: null });
  });

  it("si el cierre falla, igual se llega a la pantalla final", () => {
    expect(oracleReducer(chatting(), { type: "cerrada", result: null })).toMatchObject({
      phase: "cierre",
      closingFailed: true,
    });
  });

  it("guarda solo lo duradero y recupera lo guardado", () => {
    const s = oracleReducer(oracleReducer(chatting(), reply("hola")), { type: "enviando", text: "otro" });
    const raw = serialize(s);
    expect(JSON.parse(raw)).not.toHaveProperty("pending");
    expect(deserialize(raw)).toMatchObject({ phase: "chat", token: "t-hola", pending: null, busy: null });
  });

  it.each([null, "", "no es json", '{"phase":"otra"}'])("lo guardado ilegible empieza de cero: %j", (raw) => {
    expect(deserialize(raw)).toEqual(INITIAL_STATE);
  });
});
