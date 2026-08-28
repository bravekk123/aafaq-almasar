import { MetadataRoute } from "next";
import { sectorsData } from "./sectors/sectorsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aafaqalmasar.ae";

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/services",
    "/projects",
    "/careers",
    "/contact",
    "/invoice",
    "/letter",
    "/quotation",
    "/privacy-policy",
    "/terms-and-conditions",
    "/sectors",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Sector pages
  const sectorPages = sectorsData.map((sector) => ({
    url: `${baseUrl}/sectors/${sector.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...sectorPages];
}