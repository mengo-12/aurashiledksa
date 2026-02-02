'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dumbbell, ShieldCheck, Phone, AlertCircle, Calendar, Info } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../app/components/LanguageSwitcher";
import ThemeSwitcher from "../app/components/ThemeSwitcher";
import { signOut } from "next-auth/react";
import { signIn, useSession } from "next-auth/react";

export default function AuthPage() {
    const router = useRouter();
    const { t, i18n } = useTranslation("common");

    const [form, setForm] = useState({
        name: "",
        phone: "",
        age: "",
        agreed: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false); 

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = t("validation_name_required");
        else if (form.name.length < 3) newErrors.name = t("validation_name_short");

        if (!form.age) newErrors.age = t("validation_age_required");
        else if (isNaN(form.age)) newErrors.age = t("validation_age_number");
        else if (Number(form.age) < 18) newErrors.age = t("validation_age_min");

        if (!form.phone) newErrors.phone = t("validation_phone_required");
        else if (!/^05\d{8}$/.test(form.phone)) newErrors.phone = t("validation_phone_invalid");

        if (!form.agreed) newErrors.agreed = t("validation_agreement_required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
        setErrors({ ...errors, [name]: "" });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (Number(form.age) < 18) {
            alert(t("validation_age_min"));
            return;
        }

        setLoading(true);

        try {
            
            const res = await signIn("credentials", {
                redirect: false,
                name: form.name,
                phone: form.phone,
                age: Number(form.age),
            });

            if (res?.error) {
                alert(res.error);
            } else {
                
                const sessionRes = await fetch("/api/auth/session");
                const session = await sessionRes.json();



                const resTrainee = await fetch(`/api/trainee/${session.user.id}`);
                const traineeData = await resTrainee.json();

                if (!traineeData.hasSeenInstructions) {
                    router.push("/instructions?traineeId=" + session.user.id);
                } else {
                    router.push("/questions");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(t("error_occurred"));
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
                    {/* <Dumbbell className="w-16 h-16 text-emerald-500 dark:text-emerald-400 mb-3 animate-pulse" /> */}
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
                        {t("register_title")}
                    </h1>
                    {/* <p className="text-gray-500 dark:text-gray-300 text-sm mt-2 text-center">
                        {t("register_description")}
                    </p> */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                   
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">{t("full_name")}</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t("placeholder_name")}
                            className={`w-full bg-gray-50 dark:bg-slate-700 text-black dark:text-white border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none 
                                ${errors.name ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.name}
                        </p>}
                    </div>

                    
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">{t("age")}</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                placeholder={t("placeholder_age")}
                                className={`w-full bg-gray-50 dark:bg-slate-700 text-black dark:text-white border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-emerald-400 outline-none 
                                    ${errors.age ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}
                            />
                            <Calendar className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 dark:text-gray-300" />
                        </div>
                        {errors.age && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.age}
                        </p>}
                    </div>

                    
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">{t("phone")}</label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder={t("placeholder_phone")}
                                className={`w-full bg-gray-50 dark:bg-slate-700 text-black dark:text-white border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-emerald-400 outline-none 
                                    ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}
                            />
                            <Phone className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 dark:text-gray-300" />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.phone}
                        </p>}
                    </div>

                    
                    <div className={`relative flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-xl px-3 py-2 border 
                        ${errors.agreed ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}>
                        <input
                            type="checkbox"
                            id="agree"
                            name="agreed"
                            checked={form.agreed}
                            onChange={handleChange}
                            className="w-5 h-5 accent-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="agree" className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2 cursor-pointer">
                            <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                            {t("terms_agreement")}
                        </label>

                     
                        <div
                            className="relative ml-2"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Info className="w-5 h-5 text-gray-400 hover:text-emerald-500 cursor-pointer" />
                            {showTooltip && (
                                <div className="absolute z-20 bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 w-72 -top-2 right-7 rtl:right-auto rtl:left-7">
                                    <p className="leading-relaxed">
                                        {t("tooltip_irb")}
                                    </p>

                                </div>
                            )}
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: form.agreed ? 1.02 : 1 }}
                        className={`w-full py-3 rounded-xl text-lg font-semibold transition-all shadow-md 
                            ${form.agreed
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                            }`}
                        type="submit"
                        disabled={!form.agreed || loading}
                    >
                        {loading ? t("loading") : t("btn_login")}
                    </motion.button>
                
                    <div className="mt-4 text-center">


                        <button
                            type="button"
                            onClick={async () => {
                                
                                await signOut({ redirect: false });
                                router.push("/admin/login");
                            }}
                            className="text-sm text-emerald-500 hover:underline"
                        >
                    تسجيل دخول الأدمن
                        </button>
                    </div>
                </form>
            </motion.div>

        </div>
    );
}

