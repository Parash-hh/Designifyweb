"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';

export type Product = {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    pricing: number;
    isFeatured: boolean;
    size: any;
    productImage: Array<{
        url: string;
    }>;
    documentId: string;
}

function PopularProducts() {

  const [productList, setProductList] = useState<Product[]>()

  useEffect(() => {
    GetPopularProducts();
  }, [])

  const GetPopularProducts = async () => {
    const result = await axios.get('/api/products?isPopular=1');
    console.log(result.data);
    setProductList(result.data);
  }

  return (
    <div className='mt-10'>
       <h2 className='font-bold text-3xl'>Popular Products</h2>
       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
        {productList?.map((product: Product, index: number)=>(
            <ProductCard product={product} key={index}/>
        ))}
       </div>
    </div>
  )
}

export default PopularProducts
