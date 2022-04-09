import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
const MyId = () => {
    const { t } = useTranslation('common');

    return <div>Hello {t('home')}</div>
}

export async function getStaticProps({ params, locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
            slug: params.slug,

        },
    };
}

export async function getStaticPaths() {
    return {
        paths: [
            // String variant:
            '/match/first-post',
            // Object variant:
            { params: { slug: 'second-post' } },
        ],
        fallback: true,
    }
}


export default MyId;