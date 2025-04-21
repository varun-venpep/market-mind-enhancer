
// SEO analysis helper functions
import type { ShopifyProduct } from "../_shared/types.ts";

interface SEOIssue {
  type: 'title' | 'description' | 'image' | 'content' | 'url';
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
}

interface SEOOptimization {
  type: 'title' | 'description' | 'image' | 'content' | 'url';
  field: string;
  original: string;
  suggestion: string;
  applied: boolean;
}

export function analyzeSEO(product: ShopifyProduct) {
  const issues: SEOIssue[] = [];
  const optimizations: SEOOptimization[] = [];
  let score = 100; // Start with perfect score

  // Title analysis
  if (!product.title) {
    issues.push({
      type: 'title',
      severity: 'high',
      message: 'Product title is missing'
    });
    score -= 15;
  } else if (product.title.length < 5) {
    issues.push({
      type: 'title',
      severity: 'high',
      message: 'Product title is too short',
      details: 'Title should be at least 5 characters'
    });
    score -= 10;
    
    optimizations.push({
      type: 'title',
      field: 'title',
      original: product.title,
      suggestion: `${product.title} - Premium ${product.product_type || 'Product'}`,
      applied: false
    });
  } else if (product.title.length > 70) {
    issues.push({
      type: 'title',
      severity: 'medium',
      message: 'Product title is too long',
      details: 'Title should be 70 characters or less for optimal display in search results'
    });
    score -= 5;
    
    optimizations.push({
      type: 'title',
      field: 'title',
      original: product.title,
      suggestion: product.title.substring(0, 67) + '...',
      applied: false
    });
  }

  // Description analysis
  if (!product.body_html) {
    issues.push({
      type: 'description',
      severity: 'high',
      message: 'Product description is missing'
    });
    score -= 15;
    
    optimizations.push({
      type: 'description',
      field: 'body_html',
      original: '',
      suggestion: `<p>This ${product.product_type || 'product'} offers exceptional quality and value.</p><p>Features include:</p><ul><li>Premium materials</li><li>Expert craftsmanship</li><li>Long-lasting durability</li></ul>`,
      applied: false
    });
  } else {
    // Check for plain text (no HTML)
    const plainText = product.body_html.replace(/<[^>]*>/g, '');
    
    if (plainText.length < 100) {
      issues.push({
        type: 'description',
        severity: 'medium',
        message: 'Product description is too short',
        details: 'Description should be at least 100 characters for good SEO'
      });
      score -= 10;
      
      optimizations.push({
        type: 'description',
        field: 'body_html',
        original: product.body_html,
        suggestion: `${product.body_html}<p>This premium ${product.product_type || 'product'} is designed to exceed your expectations with exceptional quality, craftsmanship, and attention to detail.</p>`,
        applied: false
      });
    }
    
    // Check for HTML structure
    if (!/<h[1-6]|<p|<ul|<ol/.test(product.body_html)) {
      issues.push({
        type: 'description',
        severity: 'low',
        message: 'Description lacks proper HTML structure',
        details: 'Using headings, paragraphs, and lists improves readability and SEO'
      });
      score -= 5;
    }
  }

  // URL/handle analysis
  if (!product.handle) {
    issues.push({
      type: 'url',
      severity: 'high',
      message: 'Product URL handle is missing'
    });
    score -= 10;
  } else if (product.handle.length > 50) {
    issues.push({
      type: 'url',
      severity: 'low',
      message: 'Product URL handle is too long',
      details: 'URL handles should be concise for better user experience'
    });
    score -= 3;
    
    optimizations.push({
      type: 'url',
      field: 'handle',
      original: product.handle,
      suggestion: product.handle.split('-').slice(0, 5).join('-'),
      applied: false
    });
  }

  // Image analysis
  if (!product.images || product.images.length === 0) {
    issues.push({
      type: 'image',
      severity: 'high',
      message: 'No product images found'
    });
    score -= 15;
  } else {
    // Check for alt text
    const imagesWithoutAlt = product.images.filter(img => !img.alt || img.alt.trim() === '');
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'image',
        severity: 'medium',
        message: `${imagesWithoutAlt.length} image(s) missing alt text`,
        details: 'Alt text helps with accessibility and SEO'
      });
      score -= 5 * Math.min(3, imagesWithoutAlt.length); // Cap penalty at 15 points
      
      optimizations.push({
        type: 'image',
        field: 'image_alt',
        original: '',
        suggestion: `${product.title} - ${product.product_type || 'Product'} image`,
        applied: false
      });
    }
  }

  // Tags analysis
  if (!product.tags || product.tags === '') {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'No product tags found',
      details: 'Tags help with categorization and search'
    });
    score -= 10;
    
    // Suggest tags based on product type and title
    const words = product.title.split(' ')
      .filter(word => word.length > 3)
      .map(word => word.toLowerCase())
      .slice(0, 5);
    
    if (product.product_type) {
      words.push(product.product_type.toLowerCase());
    }
    if (product.vendor) {
      words.push(product.vendor.toLowerCase());
    }
    
    // Remove duplicates
    const uniqueWords = [...new Set(words)];
    
    optimizations.push({
      type: 'content',
      field: 'tags',
      original: product.tags || '',
      suggestion: uniqueWords.join(', '),
      applied: false
    });
  }

  // Ensure score is within range
  score = Math.max(0, Math.min(100, score));

  return {
    issues,
    score,
    optimizations
  };
}
