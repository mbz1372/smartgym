import { NextResponse } from "next/server";

const BASE_URL = process.env.EXERCISEDB_BASE_URL || "https://exercisedb.p.rapidapi.com";

async function proxyFetch(path: string) {
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.RAPIDAPI_KEY) {
    headers["X-RapidAPI-Key"] = process.env.RAPIDAPI_KEY;
    headers["X-RapidAPI-Host"] = process.env.RAPIDAPI_HOST || "exercisedb.p.rapidapi.com";
  }
  const res = await fetch(`${BASE_URL}${path}`, { headers, next: { revalidate: 120 } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const data = await proxyFetch(`/exercise/${params.id}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
