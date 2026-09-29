import type { VideoGuide } from "@/lib/content/prompt-exercise";

/** How to connect Tally to ChatGPT, shown next to every "Con Tally" prompt. */
export const TALLY_GUIDE: VideoGuide = {
  button: "¿Cómo conectar Tally? · 2 videos",
  title: "Cómo conectar Tally a ChatGPT",
  note: "Funciona con la cuenta gratuita de ChatGPT. Si ya tienes cuenta en Tally, empieza en el paso 2.",
  steps: [
    {
      label: "Paso 1 · Crea tu cuenta",
      text: "En ChatGPT abre Complementos y busca Tally. Si no tienes cuenta, Tally te pide crearla: se crea, pero el complemento todavía no queda instalado.",
      src: "/assets/videos/tally-1-crear-cuenta.mp4",
      poster: "/assets/videos/tally-1-crear-cuenta.jpg",
    },
    {
      label: "Paso 2 · Instala y autoriza",
      text: "Vuelve a Complementos, abre Tally, pulsa “Instalar complemento” y acepta que ChatGPT se conecte con tu cuenta de Tally.",
      src: "/assets/videos/tally-2-conectar.mp4",
      poster: "/assets/videos/tally-2-conectar.jpg",
    },
  ],
};
