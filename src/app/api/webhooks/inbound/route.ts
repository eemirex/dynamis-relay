import { NextResponse } from "next/server";
import { verifyInbound } from "@/lib/webhook-signature";

export async function POST(request: Request) {
  const payload=await request.text(); const timestamp=request.headers.get("x-relay-timestamp")||""; const signature=request.headers.get("x-relay-signature")||""; const secret=process.env.INBOUND_WEBHOOK_SECRET;
  if(!secret)return NextResponse.json({error:"Webhook receiver is not configured."},{status:503});
  if(!verifyInbound(payload,timestamp,signature,secret))return NextResponse.json({error:"Invalid signature."},{status:401});
  const event=JSON.parse(payload) as { id?: string }; if(!event.id)return NextResponse.json({error:"Event id is required."},{status:400});
  // A production adapter claims the idempotency key and enqueues processing here.
  return NextResponse.json({accepted:true,eventId:event.id},{status:202});
}
