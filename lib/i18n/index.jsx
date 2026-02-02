// const { createTranslation } = require('next-i18next')
// const i18nConfig = require('../../next-i18next.config')

// const { useTranslation, Trans, t } = createTranslation(i18nConfig)

// module.exports = { useTranslation, Trans, t }



// lib/i18n/index.jsx
'use client';

import { useTranslation as useNextTranslation, Trans } from 'next-i18next';

export const useTranslation = () => {
    const { t, i18n } = useNextTranslation();
    return { t, i18n, Trans };
};