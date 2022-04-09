require("dotenv").config({ path: "./env.development" });
const path = require("path");

module.exports = {
    i18n: {
        defaultLocale: process.env.NEXT_PUBLIC_LOCALES.split(",")[0],
        locales: process.env.NEXT_PUBLIC_LOCALES.split(","),
    },
};
