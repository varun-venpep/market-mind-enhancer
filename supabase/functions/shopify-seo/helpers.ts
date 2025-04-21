
import { SEOIssue, SEOOptimization } from "./types.ts";

export function analyzeSEO(product: any) {
  const issues: SEOIssue[] = [];
  const optimizations: SEOOptimization[] = [];
  let score = 100;

  // Analyze title
  if (!product.title || product.title.length < 5) {
    issues.push({
      type: 'title',
      severity: 'high',
      message: 'Product title is too short',
      details: 'Title should be descriptive and contain relevant keywords'
    });
    score -= 15;
    
    optimizations.push({
      type: 'title',
      field: 'title',
      original: product.title || '',
      suggestion: product.title ? `${product.title} - Premium ${product.product_type || 'Product'}` : 'Premium Product',
      applied: false
    });
  } else if (product.title.length > 70) {
    issues.push({
      type: 'title',
      severity: 'medium',
      message: 'Product title is too long',
      details: 'Title should be under 70 characters for optimal display in search results'
    });
    score -= 10;
    
    optimizations.push({
      type: 'title',
      field: 'title',
      original: product.title,
      suggestion: product.title.substring(0, 67) + '...',
      applied: false
    });
  }

  // Analyze description
  if (!product.body_html || product.body_html.length < 50) {
    issues.push({
      type: 'description',
      severity: 'high',
      message: 'Product description is too short or missing',
      details: 'Description should be detailed and contain relevant keywords'
    });
    score -= 15;
    
    const defaultDescription = `This premium ${product.product_type || 'product'} offers excellent quality and value. Perfect for those looking for ${product.title || 'quality products'}.`;
    
    optimizations.push({
      type: 'description',
      field: 'body_html',
      original: product.body_html || '',
      suggestion: product.body_html ? product.body_html + '<p>' + defaultDescription + '</p>' : '<p>' + defaultDescription + '</p>',
      applied: false
    });
  }

  // Analyze handle / URL
  if (!product.handle || product.handle.includes('copy-of') || /^\d+$/.test(product.handle)) {
    issues.push({
      type: 'url',
      severity: 'medium',
      message: 'Product URL is not optimized',
      details: 'URL should be descriptive and contain relevant keywords'
    });
    score -= 10;
    
    let suggested_handle = '';
    if (!product.handle) {
      suggested_handle = product.title ? product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '') : 'product';
    } else if (product.handle.includes('copy-of')) {
      suggested_handle = product.handle.replace('copy-of-', '');
    } else if (/^\d+$/.test(product.handle)) {
      suggested_handle = product.title ? product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '') : 'product';
    }
    
    optimizations.push({
      type: 'url',
      field: 'handle',
      original: product.handle || '',
      suggestion: suggested_handle,
      applied: false
    });
  }

  // Analyze images
  if (!product.images || product.images.length === 0) {
    issues.push({
      type: 'image',
      severity: 'high',
      message: 'Product has no images',
      details: 'Images are essential for SEO and user experience'
    });
    score -= 20;
  } else {
    const imagesWithoutAlt = product.images.filter((img: any) => !img.alt || img.alt.trim() === '');
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'image',
        severity: 'medium',
        message: `${imagesWithoutAlt.length} images missing alt text`,
        details: 'All images should have descriptive alt text for SEO and accessibility'
      });
      score -= Math.min(15, imagesWithoutAlt.length * 5);
      
      optimizations.push({
        type: 'image',
        field: 'image_alt',
        original: '',
        suggestion: `${product.title || 'Product'} - ${product.product_type || 'Item'} image`,
        applied: false
      });
    }
  }

  // Analyze tags
  if (!product.tags || product.tags.length === 0) {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'Product has no tags',
      details: 'Tags help with internal search and categorization'
    });
    score -= 10;
    
    let suggestedTags = '';
    if (product.product_type) {
      suggestedTags = product.product_type;
    }
    if (product.vendor) {
      suggestedTags += suggestedTags ? `, ${product.vendor}` : product.vendor;
    }
    suggestedTags += suggestedTags ? ', premium, quality' : 'premium, quality';
    
    optimizations.push({
      type: 'content',
      field: 'tags',
      original: product.tags || '',
      suggestion: suggestedTags,
      applied: false
    });
  }

  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));

  return { issues, score, optimizations };
}
