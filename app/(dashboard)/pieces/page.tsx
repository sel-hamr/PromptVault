import { auth } from "@/lib/auth";
import { listPiecesAction } from "@/lib/actions/piece.actions";
import { PiecesExplorer } from "./_components/pieces-explorer";
import type { Piece } from "./_components/types";

export default async function PiecesPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const ownerName = session?.user?.name || "You";

  if (!userId) {
    return null;
  }

  const piecesResult = await listPiecesAction({
    sort: "newest",
    take: 100,
  });

  const initialPieces: Piece[] =
    piecesResult?.data && "pieces" in piecesResult.data
      ? (piecesResult.data.pieces as Piece[])
      : [];

  return (
    <PiecesExplorer
      userId={userId}
      initialPieces={initialPieces}
      ownerName={ownerName}
    />
  );
}
