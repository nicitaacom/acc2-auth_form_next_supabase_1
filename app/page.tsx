import { LoginButton, LogoutButton } from "./(auth)/login/components"
import RegisterButton from "./(auth)/login/components/RegisterButton"
import supabaseServer from "./utils/supabaseServer"

export default async function Home() {
  //Assuming you already have input with validation - https://codesandbox.io/p/sandbox/input-validation-react-hook-form-solved-ndklv3
  const {
    data: { session },
  } = await supabaseServer.auth.getSession()
  return (
    <div>
      <h1 className="text-2xl text-center">Auth</h1>
      {session && <p>session</p>}
      <RegisterButton />
      <LoginButton />
      <LogoutButton />
    </div>
  )
}
