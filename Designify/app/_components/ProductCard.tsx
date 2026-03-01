import React from 'react'
import { Product } from './PopularProducts'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Palette } from 'lucide-react'
import Link from 'next/link'

type Props = {
    product: Product
}

function ProductCard({product}: Props) {
  return (
    <div className='p-5 border rounded-xl flex flex-col items-center hover:border-primary cursor-pointer'>
      <Image src={product.productImage[0]?.url} alt={product.title} 
      width={150} 
      height={150}
      className='h-[150px] w-full aspect-square object-contain'
      />
      <h2 className='font-medium text-lg'>{product.title}</h2>
      <Link href={'/product/' + product?.documentId} className='w-full'>
          <Button className='w-full mt-2'> <Palette /> Customize</Button>
      </Link>
    </div>
  )
}

export default ProductCard
