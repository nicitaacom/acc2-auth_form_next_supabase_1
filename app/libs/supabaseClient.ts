import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/interfaces/types_db"

const supabaseClient = createClientComponentClient<Database>()

export default supabaseClient
