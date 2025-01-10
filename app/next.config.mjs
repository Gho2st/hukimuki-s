/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["hukimuki.s3.eu-central-1.amazonaws.com"], // Dozwolone źródła obrazów
  },
  reactStrictMode: false,
  api: {
    bodyParser: {
      sizeLimit: "50mb", // Zwiększ limit do 50 MB dla przesyłanych plików
    },
  },
};

export default nextConfig;
