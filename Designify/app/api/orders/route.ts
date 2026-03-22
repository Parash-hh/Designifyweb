import { axiosClient } from "@/lib/axiosClient";
import { NextRequest, NextResponse } from "next/server";

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