import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Auth: ", req.headers.get("Authorization"));

  const res = NextResponse.next();
  // @ts-expect-error not typed but firebase should do this
  console.log("locals", res.locals);
  // @ts-expect-error not typed but firebase should do this
  console.log("auth", req["auth"]);

  return res;
}
