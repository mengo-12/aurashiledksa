'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import LanguageSwitcher from "../../app/components/LanguageSwitcher";
import ThemeSwitcher from "../../app/components/ThemeSwitcher";

export default function InstructionsClient({ traineeId: propTraineeId, onNext }) {
    const { t, i18n } = useTranslation("common");
    const router = useRouter();
    const searchParams = useSearchParams();

    const [traineeId, setTraineeId] = useState(propTraineeId || null);
    const [agreed, setAgreed] = useState(false);

    
    useEffect(() => {
        const idFromUrl = searchParams.get("traineeId");
        if (idFromUrl) setTraineeId(idFromUrl);
    }, [searchParams]);

    
    useEffect(() => {
        const fetchTrainee = async () => {
            if (!traineeId) return;

            const res = await fetch(`/api/trainee/${traineeId}`);
            const data = await res.json();

            if (!res.ok || !data) {
                router.push("/"); 
            }
        };
        fetchTrainee();
    }, [traineeId, router]);

    
    const handleNext = async () => {
        if (onNext) onNext();
        else router.push("/questions"); 
    };

    return (
        <div
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl p-8 sm:p-10 w-full max-w-lg"
            >
                <div className="flex justify-between items-center mb-6">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
                    {t("title")}
                </h1>

                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>{t("item1")}</li>
                        <li>{t("item2")}</li>
                        <li>{t("item3")}</li>
                        <li>{t("item4")}</li>
                        <li>{t("item5")}</li>
                    </ul>
                    <p className="mt-4 font-semibold">{t("note")}</p>
                </div>

                <div className="flex items-center mt-6">
                    <input
                        id="agree"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-5 h-5 accent-emerald-500 cursor-pointer"
                    />
                    <label
                        htmlFor="agree"
                        className="ml-2 text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2 cursor-pointer"
                    >
                        {t("agree")}
                    </label>
                </div>

                <motion.button
                    onClick={handleNext}
                    disabled={!agreed}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: agreed ? 1.02 : 1 }}
                    className={`w-full mt-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md 
                        ${agreed
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {t("next")}
                </motion.button>
            </motion.div>
        </div>
    );
}
