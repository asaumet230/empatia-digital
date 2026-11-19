import { ALGORITHM_GAME, type FeedPost } from "@/lib/content/estudiantes";

/* ------------------------------------------------------------------ */
/*  Rules of "Tú eres el algoritmo", apart from the screens so they    */
/*  can be tested: score, harm, the goal, what the algorithm picks by  */
/*  itself and how each round's posts are ordered.                     */
/* ------------------------------------------------------------------ */

const { goal, rounds, valentina } = ALGORITHM_GAME;

export type HarmLevel = "high" | "medium" | "low";

/** Total «me gusta» and total harm of the posts boosted so far. */
export function totals(chosen: readonly FeedPost[]) {
  return {
    likes: chosen.reduce((sum, post) => sum + post.likes, 0),
    harm: chosen.reduce((sum, post) => sum + post.harm, 0),
  };
}

/** How much the boosted posts hurt Valentina; picks her messages and the story's ending. */
export const harmLevel = (harm: number): HarmLevel =>
  harm >= valentina.high.min ? "high" : harm >= valentina.medium.min ? "medium" : "low";

export const reachedGoal = (likes: number) => likes >= goal;

/** «Me gusta» still missing for the goal (0 once it is reached). */
export const missingToGoal = (likes: number) => Math.max(0, goal - likes);

/** Time's up: the algorithm does what algorithms do and shows the post with the most likes. */
export const mostLiked = (posts: readonly FeedPost[]) =>
  posts.reduce((top, post, i) => (post.likes > posts[top].likes ? i : top), 0);

/** After a round: the next one, or the result once the last round is done. */
export const nextStage = (round: number): number | "resultado" => (round + 1 < rounds.length ? round + 1 : "resultado");

/** Fisher–Yates: every order is equally likely, so the post that mocks Valentina moves around. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
