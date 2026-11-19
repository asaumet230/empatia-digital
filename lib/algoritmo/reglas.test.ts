import { describe, expect, it } from "vitest";
import { harmLevel, missingToGoal, mostLiked, nextStage, reachedGoal, shuffle, totals } from "@/lib/algoritmo/reglas";
import { ALGORITHM_GAME, type FeedPost } from "@/lib/content/estudiantes";

const { rounds, goal } = ALGORITHM_GAME;

/** In each round, the post that hurts Valentina the most and the kindest one. */
const cruelest = (posts: readonly FeedPost[]) => posts.reduce((a, b) => (b.harm > a.harm ? b : a));
const kindest = (posts: readonly FeedPost[]) => posts.reduce((a, b) => (b.harm < a.harm ? b : a));

describe("juego del algoritmo: así está armado", () => {
  it("tiene 6 rondas cada vez más rápidas: 10, 8, 6, 4, 4 y 4 segundos", () => {
    expect(rounds.map((r) => r.seconds)).toEqual([10, 8, 6, 4, 4, 4]);
  });

  it("en cada ronda, la publicación que más «me gusta» da es una que lastima a Valentina", () => {
    for (const { posts } of rounds) {
      expect(posts[mostLiked(posts)].harm).toBeGreaterThan(0);
    }
  });

  it("burlarse siempre llega a la meta; no burlarse nunca llega", () => {
    expect(reachedGoal(totals(rounds.map((r) => cruelest(r.posts))).likes)).toBe(true);
    expect(reachedGoal(totals(rounds.map((r) => kindest(r.posts))).likes)).toBe(false);
  });

  it("si el tiempo se acaba en todas las rondas, el algoritmo llega a la meta lastimando mucho", () => {
    const auto = totals(rounds.map((r) => r.posts[mostLiked(r.posts)]));
    expect(reachedGoal(auto.likes)).toBe(true);
    expect(harmLevel(auto.harm)).toBe("high");
  });

  it("los ids de las publicaciones no se repiten", () => {
    const ids = rounds.flatMap((r) => r.posts.map((p) => p.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("juego del algoritmo: reglas", () => {
  it("suma los «me gusta» y el daño de lo elegido", () => {
    const [a, b] = rounds[0].posts;
    expect(totals([a, b])).toEqual({ likes: a.likes + b.likes, harm: a.harm + b.harm });
    expect(totals([])).toEqual({ likes: 0, harm: 0 });
  });

  it("el daño decide los mensajes de Valentina: bajo, medio o alto", () => {
    expect(harmLevel(-3)).toBe("low");
    expect(harmLevel(0)).toBe("low");
    expect(harmLevel(ALGORITHM_GAME.valentina.medium.min)).toBe("medium");
    expect(harmLevel(ALGORITHM_GAME.valentina.high.min - 1)).toBe("medium");
    expect(harmLevel(ALGORITHM_GAME.valentina.high.min)).toBe("high");
  });

  it("dice cuánto falta para la meta, sin bajar de cero", () => {
    expect(missingToGoal(0)).toBe(goal);
    expect(missingToGoal(goal - 1)).toBe(1);
    expect(missingToGoal(goal + 500)).toBe(0);
    expect(reachedGoal(goal)).toBe(true);
    expect(reachedGoal(goal - 1)).toBe(false);
  });

  it("después de cada ronda viene la siguiente y, tras la última, el resultado", () => {
    expect(nextStage(0)).toBe(1);
    expect(nextStage(rounds.length - 2)).toBe(rounds.length - 1);
    expect(nextStage(rounds.length - 1)).toBe("resultado");
  });

  it("mezcla las publicaciones sin perder ni repetir ninguna", () => {
    const items = [0, 1, 2, 3, 4];
    for (let n = 0; n < 50; n++) {
      expect([...shuffle(items)].sort()).toEqual(items);
    }
    expect(items).toEqual([0, 1, 2, 3, 4]);
  });

  it("la mezcla cambia el orden (no deja siempre la misma publicación en el mismo lugar)", () => {
    // A fixed sequence of "random" numbers makes the result predictable
    const seq = [0.1, 0.9, 0.5, 0.3];
    let k = 0;
    const order = shuffle([0, 1, 2, 3, 4], () => seq[k++ % seq.length]);
    expect(order).not.toEqual([0, 1, 2, 3, 4]);
    const firsts = new Set(Array.from({ length: 40 }, () => shuffle([0, 1, 2])[0]));
    expect(firsts.size).toBeGreaterThan(1);
  });
});
