"use client"

import React from 'react'

import {
    Sheet,
    SheetContent,
 SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
  

const MobileNav = () => {
    const pathname=usePathname();
    const { signOut } = useClerk();
  return (
    <header className='header'>
<Link href="/ " className="flex items-center gap-2 md:py-2">
<Image 
src="/assets/images/logo-text.svg"
alt="logo"
width={180}
height={28}
 />
</Link>
<nav className='flex gap-2'>
<SignedIn>
<button onClick={() => signOut({ redirectUrl: "/" })}>
        Sign Out
      </button>
      <Sheet>
   <SheetTrigger>
    <Image 
    src="/assets/icons/menu.svg"
    alt="menu"
    width={32}
    height={32}
    className='cursor-pointer'
    />
   </SheetTrigger>
   <SheetContent className='sheet-content sm:w-64'>
    <>
    <Image
    src="/assets/images/logo-text.svg"
    alt="logo"
    width="152"
    height="23"
    />
    <ul className='header-nav_elements'>
        
{navLinks.map((link)=>{
    const isActive=link.route===pathname
    return(
        <li 
        className={`${isActive && `gradient-text}p-18 flex whitespace-nowwrap text-dark-700`}`}
        key={link.route}>
            
<Link className="sidebar-link cursor-pointer" href={link.route}>

<Image
src={link.icon}
alt="logo"
width={24}
height={24}


 
/>
{link.label}
</Link>
        </li>
    )
})}
<li className="flex-center cursor-pointer gap-2 p-4">
<UserButton>
    
</UserButton>
</li>
    </ul>

    </>
  </SheetContent>
</Sheet>

</SignedIn>

<SignedOut>
<Button  asChild className="button bg-purple-gradient bg-cover">
    <Link href="/sign-in">
    Login
    </Link>
</Button>

</SignedOut>

</nav>
    </header>
  )
}

export default MobileNav