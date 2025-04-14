// vote.ts (client-side)
import snapshot from "@snapshot-labs/snapshot.js";
import { useAccount, useSigner } from "wagmi";

const client = new snapshot.Client712("https://hub.snapshot.org");

export async function voteOnSnapshot(
  proposalId: string,
  choice: number,
  reason: string
) {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  if (!signer || !address) throw new Error("No signer or address");

  const receipt = await client.vote(signer.provider, address, {
    space: "yam.eth",
    proposal: proposalId,
    type: "single-choice",
    choice,
    reason,
    app: "my-app",
  });

  // 可選：把 receipt 傳到你後端
  await fetch("/api/vote", {
    method: "POST",
    body: JSON.stringify({
      proposalId,
      choice,
      reason,
      voter: address,
      timestamp: Date.now(),
      receipt,
    }),
  });

  return receipt;
}
