 "se Client"
 
 import React from 'react'
 import { useToast } from '@/hooks/use-toast'
import {  CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { getImageSize } from 'next/dist/server/image-optimizer';

type MediaUploaderProps={
    onValueChange:(Value:string)=>void;
    setImage:React.Dispatch<any>;
    publicId:String;
    image:any;
    type:string;
}

 const MediaUploader = ({
    onValueChange,
    setImage,
    image,
    publicId,
    type
 }:MediaUploaderProps) => {
    const {toast}=useToast();

const onUploadSuccessHandler=(result:any)=>{
setImage((prevState:any)=>({
    ...prevState,
    publicId:result?.info?.public_id,
    width:result?.info?.width,
    height:result?.info?.height,
    secureUrl:result?.info?.secure_url
}))

onValueChange(result?.info?.public_id)

  toast({
    title:'Image uploaded successfully',
    description:'1 credit was deducted from your account ',
    duration:5000,
    className:'error-toast'
  })
}
const onUploadErrorHandler=(result:any)=>{
    toast({
        title:'Something went wrong while uploading',
        description:'Please try again ',
        duration:5000,
        className:'error-toast'
      })
}
   return (
   <CldUploadWidget
   uploadPreset="jsm_imaginify"
   options={{
    multiple:false,
    resourceType:"image",

   }}
   onSuccess={onUploadSuccessHandler}
   onError={onUploadErrorHandler}
   >
{({open})=>(
<div className="flex flex-col gap-4">
<h3 className="h3-bold text-dark-600">
Original
</h3>
{publicId ?(
    <>
<div className='cursor-pointer overflow-hidden  rounded-[10px]'>
<CldImage
width={getImageSize(type,image,"width")}
height={getImageSize(type,image,"height")}
src={publicId}
alt="image"
sizes={()}
/>

</div>
    </>
):(
    <div className="media-uploader_cta" onClick={()=>open() }>


<div className="media-uploader_cta-image">
    <Image
    src="/assets/icons/add.svg"
    alt="Add Image"
    width={24}
    height={24}
    />
    
</div>
<p className='p-14-medium '>Click here to upload Image </p>
    </div>

)}
    </div>
)}
   </CldUploadWidget>
   )
 }
 
 export default MediaUploader