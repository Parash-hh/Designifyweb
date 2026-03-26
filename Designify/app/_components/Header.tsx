"use client"
import { Button } from '@/components/ui/Button'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { ShoppingCart, Search, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"

import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Product } from './PopularProducts'

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

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searching, setSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

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
  const handleClickOutside = (e: MouseEvent) => {
    setOpenProfile(false)
    // Close search dropdown when clicking outside
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShowResults(false)
    }
  }

  window.addEventListener("click", handleClickOutside)

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

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!value.trim()) {
      setSearchResults([])
      setShowResults(false)
      setSearching(false)
      return
    }

    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await axios.get(`/api/products?search=${encodeURIComponent(value.trim())}`)
        const data = result.data || []
        setSearchResults(data.slice(0, 5))
        setShowResults(true)
      } catch (e) {
        console.error('Search error:', e)
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowResults(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false)
      setSearchQuery('')
    } else if (e.key === 'Enter') {
      handleSearchSubmit(e)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

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
      <ul className='hidden md:flex gap-5'>
        {menu.map((item) => (
          <li key={item.id}>
            <Link href={item.path} className='cursor-pointer hover:text-primary transition'>
              {item.name}
            </Link>
            </li>
        ))}
      </ul>
      <div className='flex gap-4 items-center'>
        {/* Search Bar */}
        <div ref={searchRef} className='relative' onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSearchSubmit} className='relative'>
            <div className='flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm rounded-full px-4 py-2 border border-transparent focus-within:border-primary/30 focus-within:bg-white/90 focus-within:shadow-lg transition-all duration-300 w-[180px] focus-within:w-[260px]'>
              <Search className='w-4 h-4 text-gray-400 shrink-0' />
              <input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                className='bg-transparent outline-none text-sm w-full placeholder:text-gray-400'
              />
              {searching && (
                <Loader2 className='w-4 h-4 text-gray-400 animate-spin shrink-0' />
              )}
              {searchQuery && !searching && (
                <button type='button' onClick={clearSearch} className='shrink-0 hover:text-primary transition'>
                  <X className='w-4 h-4 text-gray-400 hover:text-gray-600' />
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='absolute top-full mt-2 left-0 right-0 w-[300px] backdrop-blur-2xl bg-white/90 shadow-2xl rounded-2xl border border-white/40 overflow-hidden z-[60]'
              >
                {searchResults.map((product) => (
                  <Link
                    key={product.documentId}
                    href={`/product/${product.documentId}`}
                    onClick={() => {
                      setShowResults(false)
                      setSearchQuery('')
                    }}
                    className='flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-gray-100/50 last:border-b-0'
                  >
                    {product.productImage?.[0]?.url && (
                      <Image
                        src={product.productImage[0].url}
                        alt={product.title}
                        width={40}
                        height={40}
                        className='w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 shrink-0'
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{product.title}</p>
                      {product.pricing && (
                        <p className='text-xs text-muted-foreground'>₹{product.pricing}</p>
                      )}
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    setShowResults(false)
                    setSearchQuery('')
                  }}
                  className='block text-center text-sm text-primary font-medium py-2.5 hover:bg-primary/5 transition-colors border-t border-gray-200/50'
                >
                  View all results →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No results message */}
          <AnimatePresence>
            {showResults && searchQuery && !searching && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='absolute top-full mt-2 left-0 right-0 w-[260px] backdrop-blur-2xl bg-white/90 shadow-2xl rounded-2xl border border-white/40 z-[60] p-4 text-center'
              >
                <p className='text-sm text-muted-foreground'>No products found for &quot;{searchQuery}&quot;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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