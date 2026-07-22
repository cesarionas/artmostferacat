import { NextRequest, NextResponse } from "next/server";
import { getPeople } from "@/services/people.service";
export async function GET(request: NextRequest) { const q = request.nextUrl.searchParams.get("q") ?? ""; const page = Number(request.nextUrl.searchParams.get("page") ?? 0); return NextResponse.json(await getPeople(q, page)); }
