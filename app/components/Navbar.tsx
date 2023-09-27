import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { NavLinks } from '@/app/constants'
import AuthProvider from './AuthProvider'
import { getCurrentUser } from '@/lib/session'
import ProfileMenu from './ProfileMenu'


const Navbar = async() => {
    const session= await getCurrentUser();
  return (
    <nav className="flexBetween navbar">
        <div className="flex-1 flexStart gap-10">
            <Link href="/">
                <Image
                    src="/logo.svg"
                    alt="Flexxible"
                    width={115}
                    height={115}
                />
            </Link>
            <ul className="xl:flex hidden text-small gap-7">
                {NavLinks.map((link)=>{
                    return ( <Link href={link.href} key={link.key}>
                        {link.text}
                    </Link>)
                })}
            </ul>
        </div>
        <div className="flexCenter gap-4">
                {session?.user ?(
                    <>
                    <ProfileMenu session={session}/>
                    <Link href="/create-project">
                        <button className="btn btn-primary">Create</button>
                    </Link>
                    </>
                ):(<AuthProvider/>)}
        </div>
    </nav>
  )
}

export default Navbar