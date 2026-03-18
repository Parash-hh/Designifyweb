"use client"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowBigRight, ArrowRight } from 'lucide-react'
import React from 'react'

function Checkout() {

  return (
    <div className=''>
      <h2 className='p-3 bg-primary text-lg md:text-xl font-bold text-center text-white'>Checkout</h2>
       <div className='p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 w-full'>
          <h2 className='font-bold text-2xl md:text-3xl mb-4'>Billing Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <Input placeholder='Name' />
                <Input placeholder='Email' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <Input placeholder='Phone' />
                <Input placeholder='Zip' />
            </div>
            <div className='mt-4'>
                <Input placeholder='Address' />
            </div>
        </div>
        <div className='w-full border rounded-lg shadow-sm'>
          <h2 className='p-3 bg-gray-200 font-bold text-center'>Total Cart (03)</h2>
            <div className='p-4 flex flex-col gap-4'>
                <h2 className='font-bold flex justify-between'>Subtotal : <span>$250:00</span></h2>
                <hr></hr>
                <h2 className='flex justify-between'>Delivery : <span>$15.00</span></h2>
                <h2 className='flex justify-between'>Tax (9%) : <span>$250.00</span></h2>
                <hr></hr>
                <h2 className='font-bold flex justify-between text-lg'>Total : <span>$350.00</span></h2>
                <Button className='w-full flex items-center justify-center gap-2'>
                  Payment <ArrowRight size={18}/>
                </Button>
            </div>
        </div>
       </div>
    </div>
  )
}

export default Checkout
