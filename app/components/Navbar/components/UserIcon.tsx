import Image from "next/image"

import {BiUserCircle} from 'react-icons/bi'
import supabaseServer from "@/utils/supabaseServer"

export default async function UserIcon () {
  

  
    const {data} = await supabaseServer.auth.getUser()
      
      return (
    <>
    {!data.user ? <BiUserCircle className='cursor-pointer' size={32}/>
    :
     data.user.user_metadata.avatar ?  <Image className="rounded-full cursor-pointer" src={data.user.user_metadata.avatar} alt='profile_picture_url' width={32} height={32}/>
      : <Image className="rounded-full cursor-pointer" src='/placeholder.jpg' alt='profile_picture_url' width={32} height={32}/> }
    </>
)
}