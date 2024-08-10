import { MetadataRoute } from 'next';
import { userAgent } from 'next/server';
import sitemap from './sitemap';

export default function robots(){
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "privacy"]
            }
        ],
        sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
    }
}