const withFlowbiteReact = require("flowbite-react/plugin/nextjs");


/** @type {import('next').NextConfig} */
const nextConfig = {
    // i18n,
    output: 'standalone',
    images: {
        domains: ['qorza.onrender.com'],
    },
};



module.exports = withFlowbiteReact(nextConfig);