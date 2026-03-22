import { Helmet } from 'react-helmet-async';

export const SeoWrapper = ({ title, description, url, image = "https://images.unsplash.com/photo-1618477247222-ac60c74187b8?q=80&w=1200", type = "website" }) => {
  const siteName = "Teja - Digital Marketer & Web Developer";
  const defaultDesc = "I fuse data-driven digital marketing with high-performance modern web engineering to build brands that convert natively.";
  
  return (
    <Helmet>
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description || defaultDesc} />

      {/* Primary Open Graph Tracking / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || "https://tejakumar.com"} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image} />

      {/* Twitter Massive Card Rendering */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || "https://tejakumar.com"} />
      <meta property="twitter:title" content={title || siteName} />
      <meta property="twitter:description" content={description || defaultDesc} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SeoWrapper;
