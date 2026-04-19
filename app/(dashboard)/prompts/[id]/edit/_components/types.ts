import type { listPiecesAction } from "@/lib/actions/piece.actions";

type ListPiecesResult = NonNullable<Awaited<ReturnType<typeof listPiecesAction>>>["data"];

export type EditPiece = NonNullable<NonNullable<ListPiecesResult>["pieces"]>[number];
