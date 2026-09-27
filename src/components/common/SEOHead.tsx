import React, { useEffect } from 'react';
import type { Product } from '../../types/product';

interface SEOHeadProps {
  title?: string;
  description?: string;
  product?: Product;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, product }) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | MOMEN CENTER — مؤمن سنتر`
      : 'MOMEN CENTER | مؤمن سنتر — دار الأزياء النسائية الراقية منذ 1999';

    document.title = fullTitle;

    const desc =
      description ||
      'اكتشفي أرقى تصاميم الأزياء والفساتين النسائية مع مؤمن سنتر. هوت كوتور، خامات حريرية فاخرة، وتجربة تسوق إلكترونية استثنائية.';

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // If viewing a product, insert Product JSON-LD structured data
    let productScript: HTMLScriptElement | null = null;
    if (product) {
      productScript = document.createElement('script');
      productScript.type = 'application/ld+json';
      productScript.id = 'product-structured-data';
      productScript.innerHTML = JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        brand: {
          '@type': 'Brand',
          name: "MOMEN CENTER"
        },
        offers: {
          '@type': 'Offer',
          url: window.location.href,
          priceCurrency: 'EGP',
          price: product.price,
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviews
        }
      });
      document.head.appendChild(productScript);
    }

    return () => {
      if (productScript && productScript.parentNode) {
        productScript.parentNode.removeChild(productScript);
      }
    };
  }, [title, description, product]);

  return null;
};
