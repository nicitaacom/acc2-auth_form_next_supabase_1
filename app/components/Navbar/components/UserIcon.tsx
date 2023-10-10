import Image from "next/image"

import { BiUserCircle } from "react-icons/bi"
import { UserResponse } from "@supabase/supabase-js"

interface UserIconProps {
  user: UserResponse
}

export default function UserIcon({ user }: UserIconProps) {
  return (
    <>
      {!user.data.user?.user_metadata.avatar ? (
        <BiUserCircle className="cursor-pointer" size={32} />
      ) : user.data.user?.user_metadata.avatar ? (
        <Image
          className="rounded-full cursor-pointer"
          src={user.data.user?.user_metadata.avatar}
          alt="profile_picture_url"
          width={32}
          height={32}
        />
      ) : (
        <Image
          className="rounded-full cursor-pointer"
          src="/placeholder.jpg"
          alt="profile_picture_url"
          width={32}
          height={32}
        />
      )}
    </>
  )
}
