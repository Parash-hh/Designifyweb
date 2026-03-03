'use client'
import { Product } from '@/app/_components/PopularProducts'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Crop, ImageOff, ImageUpscale, Upload } from 'lucide-react'
import { Canvas, FabricImage } from 'fabric'
import { imagekit } from '@/lib/ImageKitInstance'

type Props = {
    product: Product
}

function ProductCustomizeStudio({product}: Props) {

    const canvasRef= useRef<any>(null);
    const [canvasInstance, setCanvasInstance] =useState<any>(null);

    useEffect(() => {
        if(canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width:170,
                height:170,
                backgroundColor:'transparent',
            });
            initCanvas.renderAll();
            setCanvasInstance(initCanvas);

            return () => {
                initCanvas.dispose();
            }
        }
    }, [])

    useEffect(() => {
        if(canvasInstance) {
        AddDefaultImageCanvas();
        }
    }, [canvasInstance])
    const AddDefaultImageCanvas=async ()=>{
        const canvasImageRef=await FabricImage.fromURL(' ');
        canvasImageRef.scaleX=0.1;
        canvasImageRef.scaleY=0.1;
        canvasInstance.add(canvasImageRef);
        canvasInstance.renderAll();
    }

    const onHandleImageUpload=async(event: React.ChangeEvent<HTMLInputElement>)=>{
        //Get file
        const file=event.target.files?.[0];
        //Upload to imagekit
        if(file){
            const uploadImageRef=await imagekit.upload({
                //@ts-ignore
                file:file,
                fileName:file?.name,
                isPublished:true,
                useUniqueFileName:false
            });
            //@ts-ignore
            console.log(uploadImageRef.url);
            //show on canvas
            //@ts-ignore 
            const uploadedImageUrl=uploadImageRef.url;
            if(uploadedImageUrl){
                const canvasImageRef=await FabricImage.fromURL(uploadedImageUrl);
                canvasImageRef.scaleX=0.1;
                canvasImageRef.scaleY=0.1;
                canvasInstance.add(canvasImageRef);
                canvasInstance.renderAll();
            }
        }
    }

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center h-[400px] w-[400px]'>
        <canvas
        id='canvas'
        ref={canvasRef}
        className='absolute top-25 left-0.5 z-10'/>
      <Image src={product?.productImage[0]?.url} alt={product?.title} width={400} height={400}/>
      </div>
      <div className='flex gap-5 my-5'>
        <label htmlFor='uploadImage'>
        <div className='flex flex-col p-5 items-center border rounded-lg hover:border-primary cursor-pointer hover:bg-fuchsia-300'>
            <Upload/>
            <h2>Upload Image</h2>
        </div>
        </label>
        <input type='file' id='uploadImage' className='hidden'onChange={onHandleImageUpload}/>
        <div className='flex flex-col p-5 items-center border rounded-lg hover:border-primary cursor-pointer hover:bg-fuchsia-300'>
            <ImageOff/>
            <h2>BG Remove</h2>
        </div>
        <div className='flex flex-col p-5 items-center border rounded-lg hover:border-primary cursor-pointer hover:bg-fuchsia-300'>
            <ImageUpscale/>
            <h2>Upscale</h2>
        </div>
        <div className='flex flex-col p-5 items-center border rounded-lg hover:border-primary cursor-pointer hover:bg-fuchsia-300'>
            <Crop/>
            <h2>Smart Crop</h2>
        </div>
      </div>
    </div>
  )
}

export default ProductCustomizeStudio
