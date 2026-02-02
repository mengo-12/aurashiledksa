import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return new Response(
            JSON.stringify({ success: false, error: "Unauthorized" }),
            { status: 403 }
        );
    }

    try {
        const results = await prisma.trainingResult.findMany({
            include: { trainee: true },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ success: true, results }),
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error fetching all results:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500 }
        );
    }
}
