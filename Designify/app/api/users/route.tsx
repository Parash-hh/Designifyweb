import { axiosClient } from "@/lib/axiosClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, email, picture } = await req.json();

    try {
        const existing = await axiosClient.get(`/user-lists?filters[email][$eq]=${email}`);
        if (existing?.data?.data?.length > 0) {
            return NextResponse.json(existing.data.data[0]); // return existing user
        }

        const data = {
            data: {
                fullName: name,
                email: email,
                picture: picture
            }
        }
        const result = await axiosClient.post('/user-lists', data);
        return NextResponse.json(result.data);
    } catch (e: any) {
        return NextResponse.json(e?.response?.data, { status: e?.response?.status })
    }
}