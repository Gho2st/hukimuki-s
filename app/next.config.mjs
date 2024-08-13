import autoCert from "anchor-pki/auto-cert/integrations/next";

const withAutoCert = autoCert({
  enabledEnv: "development",
});

const nextConfig = {
  reactStrictMode: false, // Wyłącza React Strict Mode
};

export default withAutoCert(nextConfig);
