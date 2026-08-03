import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ticketStates, transitionTicket, type TicketState } from "@/lib/reliability/state-machine";

export async function POST(request: Request,{params}:{params:Promise<{id:string}>}){const user=await requireUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const {id}=await params;const body=(await request.json().catch(()=>({}))) as {from?:string;to?:string};if(!ticketStates.includes(body.from as TicketState)||!ticketStates.includes(body.to as TicketState))return NextResponse.json({error:"Valid from and to states are required."},{status:400});try{return NextResponse.json({ticketId:id,transition:transitionTicket(body.from as TicketState,body.to as TicketState),actorId:user.id});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Invalid transition"},{status:409});}}
