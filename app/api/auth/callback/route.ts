import supabaseServer from "@/utils/supabaseServer"
import { NextApiRequest, NextApiResponse } from "next"

export async function GET(req: NextApiRequest, res: NextApiResponse) {

    
  const { token_hash, type } = Object.fromEntries(new URLSearchParams(req.body))
const { data: { session }, error } = await supabaseServer.auth.verifyOtp({ token_hash, type })
 
  return Response.json({ data:'hi' })
}