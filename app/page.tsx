import { OpenAuthModalButton, UserIcon } from "./components/Navbar/components";
import { AuthModal } from "./components/ui/Modals/AuthModal";
import { AuthModalContainer } from "./components/ui/Modals/ModalContainers/AuthModalContainer";

export default function Home() {
 
  return (

  <nav className="px-8 py-4 flex justify-between items-center gap-x-4">
    <OpenAuthModalButton/>
    <UserIcon/>

    <AuthModalContainer>
      <AuthModal label="Auth"/>
    </AuthModalContainer>
  </nav>
    
  )
}
