import neynarClient from "@/lib/neynarClient";
import { ViemLocalEip712Signer } from "@farcaster/hub-nodejs";
import { bytesToHex, hexToBytes } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { getFid } from "./getFid";

export const getSignedKey = async () => {
  console.log("getSignedKey called in src/utils/getSignedKey.ts")
  const createSigner = await neynarClient.createSigner();
  console.log("createSigner: ", createSigner)
  const { deadline, signature } = await generate_signature(
    createSigner.public_key
  );

  console.log("deadline: ", deadline)
  console.log("signature: ", signature)

  if (deadline === 0 || signature === "") {
    throw new Error("Failed to generate signature");
  }

  const fid = await getFid();

  const signedKey = await neynarClient.registerSignedKey(
    createSigner.signer_uuid,
    fid,
    deadline,
    signature
  );

  return signedKey;
};

const generate_signature = async function (public_key: string) {
  console.log("generate_signature called in src/utils/getSignedKey.ts")
  if (typeof process.env.FARCASTER_DEVELOPER_MNEMONIC === "undefined") {
    throw new Error("FARCASTER_DEVELOPER_MNEMONIC is not defined");
  }

  const FARCASTER_DEVELOPER_MNEMONIC = process.env.FARCASTER_DEVELOPER_MNEMONIC;
  const FID = await getFid();

  console.log("FARCASTER_DEVELOPER_MNEMONIC: ", FARCASTER_DEVELOPER_MNEMONIC)
  console.log("FID: ", FID)

  const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);
  const appAccountKey = new ViemLocalEip712Signer(account as any);

  // Generates an expiration date for the signature (24 hours from now).
  const deadline = Math.floor(Date.now() / 1000) + 86400;

  const uintAddress = hexToBytes(public_key as `0x${string}`);

  const signature = await appAccountKey.signKeyRequest({
    requestFid: BigInt(FID),
    key: uintAddress,
    deadline: BigInt(deadline),
  });

  if (signature.isErr()) {
    return {
      deadline,
      signature: "",
    };
  }

  const sigHex = bytesToHex(signature.value);

  return { deadline, signature: sigHex };
};