import { axiosClient } from "@/lib/axiosClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const {searchParams} = new URL(req.url);
    const isPopular = searchParams.get('isPopular');

    if(isPopular == '1'){
        const result = await axiosClient.get('/products?populate=*');
        return NextResponse.json(result?.data?.data);
    }
    else{
        return NextResponse.json({});
    }
}