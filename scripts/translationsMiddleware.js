const fs = require("fs");
const path = require("path");
const fetch = require("isomorphic-unfetch");
require("dotenv").config({ path: "./.env.production" });

(async () => {
    try {
        const selectedLanguages = process.env.NEXT_PUBLIC_LOCALES?.split(",");

        if (!process.env.NEXT_PUBLIC_LOCALES) {
            throw new Error("Pls provide selected languages.");
        }

        console.log("Start fetching localizations 🚀");

        const fetchedLanguages = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_TOKEN}/labels`
        )
            .then((response) => {
                if (response.status === 200) {
                    console.log("Localizations has been successfully fetched ✨");
                } else {
                    throw new Error(
                        `Response status: ${response.status}. Message: ${response.statusText}`
                    );
                }

                return response.json();
            })
            .then((data) => data[0])
            .catch((err) => {
                console.log("Unable to fetch localization 🤖 -", err);
            });

        try {
            if (!fetchedLanguages) {
                throw new Error("Can't write localization.");
            }
            const localesFolderPath = "public/locales";
            fs.rmSync(localesFolderPath, { recursive: true, force: true });

            selectedLanguages.forEach((language) => {
                console.log(`Installing ${language} language 📝`);
                const localesFilePath = `${localesFolderPath}/${language}`;

                if (!fs.existsSync(localesFolderPath)) {
                    fs.mkdirSync(localesFolderPath);
                }

                if (!fs.existsSync(localesFilePath)) {
                    fs.mkdirSync(localesFilePath);
                }

                const fetchedLanguage = fetchedLanguages[language];

                if (!fetchedLanguage) {
                    throw new Error(
                        `We don't have ${language} language. Pls check selected languages 🕵️`
                    );
                }

                fs.writeFileSync(
                    path.resolve(`${localesFolderPath}/${language}/common.json`),
                    JSON.stringify(fetchedLanguage)
                );

                console.log(`Language ${language} has been successfully installed 🎉`);
            });
        } catch (e) {
            console.log("Something went wrong 🤖. Error message =>", e);
        }
    } catch (e) {
        console.log(e);
    }
})();
