import { axiosClient } from "@/lib/axiosClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const { name, email, picture } = await req.json();

    try {
        const data = {
            data: {
                fullName: name,
                email: email,
                picture: picture
            }
        }
        const result = await axiosClient.post('/user-lists', data);
        console.log(result);
        return NextResponse.json(result.data);
    } catch (e) {
        return NextResponse.json(e)
    }
}