import { Prisma, ModelTarget } from "@prisma/client";
import { db } from "@/lib/db";

export type ActivityPoint = { date: string; prompts: number; pieces: number; forks: number };

const dashboardPromptInclude = {
  category: { select: { id: true, name: true, slug: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
} satisfies Prisma.PromptInclude;

export type DashboardPrompt = Prisma.PromptGetPayload<{
  include: typeof dashboardPromptInclude;
}>;

export type DashboardStats = {
  promptCount: number;
  pieceCount: number;
  totalUses: number;
  totalForks: number;
};

export type ModelStat = { model: ModelTarget; count: number };

function buildActivitySeries(
  promptDates: { created_at: Date }[],
  pieceDates: { created_at: Date }[],
  forkDates: { created_at: Date }[],
): ActivityPoint[] {
  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const points: ActivityPoint[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    return { date: d.toISOString().slice(0, 10), prompts: 0, pieces: 0, forks: 0 };
  });

  const byDate = Object.fromEntries(points.map((p) => [p.date, p]));
  for (const { created_at } of promptDates) {
    const key = created_at.toISOString().slice(0, 10);
    if (byDate[key]) byDate[key].prompts++;
  }
  for (const { created_at } of pieceDates) {
    const key = created_at.toISOString().slice(0, 10);
    if (byDate[key]) byDate[key].pieces++;
  }
  for (const { created_at } of forkDates) {
    const key = created_at.toISOString().slice(0, 10);
    if (byDate[key]) byDate[key].forks++;
  }
  return points;
}

export async function fetchDashboardData(userId: string) {
  const since14 = new Date();
  since14.setDate(since14.getDate() - 13);
  since14.setHours(0, 0, 0, 0);

  const [
    promptCount,
    pieceCount,
    agg,
    recentPrompts,
    topPrompts,
    modelGroups,
    recentPromptDates,
    recentPieceDates,
    recentForkDates,
  ] = await Promise.all([
      db.prompt.count({ where: { user_id: userId } }),
      db.promptPiece.count({ where: { user_id: userId } }),
      db.prompt.aggregate({
        where: { user_id: userId },
        _sum: { use_count: true, fork_count: true },
      }),
      db.prompt.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
        take: 5,
        include: dashboardPromptInclude,
      }),
      db.prompt.findMany({
        where: { user_id: userId },
        orderBy: { use_count: "desc" },
        take: 3,
        include: dashboardPromptInclude,
      }),
      db.prompt.groupBy({
        by: ["model_target"],
        where: { user_id: userId },
        _count: { model_target: true },
        orderBy: { _count: { model_target: "desc" } },
      }),
      db.prompt.findMany({
        where: { user_id: userId, created_at: { gte: since14 } },
        select: { created_at: true },
      }),
      db.promptPiece.findMany({
        where: { user_id: userId, created_at: { gte: since14 } },
        select: { created_at: true },
      }),
      db.prompt.findMany({
        where: { created_at: { gte: since14 }, forked_from: { user_id: userId } },
        select: { created_at: true },
      }),
    ]);

  const stats: DashboardStats = {
    promptCount,
    pieceCount,
    totalUses: agg._sum.use_count ?? 0,
    totalForks: agg._sum.fork_count ?? 0,
  };

  const modelDistribution: ModelStat[] = modelGroups.map((g) => ({
    model: g.model_target,
    count: g._count.model_target,
  }));

  const activityData = buildActivitySeries(recentPromptDates, recentPieceDates, recentForkDates);

  return { stats, recentPrompts, topPrompts, modelDistribution, activityData };
}
