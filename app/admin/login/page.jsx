'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Mail, Lock, AlertCircle, ShieldCheck, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

export default function AdminLoginPage() {
    const router = useRouter();
    const { t, i18n } = useTranslation("admin");
    const { data: session } = useSession();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);


    useEffect(() => {
        if (session?.user && session.user.role !== "admin") {
            
            signOut({ redirect: false }).then(() => router.push("/admin/login"));
        } else if (session?.user?.role === "admin") {
            router.push("/admin/dashboard");
        }
    }, [session, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError(t("error_required"));
            return;
        }

        setLoading(true);

        try {
            const res = await signIn("admin", {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (res?.error) {
                setError(t("error_invalid"));
            } else {
                const sessionRes = await fetch("/api/auth/session");
                const sessionData = await sessionRes.json();

                if (sessionData?.user?.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    setError(t("error_unauthorized"));
                }
            }
        } catch (err) {
            console.error(err);
            setError(t("error_general"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors duration-500"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-3xl p-6 sm:p-10 w-full max-w-md"
            >

                <div className="flex justify-between items-center mb-6">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>


                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
                        {t("title_admin")}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-2 text-center">
                        {t("subtitle")}
                    </p>
                </div>


                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">{t("email")}</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={t("placeholder_email")}
                                className={`w-full bg-gray-50 dark:bg-slate-700 border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-emerald-400 outline-none 
                                    ${error ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}
                            />
                            <Mail className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 dark:text-gray-300" />
                        </div>
                    </div>


                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">{t("password")}</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder={t("placeholder_password")}
                                className={`w-full bg-gray-50 dark:bg-slate-700 border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-emerald-400 outline-none 
                                    ${error ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}
                            />
                            <Lock className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 dark:text-gray-300" />
                        </div>
                    </div>


                    {error && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </p>
                    )}


                    <div
                        className="flex items-center gap-2 mt-2 cursor-pointer relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t("note_admin")}</span>
                        {showTooltip && (
                            <div className="absolute bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 w-64 -top-16 right-10">
                                <p>{t("tooltip")}</p>
                            </div>
                        )}
                    </div>

                    
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.02 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-lg font-semibold transition-all shadow-md 
                            ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-600 text-white"
                            }`}
                    >
                        {loading ? t("loading_admin") : t("btn_login_admin")}
                    </motion.button>

                    
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="text-sm text-emerald-500 hover:underline"
                        >
                            {t("back_home")}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
