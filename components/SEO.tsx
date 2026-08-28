"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export default function SEO({
  title,
  description,
  canonicalUrl,
  imageUrl = "/logo.png",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: SEOProps) {
  const pathname = usePathname();
  const siteUrl = "https://www.aafaqalmasar.ae";
  const fullUrl = canonicalUrl || `${siteUrl}${pathname}`;
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={fullImageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
    </Head>
  );
}