import { NextResponse } from "next/server";

const BASE_URL = process.env.EXERCISEDB_BASE_URL || "https://exercisedb.p.rapidapi.com";

async function proxyFetch(path: string) {
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.RAPIDAPI_KEY) {
    headers["X-RapidAPI-Key"] = process.env.RAPIDAPI_KEY;
    headers["X-RapidAPI-Host"] = process.env.RAPIDAPI_HOST || "exercisedb.p.rapidapi.com";
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "ExerciseDB request failed");
  }
  return res.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bodyPart = searchParams.get("bodyPart");
    const equipment = searchParams.get("equipment");
    let data = await proxyFetch(`/exercises`);
    if (bodyPart) data = data.filter((ex: any) => ex.bodyPart === bodyPart);
    if (equipment) data = data.filter((ex: any) => ex.equipment === equipment);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
