import { axiosClient } from "@/lib/axiosClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const result = await axiosClient.get(
            `/orders?filters[userEmail][$eq]=${email}&sort=createdAt:desc&pagination[pageSize]=50`
        );
        return NextResponse.json(result.data.data);
    } catch (e: any) {
        console.error('Fetch orders error:', e?.response?.data);
        return NextResponse.json(e?.response?.data ?? e, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { userEmail, name, phone, zip, address, totalAmount, paymentId, paymentMethod } = await req.json();

    const data = {
        data: {
            userEmail,
            name,
            phone,
            zip,
            address,
            totalAmount: parseInt(totalAmount),
            paymentId,
            paymentMethod
        }
    }

    try {
        const result = await axiosClient.post('/orders', data);
        return NextResponse.json(result.data);
    } catch(e: any) {
        console.error('Order error:', e?.response?.data)
        return NextResponse.json(e?.response?.data ?? e);
    }
}