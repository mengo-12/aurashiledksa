import prisma from "@/lib/prisma";
import { json2xls } from "json2xls";

export async function GET(req) {

    const session = await getSessionFromRequest(req); 
    if (!session?.user?.isAdmin) {
        return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 403 });
    }

    const results = await prisma.traineeResult.findMany({
        include: { trainee: true }
    });


    const data = results.map(r => ({
        Name: r.trainee.name,
        Phone: r.trainee.phone,
        Age: r.trainee.age,
        Answers: JSON.stringify(r.answers),
        Temperature: r.temperature,
        Humidity: r.humidity,
        City: r.city,
        Condition: r.condition,
        UpdatedAt: r.updatedAt
    }));

    const xls = json2xls(data);
    return new Response(xls, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=results.xlsx"
        }
    });
}
