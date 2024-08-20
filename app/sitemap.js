export default function sitemap() {
  return [
    {
      url: "https://hukimuki.pl",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://hukimuki.pl/rezerwacje",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
