import { axiosClient } from "@/lib/axiosClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const isPopular = searchParams.get('isPopular');
    const category = searchParams.get('category');
    const productId = searchParams.get('productId');
    const search = searchParams.get('search');

    try {
        if(isPopular == '1'){
            const result = await axiosClient.get('/products?populate=*');
            return NextResponse.json(result?.data?.data);
        }
        else if(category){
            const result = await axiosClient.get('/products?populate=*&filters[category][slug][$eq]='+category);
            return NextResponse.json(result?.data?.data);
        }
        else if(productId) {
            const result = await axiosClient.get('/products/' + productId + "?populate=*");
            return NextResponse.json(result?.data?.data);
        }
        else if(search) {
            const result = await axiosClient.get(`/products?populate=*&filters[title][$containsi]=${encodeURIComponent(search)}`);
            return NextResponse.json(result?.data?.data);
        }
        else{
            const result = await axiosClient.get('/products?populate=*');
            return NextResponse.json(result?.data?.data);
        }
    } catch(e: any) {
        return NextResponse.json(e?.response?.data, { status: e?.response?.status })
    }
}