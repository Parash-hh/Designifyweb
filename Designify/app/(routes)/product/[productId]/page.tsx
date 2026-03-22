"use client"
import PopularProducts, { Product } from '@/app/_components/PopularProducts';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ProductCustomizeStudio from '../_components/ProductCustomizeStudio';
import { CartContext } from '@/context/CartContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { toast } from 'react-toastify';

function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState(false);
    const [enableCustomizeStudio, setEnableCustomizeStudio] = useState(false);
    const { cart, setCart } = useContext(CartContext);
    const { userDetail } = useContext(UserDetailContext)
    const [designUrl, setDesignUrl] = useState<string>();
    const router = useRouter()

    useEffect(() => {
        productId && GetProductById();
    }, [productId])

    const GetProductById = async () => {
        setLoading(true);
        const result = await axios.get('/api/products?productId=' + productId);
        console.log(result.data);
        setProduct(result.data);
        setLoading(false);
    }

    const AddToCart = async () => {
        if (!userDetail?.email) {
            toast.error('Please Sign In to add to cart')
            return
        }

        setCart((prev: any) => [
            ...(Array.isArray(prev) ? prev : []),
            {
                design: designUrl,
                products: [product],
                userEmail: userDetail?.email
            }
        ])

        const result = await axios.post('/api/cart', {
            product: product,
            designUrl: designUrl,
            userEmail: userDetail?.email
        })
        console.log(result.data);

        // ✅ Add to cart notification
        toast.success('Added to cart! 🛒', {
            position: 'top-right',
            autoClose: 2000,
        })
    }

    // ✅ Buy Now - add to cart then redirect to checkout
    const BuyNow = async () => {
        if (!userDetail?.email) {
            toast.error('Please Sign In to continue')
            return
        }
        await AddToCart()
        router.push('/checkout')
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 my-20'>
                <div className='flex items-center justify-center border rounded-2xl'>
                    {product ?
                        !enableCustomizeStudio ?
                            <Image src={product?.productImage[0]?.url}
                                alt={product?.title} width={400} height={400} /> :
                            <ProductCustomizeStudio product={product}
                                setDesignUrl={(url: string) => setDesignUrl(url)} />
                        : <Skeleton className='w-full h-[300px]' />
                    }
                </div>

                <div>
                    {product ? <div className='flex flex-col gap-3'>
                        <h2 className='font-bold text-3xl'>{product?.title}</h2>
                        <h2 className='font-bold text-3xl'>₹{product?.pricing}</h2>
                        <p className='text-gray-500'>{product?.description}</p>
                        <div>
                            <h2 className='text-lg'>Size</h2>
                            <div className='flex gap-3'>
                                <Button variant={'outline'}>S</Button>
                                <Button variant={'outline'}>M</Button>
                                <Button variant={'outline'}>L</Button>
                                <Button variant={'outline'}>XL</Button>
                            </div>
                        </div>
                        {!enableCustomizeStudio &&
                            <Button size={'lg'} onClick={() => setEnableCustomizeStudio(true)}>
                                Customize
                            </Button>
                        }
                        {/* ✅ Buy Now button */}
                        <Button size={'lg'} onClick={BuyNow}>
                            Buy Now
                        </Button>
                        <Button size={'lg'} onClick={() => AddToCart()}
                            variant={!enableCustomizeStudio ? 'outline' : 'default'}>
                            Add To Cart
                        </Button>
                    </div>
                        : <div className='space-y-3'>
                            <Skeleton className='w-full h-[20px]' />
                            <Skeleton className='w-full h-[30px]' />
                            <Skeleton className='w-full h-[50px]' />
                            <Skeleton className='w-full h-[50px]' />
                        </div>}
                </div>
            </div>

            <div className='mt-10'>
                <h2 className='font-bold text-lg'>Product Description</h2>
                <p className='text-gray-500'>{product?.description}</p>
            </div>

            <PopularProducts />
        </div>
    )
}

export default ProductDetail