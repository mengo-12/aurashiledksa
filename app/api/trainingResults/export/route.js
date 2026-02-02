import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
    try {

        
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "admin") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        
        const results = await prisma.trainingResult.findMany({
            include: { trainee: true },
            orderBy: { createdAt: "desc" }
        });

        console.log("عدد النتائج:", results.length);
        console.log("أول نتيجة لفحص القيم:", results[0]);

        
        const t = {
            safe: "آمن",
            caution: "حذر",
            unsafe: "غير آمن",
            allowed: "مسموح",
            sleepAdviceLow: "- تقليل شدة التمرين.",
            sleepAdviceMed: "- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.",
            sleepAdviceHigh: "- متابعة التدريب المعتاد.",
            readinessYesAdvice: "- متابعة التدريب المعتاد.",
            readinessSomewhatAdvice: "- تدريب معتدل، مراقبة التعب.",
            readinessNotSureAdvice: "- تدريب خفيف، زيادة فترات الراحة عند الحاجة.",
            readinessNoAdvice: "- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.",
            fieldOtherAdvice: "- اختيار الحذاء والتجهيزات الواقية، زيادة الانتباه للحركة على الأرضية.",
            fieldNormalAdvice: "- استخدام الحذاء المناسب لتقليل خطر الإصابات.",
            effortLowAdvice: "- متابعة التدريب المعتاد.",
            effortMedAdvice: "- تقليل شدة التدريب عند الحاجة والالتزام بالتعليمات الأساسية.\n- مراقبة التعب والإرهاق.",
            effortHighAdvice: "- تقليل شدة التدريب والالتزام بالتعليمات الأساسية مع مراقبة التعب والارهاق.",
            effortMaxAdvice: "- الراحة وإيقاف التدريب وعمل الاستشفاء.",
            bodyHealthyAdvice: "- متابعة التدريب المعتاد وفق الخطة.",
            bodyMildTiredAdvice: "- متابعة التدريب مع تقليل شدة بعض التمارين ومراقبة التعب.",
            bodySomePainAdvice: "- تقليل شدة التدريب، تجنب الحركات الشديدة، زيادة فترات الراحة، ومراقبة أي علامات إصابة.",
            bodyExhaustedAdvice: "- تأجيل التدريب أو استبداله بتمارين استشفاء خفيفة.",
            tempSafeAdvice: "- متابعة التدريب المعتاد.",
            tempMedAdvice: "- تقليل شدة التدريب تدريجيًا والالتزام بالتعليمات الأساسية.",
            tempUnsafeAdvice: "- تغيير وقت التمرين، تقليل شدة التدريب، مراقبة علامات التعب باستمرار.",
            humiditySafeAdvice: "- استمر في التدريب حسب الخطة المعتادة.",
            humidityMedAdvice: "- شرب السوائل كل 20 دقيقة، أخذ فترات استراحة قصيرة، تقليل شدة التمرين عند الإرهاق.",
            humidityUnsafeAdvice: "- تقليل شدة التدريب أو تأجيله، شرب السوائل، والانتباه للإرهاق."
        };

       
        const assessTemperature = (val) => {
            if (val == null) return { rating: "-", advice: "-" };
            if (val <= 30) return { rating: t.safe, advice: t.tempSafeAdvice };
            if (val <= 34) return { rating: t.caution, advice: t.tempMedAdvice };
            return { rating: t.unsafe, advice: t.tempUnsafeAdvice };
        };
        const assessHumidity = (val) => {
            if (val == null) return { rating: "-", advice: "-" };
            if (val <= 60) return { rating: t.safe, advice: t.humiditySafeAdvice };
            if (val <= 70) return { rating: t.caution, advice: t.humidityMedAdvice };
            return { rating: t.unsafe, advice: t.humidityUnsafeAdvice };
        };

        
        const sheetData = [[
            "اسم المتدرب", "الهاتف", "العمر", "المدينة", "وقت التدريب",
            "النوم", "الجاهزية", "نوع الأرضية", "مستوى الجهد", "الحالة الجسدية",
            "درجة الحرارة", "تقييم الحرارة", "تعليمات الحرارة",
            "الرطوبة", "تقييم الرطوبة", "تعليمات الرطوبة",
            "تاريخ التقييم"
        ]];

       
        for (const r of results) {
            const tempEval = assessTemperature(r.temperature);
            const humEval = assessHumidity(r.humidity);

            sheetData.push([
                r.trainee?.name || "",
                r.trainee?.phone || "",
                r.trainee?.age || "",
                r.city || "",
                r.trainingTime || "",
                r.sleepHours || "",
                r.readiness || "",
                r.fieldType || "",
                r.effortLevel || "",
                r.bodyFeeling || "",
                r.temperature !== null && r.temperature !== undefined ? `${r.temperature}` : "غير محدد",
                tempEval.rating,
                tempEval.advice,
                r.humidity !== null && r.humidity !== undefined ? `${r.humidity}` : "غير محدد",
                humEval.rating,
                humEval.advice,
                new Date(r.createdAt).toLocaleString("ar-SA")
            ]);
        }

       
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير التدريب اليومي");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        return new Response(excelBuffer, {
            status: 200,
            headers: {
                "Content-Disposition": 'attachment; filename="TrainingResults.xlsx"',
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });

    } catch (err) {
        console.error("❌ Export error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
