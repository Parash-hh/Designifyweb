"use client"
import { Button } from '@/components/ui/Button'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"

import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const menu = [
  {
    id: 1,
    name: 'Home',
    path: '/'
  },

  {
    id: 2,
    name: 'Products',
    path: '/products'
  },

  {
    id: 3,
    name: 'About Us',
    path: '/about'
  },
  {
    id: 4,
    name: 'Contact Us',
    path: '/contact'
  }
]

export type User = {
  email: string,
  name: string,
  picture: string

}

function Header() {

  const [user, setUser] = useState<User>();
  const  { userDetail, setUserDetail}= useContext(UserDetailContext) 
  const {cart,setCart}=useContext(CartContext);
  const [openProfile, setOpenProfile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== undefined) {
      try {
        //@ts-ignore
        const tokenResponse = JSON.parse(localStorage?.getItem('tokenResponse') ?? '{}');
        if (tokenResponse) {
          GetUserProfile(tokenResponse?.access_token);
        }
      }
      catch (e) {}
    }
  }, [])

  useEffect(() => {
  const handleClickOutside = () => {
    setOpenProfile(false)
  }

  if (openProfile) {
    window.addEventListener("click", handleClickOutside)
  }

  return () => {
    window.removeEventListener("click", handleClickOutside)
  }
  }, [openProfile])

  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 20)
  }

  window.addEventListener("scroll", handleScroll)

  return () => {
    window.removeEventListener("scroll", handleScroll)
  }
  }, [])

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse); //can delete this line
      localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse))
      await GetUserProfile(tokenResponse.access_token, true);
      //save to DB/Strapi Backend
    },
    onError: errorResponse => console.log(errorResponse),
  });

  //get user info
  const GetUserProfile = async (access_token: string, showToast = false) => {
    try {
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer ' + access_token } },
      );

      console.log(userInfo); //can delete this line
      setUser(userInfo?.data)
      setUserDetail(userInfo?.data)

      if(showToast){
        toast.success(`Welcome ${userInfo?.data?.name} 👋`, {
          position: "top-right",
          autoClose: 2000,
        })
      }

      SaveNewUser(userInfo?.data)
    }
    catch (e) {
      localStorage.setItem('tokenResponse', '')
    }

  }

  const SaveNewUser= async (user:User) => {
    const result = await axios.post('/api/users', {
      name: user.name,
      email: user.email,
      picture: user.picture
    });
    console.log(result.data);
  }
  useEffect(() => {
    user && GetCartList();
  }, [user] )

  const GetCartList=async()=>{
    const result=await axios.get('/api/cart?email='+user?.email);
    console.log(result.data);
    setCart(result.data);
  }

  const handleLogout = () => {
    localStorage.removeItem('tokenResponse')

    setUser(undefined)
    setUserDetail(null)
    setCart([])

    toast.success("Logged out successfully 👋")

    setOpenProfile(false)
    router.push('/')
  }

  return  (
    <div
        className={`sticky top-3 rounded-3xl z-50 flex items-center justify-between gap-4 px-6 py-3 transition-all duration-300
        ${
          scrolled
            ? "backdrop-blur-xl bg-white/60 shadow-md border-b border-white/20"
            : "bg-transparent"
        }`}
    >
      <Image src={'/logo.svg'} alt='Logo' width={80} height={300} />
      <ul className='flex gap-5'>
        {menu.map((item) => (
          <li key={item.id}>
            <Link href={item.path} className='cursor-pointer hover:text-primary transition'>
              {item.name}
            </Link>
            </li>
        ))}
      </ul>
      <div className='flex gap-7 items-center'>
         <Link href={'/carts'} className='flex gap-2 items-center'>
            <ShoppingCart /> <span className='p-1 bg-gray-100 px-2 rounded-4xl'>{cart?.length ?? 0}</span> 
        </Link>
        {!user ? <Button onClick={() => googleLogin()}>Sign In/Sign up</Button>
          :
        <div className="relative">
          <Image
            src={user?.picture}
            alt={user.name}
            width={37}
            height={38}
            className="rounded-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setOpenProfile(!openProfile)
            }}
          />

        <AnimatePresence>
          {openProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-44 backdrop-blur-2xl bg-white/50 shadow-2xl rounded-2xl border border-white/30 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 border-b text-sm text-gray-800">
                {user?.name}
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/40 rounded-b-2xl"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      }
      </div>
    </div>
  )
}

export default Header