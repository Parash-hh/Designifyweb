"use client"
import { Button } from '@/components/ui/Button'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import React, { useContext, useEffect, useState } from 'react'

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
    path: '/'
  },
  {
    id: 4,
    name: 'Contact Us',
    path: '/'
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse))
      await GetUserProfile(tokenResponse.access_token);
      //save to DB/Strapi Backend
    },
    onError: errorResponse => console.log(errorResponse),
  });

  //get user info
  const GetUserProfile = async (access_token: string) => {
    try {
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer ' + access_token } },
      );

      console.log(userInfo);
      setUser(userInfo?.data)
      setUserDetail(userInfo?.data)
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

  return  (
    <div className='flex items-center justify-between gap-4'>
      <Image src={'/logo.svg'} alt='Logo' width={80} height={300} />
      <ul className='flex gap-5'>
        {menu.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div className='flex gap-7 items-center'>
         <Link href={'/carts'} className='flex gap-2 items-center'>
            <ShoppingCart /> <span className='p-1 bg-gray-100 px-2 rounded-4xl'>{cart?.length ?? 0}</span> 
        </Link>
        {!user ? <Button onClick={() => googleLogin()}>Sign In/Sign up</Button>
          :
         <Image src={user?.picture} alt={user.name} width={37} height={38} className='rounded-full'/>
      }
      </div>
    </div>
  )
}

export default Header