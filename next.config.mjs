/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Локальные SVG/растровые ассеты лежат в /public — оптимизатор не нужен,
    // а dangerouslyAllowSVG позволяет рендерить SVG-плейсхолдеры через next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
