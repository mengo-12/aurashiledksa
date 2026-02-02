module.exports = [
    'strapi::errors',
    'strapi::security',
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            origin: ['https://qorza.vercel.app/ar'], // أو حط رابط فرونتندك مثلا https://your-frontend.vercel.app
            credentials: true,
        },
    },
    // باقي الـmiddlewares
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];