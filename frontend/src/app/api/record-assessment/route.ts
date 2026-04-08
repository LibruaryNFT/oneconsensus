export async function POST(): Promise<Response> {
  return Response.json({ error: "Disabled" }, { status: 410 })
}
