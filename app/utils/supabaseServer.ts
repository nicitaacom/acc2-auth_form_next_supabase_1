import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/interfaces/types_db"

const supabaseServer = createServerComponentClient<Database>({ cookies })

export default supabaseServer