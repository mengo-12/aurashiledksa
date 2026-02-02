'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import i18n from '@/i18n'

export default function LanguageSwitcher() {
    const { t } = useTranslation()
    const [currentLang, setCurrentLang] = useState(i18n.language || 'ar')

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        setCurrentLang(lng)
        document.dir = lng === 'ar' ? 'rtl' : 'ltr'
    }

    return (
        <div className="flex gap-3 justify-end mb-4">
            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => changeLanguage('ar')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-2 ${currentLang === 'ar' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300'
                    }`}
            >
                🇸🇦
            </motion.button>

            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-2 ${currentLang === 'en' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300'
                    }`}
            >
                🇬🇧
            </motion.button>
        </div>
    )
}
