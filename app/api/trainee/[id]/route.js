import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const trainee = await prisma.trainee.findUnique({
            where: { id: params.id },
            select: { id: true, hasSeenInstructions: true },
        });

        if (!trainee) {
            return new Response(JSON.stringify({ error: "Trainee not found" }), { status: 404 });
        }

        return Response.json(trainee);
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { hasSeenInstructions } = await req.json();

        const updated = await prisma.trainee.update({
            where: { id: params.id },
            data: { hasSeenInstructions },
        });

        return Response.json(updated);
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
