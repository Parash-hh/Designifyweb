'use client'
import { Product } from '@/app/_components/PopularProducts'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Crop, GalleryVerticalEnd, ImageOff, ImageUpscale, Upload } from 'lucide-react'
import { Canvas, FabricImage } from 'fabric'
import { imagekit } from '@/lib/ImageKitInstance'

type Props = {
    product: Product
}

const DEFULT_IMAGE='https://ik.imagekit.io/designify911/WhatsApp_Image_2025-09-26_at_19.13.53_d9747ef4.jpg?updatedAt=1772566924696'
const AITransformOptions = [
    {
        name:'BG Remove',
        icon:ImageOff,
        imageKitTr:'e-bgremove'
    },
    {
        name:'Upscale',
        icon:ImageUpscale,
        imageKitTr:'e-upscale'
    },
     {
        name:'Smart Crop',
        icon:Crop,
        imageKitTr:'fo-auto'
    },
     {
        name:'Shadow',
        icon:GalleryVerticalEnd,
        imageKitTr:'e-shadow'
    }
]
function ProductCustomizeStudio({product}: Props) {

    const canvasRef = useRef<any>(null);
    const [canvasInstance, setCanvasInstance] =useState<any>(null);
    const [uploadedImage,setUploadedImage]=useState<string>(DEFULT_IMAGE)

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
    }, [canvasInstance,uploadedImage])
    const AddDefaultImageCanvas=async ()=>{
        canvasInstance.renderAll();
        canvasInstance.clear();
        const canvasImageRef=await FabricImage.fromURL(uploadedImage);
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
                setUploadedImage(uploadedImageUrl);
                const canvasImageRef=await FabricImage.fromURL(uploadedImageUrl);
                canvasImageRef.scaleX=0.1;
                canvasImageRef.scaleY=0.1;
                canvasInstance.add(canvasImageRef);
                
            }
        }
    }

const OnApplyAITransformation=(transformation:any,add:boolean)=>{

     if(add) {
    if(uploadedImage?.includes('&tr=')) {
        const newUrl=uploadedImage+transformation+','
        setUploadedImage(newUrl ) ;
    } else{
        const newUrl = uploadedImage+'&tr='+transformation+','
        setUploadedImage(newUrl);
    }

}

    else{
        const newUrl = uploadedImage.replace(transformation,'');
        setUploadedImage(newUrl ) ;
    }

    const isTransformationApplied=(transformation:string)=>{
        return uploadedImage?.includes(transformation)??false
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
       
       {AITransformOptions.map((item,index)=>( 
        <div key = {index} className = {`'flex flex-col p-5 items-center border rounded-lg hover:border-primary cursor-pointer hover:bg-fuchsia-300'
             ${uploadedImage.includes(item.imageKitTr)?'border-primary':null}
            `}

        onClick={()=>OnApplyAITransformation(item?.imageKitTr,isTransformationApplied(item.imageKitTr))}
         >
            <item.icon/> 
             <h2 className = 'text-center'>{item.name}</h2>   
            </div>
       ))}
       
    
      </div>
    </div>
  )
}
export default ProductCustomizeStudio
