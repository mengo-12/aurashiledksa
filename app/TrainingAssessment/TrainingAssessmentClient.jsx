'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRegCircle, FaFileExport } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useSession } from "next-auth/react";
import ThemeSwitcher from '../components/ThemeSwitcher';
import * as XLSX from "xlsx";

export default function TrainingReport() {
    const { t, i18n } = useTranslation('common');
    const searchParams = useSearchParams();
    const router = useRouter();

    const [reportData, setReportData] = useState(null);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const { data: session } = useSession();
    const isAdmin = session?.user?.id === "1"; 

    
    // useEffect(() => {
    //     const fetchWeatherForecast = async (lat, lon, trainingHour) => {
    //         try {
    //             const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    //             // const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&lang=${i18n.language}&hours=24`;
    //             const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&lang=${i18n.language}&hours=24`;

    //             const res = await fetch(url);
    //             const data = await res.json();

    //             if (!data?.forecast?.forecastday?.[0]?.hour) {
    //                 setError(t('loadingWeather'));
    //                 return;
    //             }

    //             
    //             const forecastHour = data.forecast.forecastday[0].hour.find(
    //                 h => new Date(h.time).getHours() === parseInt(trainingHour)
    //             );

    //             const selectedHour = forecastHour ?? data.current; // fallback إذا لم توجد بيانات التوقع
    //             const weatherObj = {
    //                 temp: selectedHour.temp_c,
    //                 humidity: selectedHour.humidity ?? 0,
    //                 city: data.location.name,
    //                 desc: selectedHour.condition.text,
    //                 wind: selectedHour.wind_kph
    //             };
    //             setWeather(weatherObj);

    //             
    //             localStorage.setItem(
    //                 `weather_${lat}_${lon}`,
    //                 JSON.stringify({ timestamp: Date.now(), weather: weatherObj })
    //             );
    //         } catch (err) {
    //             console.error('⚠️ خطأ في جلب بيانات الطقس:', err);
    //             setError(t('loadingWeather'));
    //         }
    //     };

    //     const getLocationAndFetch = async () => {
    //         try {
    //             const answers = searchParams.get('answers');
    //             if (!answers) return;

    //             const parsed = JSON.parse(answers);
    //             const trainingTime = parsed.trainingTime || "12:00"; // افتراضيًا منتصف اليوم
    //             const trainingHour = trainingTime.split(':')[0]; // فقط الساعة (مثلاً 20 من "20:00")

    //             if (navigator.geolocation) {
    //                 navigator.geolocation.getCurrentPosition(
    //                     pos => {
    //                         fetchWeatherForecast(pos.coords.latitude, pos.coords.longitude, trainingHour);
    //                     },
    //                     () => {
    //                         // في حالة الرفض، استخدم موقع افتراضي (الرياض)
    //                         fetchWeatherForecast(24.7136, 46.6753, trainingHour);
    //                         setError(t('locationError'));
    //                     },
    //                     { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    //                 );
    //             } else {
    //                 setError(t('locationNotSupported'));
    //                 fetchWeatherForecast(24.7136, 46.6753, trainingHour);
    //             }
    //         } catch (err) {
    //             console.error(err);
    //             setError(t('loadingWeather'));
    //         }
    //     };

    //     getLocationAndFetch();
    // }, [i18n.language, searchParams]);



    
    useEffect(() => {
        const fetchCityName = async (lat, lon) => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                const data = await res.json();
                
                return (
                    data.address?.city ||
                    data.address?.town ||
                    data.address?.village ||
                    data.address?.state ||
                    "غير معروف"
                );
            } catch (e) {
                console.error("خطأ في جلب اسم المدينة:", e);
                return "غير معروف";
            }
        };

        const fetchWeatherForecast = async (lat, lon, trainingHour) => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&lang=${i18n.language}&hours=24`;

                const res = await fetch(url);
                const data = await res.json();

                if (!data?.forecast?.forecastday?.[0]?.hour) {
                    setError(t('loadingWeather'));
                    return;
                }

               
                const forecastHour = data.forecast.forecastday[0].hour.find(
                    h => new Date(h.time).getHours() === parseInt(trainingHour)
                );

                const selectedHour = forecastHour ?? data.current;
                const weatherObj = {
                    temp: selectedHour.temp_c,
                    humidity: selectedHour.humidity ?? 0,
                    desc: selectedHour.condition.text,
                    wind: selectedHour.wind_kph
                };

                
                const realCity = await fetchCityName(lat, lon);
                weatherObj.city = realCity;

                setWeather(weatherObj);

                localStorage.setItem(
                    `weather_${lat}_${lon}`,
                    JSON.stringify({ timestamp: Date.now(), weather: weatherObj })
                );
            } catch (err) {
                console.error('⚠️ خطأ في جلب بيانات الطقس:', err);
                setError(t('loadingWeather'));
            }
        };

        const getLocationAndFetch = async () => {
            try {
                const answers = searchParams.get('answers');
                if (!answers) return;

                const parsed = JSON.parse(answers);
                const trainingTime = parsed.trainingTime || "12:00";
                const trainingHour = trainingTime.split(':')[0];

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        pos => {
                            fetchWeatherForecast(pos.coords.latitude, pos.coords.longitude, trainingHour);
                        },
                        () => {
                           
                            fetchWeatherForecast(24.7136, 46.6753, trainingHour);
                            setError(t('locationError'));
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                } else {
                    setError(t('locationNotSupported'));
                    fetchWeatherForecast(24.7136, 46.6753, trainingHour);
                }
            } catch (err) {
                console.error(err);
                setError(t('loadingWeather'));
            }
        };

        getLocationAndFetch();
    }, [i18n.language, searchParams]);



    
    useEffect(() => {
        const answers = searchParams.get('answers');
        if (!answers) router.push('/');
        else setReportData({ answers: JSON.parse(answers) });
    }, [searchParams, router]);

    
    useEffect(() => {
        const saveResult = async () => {
            if (!reportData || !weather) return;

            try {
                await fetch('/api/trainingResults', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...reportData.answers,
                        temperature: weather.temp ?? null,
                        humidity: weather.humidity ?? null,
                        city: weather.city ?? null,
                        condition: weather.desc ?? null,
                    }),
                });
            } catch (err) {
                console.error('⚠️ خطأ في حفظ النتائج:', err);
            }
        };
        saveResult();
    }, [reportData, weather]);

    if (!reportData) return <p className="text-center mt-20">{t('loading')}</p>;

    const { answers } = reportData;
    const temperature = weather?.temp ?? 30;
    const humidity = weather?.humidity ?? 50;
    const city = weather?.city ?? t('undefined');
    const desc = weather?.desc ?? '';
    const wind = weather?.wind ?? 0;

    
    const assessSleep = (key) => {
        switch (key) {
            case 'opt21':
                return { rating: t('unsafe'), advice: t('sleepAdviceLow') };
            case 'opt22':
                return { rating: t('caution'), advice: t('sleepAdviceMed') };
            case 'opt23':
                return { rating: t('safe'), advice: t('sleepAdviceHigh') };
            default:
                return { rating: t('caution'), advice: t('sleepAdviceMed') };
        }
    };
    const assessReadiness = (key) => {
        switch (key) {
            case 'opt31': return { rating: t('safe'), advice: t('readinessYesAdvice') };
            case 'opt32': return { rating: t('allowed'), advice: t('readinessSomewhatAdvice') };
            case 'opt33': return { rating: t('caution'), advice: t('readinessNotSureAdvice') };
            case 'opt34': return { rating: t('unsafe'), advice: t('readinessNoAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };
    const assessField = (key) => {
        switch (key) {
            case 'opt41': case 'opt42': case 'opt43':
                return { rating: t('safe'), advice: t('fieldNormalAdvice') };
            case 'opt44':
                return { rating: t('caution'), advice: t('fieldOtherAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };
    const assessEffort = (key) => {
        switch (key) {
            case 'opt51': return { rating: t('safe'), advice: t('effortLowAdvice') };
            case 'opt52': return { rating: t('allowed'), advice: t('effortMedAdvice') };
            case 'opt53': return { rating: t('caution'), advice: t('effortHighAdvice') };
            case 'opt54': return { rating: t('unsafe'), advice: t('effortMaxAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };
    const assessBody = (key) => {
        switch (key) {
            case 'opt61': return { rating: t('safe'), advice: t('bodyHealthyAdvice') };
            case 'opt62': return { rating: t('allowed'), advice: t('bodyMildTiredAdvice') };
            case 'opt63': return { rating: t('caution'), advice: t('bodySomePainAdvice') };
            case 'opt64': return { rating: t('unsafe'), advice: t('bodyExhaustedAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };
    const assessTemperature = (temp) => {
        if (temp <= 30) return { rating: t('safe'), advice: t('tempSafeAdvice') };
        if (temp <= 34) return { rating: t('caution'), advice: t('tempMedAdvice') };
        return { rating: t('unsafe'), advice: t('tempUnsafeAdvice') };
    };
    const assessHumidity = (hum) => {
        if (hum <= 60) return { rating: t('safe'), advice: t('humiditySafeAdvice') };
        if (hum <= 70) return { rating: t('caution'), advice: t('humidityMedAdvice') };
        return { rating: t('unsafe'), advice: t('humidityUnsafeAdvice') };
    };

    const items = [
        { label: t('sleep'), value: assessSleep(answers.sleepHours) },
        { label: t('readiness'), value: assessReadiness(answers.readiness) },
        { label: t('fieldType'), value: assessField(answers.fieldType) },
        { label: t('effort'), value: assessEffort(answers.effortLevel) },
        { label: t('body'), value: assessBody(answers.bodyFeeling) },
        { label: t('temperature'), value: assessTemperature(temperature) },
        { label: t('humidity'), value: assessHumidity(humidity) },
    ];

    const getCardStyle = (rating) => {
        switch (rating) {
            case t('safe'): return { bg: 'bg-green-200 dark:bg-green-700', icon: <FaCheckCircle className="text-green-600 dark:text-green-300 w-6 h-6" /> };
            case t('caution'): return { bg: 'bg-orange-300 dark:bg-orange-500', icon: <FaExclamationTriangle className="text-orange-600 dark:text-orange-300 w-6 h-6" /> };
            case t('allowed'): return { bg: 'bg-yellow-200 dark:bg-yellow-400', icon: <FaRegCircle className="text-yellow-600 dark:text-yellow-300 w-6 h-6" /> };
            case t('unsafe'): return { bg: 'bg-red-200 dark:bg-red-700', icon: <FaTimesCircle className="text-red-600 dark:text-red-300 w-6 h-6" /> };
            default: return { bg: 'bg-gray-100 dark:bg-gray-600', icon: null };
        }
    };

    
    const exportAllResults = async () => {
        try {
            const res = await fetch('/api/trainingResults/all');
            const { results } = await res.json();
            if (!results?.length) return alert("لا توجد نتائج");

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
                bodyExhaustedAdvice: "- تأجيل التدريب أو استبداله بتمارين استشفاء خفيفة، مع مراقبة الحالة الصحية والتأكد من عدم تفاقم الإصابة.",
                tempSafeAdvice: "- متابعة التدريب المعتاد.",
                tempMedAdvice: "- تقليل شدة التدريب تدريجيًا والالتزام بالتعليمات الأساسية.",
                tempUnsafeAdvice: "- تغيير وقت التمرين، تقليل شدة التدريب، مراقبة علامات التعب باستمرار.",
                humiditySafeAdvice: "- استمر في التدريب حسب الخطة المعتادة.",
                humidityMedAdvice: "- شرب السوائل كل 20 دقيقة، أخذ فترات استراحة قصيرة، تقليل شدة التمرين عند الإرهاق، مراقبة علامات التعب.",
                humidityUnsafeAdvice: "- تقليل شدة التدريب أو تأجيله، شرب السوائل، أخذ فترات استراحة متكررة، والانتباه للإرهاق."
            };

            
            const assessSleep = val => val.includes("أقل من 5") ? { rating: t.unsafe, advice: t.sleepAdviceLow } : val.includes("بين 5 و 7") ? { rating: t.caution, advice: t.sleepAdviceMed } : { rating: t.safe, advice: t.sleepAdviceHigh };
            const assessReadiness = val => val === "جاهز جدًا" ? { rating: t.safe, advice: t.readinessYesAdvice } : val === "جاهز جزئيًا" ? { rating: t.safe, advice: t.readinessSomewhatAdvice } : val === "غير متأكد" ? { rating: t.caution, advice: t.readinessNotSureAdvice } : val === "غير جاهز" ? { rating: t.unsafe, advice: t.readinessNoAdvice } : { rating: "-", advice: "-" };
            const assessField = val => ["أرضية طبيعية", "أرضية صناعية", "أرضية مغطاة"].includes(val) ? { rating: t.safe, advice: t.fieldNormalAdvice } : val === "أخرى" ? { rating: t.caution, advice: t.fieldOtherAdvice } : { rating: "-", advice: "-" };
            const assessEffort = val => val === "جهد منخفض" ? { rating: t.safe, advice: t.effortLowAdvice } : val === "جهد متوسط" ? { rating: t.allowed, advice: t.effortMedAdvice } : val === "جهد عالي" ? { rating: t.caution, advice: t.effortHighAdvice } : val === "جهد مكثف" ? { rating: t.unsafe, advice: t.effortMaxAdvice } : { rating: "-", advice: "-" };
            const assessBody = val => val === "شعور جيد" ? { rating: t.safe, advice: t.bodyHealthyAdvice } : val === "شعور متوسط" ? { rating: t.allowed, advice: t.bodyMildTiredAdvice } : val === "ألم خفيف" ? { rating: t.caution, advice: t.bodySomePainAdvice } : val === "إرهاق شديد" ? { rating: t.unsafe, advice: t.bodyExhaustedAdvice } : { rating: "-", advice: "-" };
            const assessTemperature = val => val <= 30 ? { rating: t.safe, advice: t.tempSafeAdvice } : val <= 34 ? { rating: t.caution, advice: t.tempMedAdvice } : { rating: t.unsafe, advice: t.tempUnsafeAdvice };
            const assessHumidity = val => val <= 60 ? { rating: t.safe, advice: t.humiditySafeAdvice } : val <= 70 ? { rating: t.caution, advice: t.humidityMedAdvice } : { rating: t.unsafe, advice: t.humidityUnsafeAdvice };

            const sheetData = [["اسم المتدرب", "الهاتف", "العمر", "المدينة",
                "النوم (التقييم)", "النوم (التعليمات)", "الجاهزية (التقييم)", "الجاهزية (التعليمات)",
                "نوع الأرضية (التقييم)", "نوع الأرضية (التعليمات)", "مستوى الجهد (التقييم)", "مستوى الجهد (التعليمات)",
                "الحالة الجسدية (التقييم)", "الحالة الجسدية (التعليمات)", "درجة الحرارة (التقييم)", "درجة الحرارة (التعليمات)",
                "الرطوبة (التقييم)", "الرطوبة (التعليمات)", "تاريخ التقييم"]];

            for (const r of results) {
                const sleep = assessSleep(r.sleepHours);
                const readiness = assessReadiness(r.readiness);
                const field = assessField(r.fieldType);
                const effort = assessEffort(r.effortLevel);
                const body = assessBody(r.bodyFeeling);
                const tempEval = assessTemperature(r.temperature);
                const humEval = assessHumidity(r.humidity);

                sheetData.push([
                    r.trainee?.name || "",
                    r.trainee?.phone || "",
                    r.trainee?.age || "",
                    r.city || "",
                    sleep.rating, sleep.advice,
                    readiness.rating, readiness.advice,
                    field.rating, field.advice,
                    effort.rating, effort.advice,
                    body.rating, body.advice,
                    tempEval.rating, tempEval.advice,
                    humEval.rating, humEval.advice,
                    new Date(r.createdAt).toLocaleString("ar-SA")
                ]);
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(wb, ws, "نتائج التدريب");
            XLSX.writeFile(wb, "TrainingResults_All.xlsx");

        } catch (err) {
            console.error(err);
            alert("حدث خطأ عند التصدير");
        }
    };



    return (
        <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-3xl p-6 sm:p-8 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>

                <h1 className="text-3xl font-bold text-center mb-2">{t('trainingReport')}</h1>

                <div className="text-center mb-6">
                    {weather ? (
                        <>
                            <p>📍 <b>{t('location')}:</b> {city}</p>
                            <p>{t('weatherInfo')}: {temperature}°C | {t('humidity')}: {humidity}% | 💨 {wind} km/h</p>
                            {desc && <p>{t('weatherDesc')}: {desc}</p>}
                        </>
                    ) : (
                        <p className="text-red-500 text-sm mt-2">{error || t('loadingWeather')}</p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {items.map(item => {
                        const style = getCardStyle(item.value.rating);
                        return (
                            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                                className={`p-4 border border-gray-200 dark:border-slate-600 rounded-xl ${style.bg} flex flex-col gap-2`}>
                                <div className="flex items-center gap-2">
                                    {style.icon}
                                    <h2 className="font-semibold text-lg">{item.label}</h2>
                                </div>
                                <p><span className="font-bold">{t('rating')}:</span> {item.value.rating}</p>
                                <p className="whitespace-pre-line"><span className="font-bold">{t('advice')}:</span> {item.value.advice}</p>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button onClick={() => router.push('/')} className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-colors duration-200">
                        {t('back')}
                    </button>
                    {/* <button onClick={exportAllResults} className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition-colors duration-200 flex items-center justify-center gap-2">
                        <FaFileExport /> {t('exportExcel')}
                    </button> */}
                    {isAdmin && (
                        <button onClick={exportAllResults} className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition-colors duration-200 flex items-center justify-center gap-2">
                            <FaFileExport /> {t('exportExcel')}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
