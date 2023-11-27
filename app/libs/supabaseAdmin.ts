import { createClient } from "@supabase/supabase-js"
import { Database } from "@/interfaces/types_db"

const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SERVICE_ROLE_KEY)

export default supabaseAdmin
