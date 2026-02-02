// /app/api/trainee/instructions/route.js
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { traineeId } = await req.json();

        if (!traineeId) {
            return new Response(
                JSON.stringify({ error: "رقم المتدرب مطلوب" }),
                { status: 400 }
            );
        }

        
        const updatedTrainee = await prisma.trainee.update({
            where: { id: traineeId },
            data: { hasSeenInstructions: true },
        });

        return new Response(
            JSON.stringify({
                message: "تم تحديث حالة التعليمات بنجاح",
                trainee: updatedTrainee,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("❌ خطأ في API:", error);
        return new Response(
            JSON.stringify({ error: "حدث خطأ داخلي في الخادم" }),
            { status: 500 }
        );
    }
}
