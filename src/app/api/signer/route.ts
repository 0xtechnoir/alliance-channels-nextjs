import { getSignedKey } from "@/utils/getSignedKey";
import { NextResponse } from "next/server";
import neynarClient from "@/lib/neynarClient";

export async function POST() {
  console.log("POST called in src/app/api/signer/route.ts")
  try {
    const signedKey = await getSignedKey();
    console.log("signedKey: ", signedKey)
    console.log("signedKey: ", signedKey)

    return NextResponse.json(signedKey, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const signer_uuid = searchParams.get("signer_uuid");
  
    if (!signer_uuid) {
      return NextResponse.json(
        { error: "signer_uuid is required" },
        { status: 400 }
      );
    }
  
    try {
      const signer = await neynarClient.lookupSigner(signer_uuid);
  
      return NextResponse.json(signer, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
  }
  