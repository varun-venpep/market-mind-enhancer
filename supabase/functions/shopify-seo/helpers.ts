
export function analyzeSEO(product) {
  const issues = [];
  let score = 100;
  const optimizations = [];

  // Title checks
  if (!product.title || product.title.length < 5) {
    issues.push({
      type: 'title',
      severity: 'high',
      message: 'Product title is too short or missing',
    });
    score -= 20;
    optimizations.push({
      type: 'title',
      field: 'title',
      original: product.title || '',
      suggestion: product.title ? `${product.title} - Best Quality Product` : 'New High-Quality Product',
      applied: false,
    });
  } else if (product.title.length > 70) {
    issues.push({
      type: 'title',
      severity: 'medium',
      message: 'Product title is too long (over 70 characters)',
    });
    score -= 10;
    optimizations.push({
      type: 'title',
      field: 'title',
      original: product.title,
      suggestion: product.title.substring(0, 67) + '...',
      applied: false,
    });
  }

  // Description checks
  if (!product.body_html || product.body_html.length < 50) {
    issues.push({
      type: 'description',
      severity: 'high',
      message: 'Product description is too short or missing',
    });
    score -= 20;
    optimizations.push({
      type: 'description',
      field: 'body_html',
      original: product.body_html || '',
      suggestion: product.body_html ? `${product.body_html}<p>High quality product with premium features.</p>` : '<p>This is a premium quality product that offers exceptional value. Perfect for those looking for reliability and performance.</p>',
      applied: false,
    });
  }

  // Image checks
  if (!product.images || product.images.length === 0) {
    issues.push({
      type: 'image',
      severity: 'high',
      message: 'Product has no images',
    });
    score -= 15;
    optimizations.push({
      type: 'image',
      field: 'images',
      original: 'No images',
      suggestion: 'Add at least one high-quality product image',
      applied: false,
    });
  } else if (product.images.length < 3) {
    issues.push({
      type: 'image',
      severity: 'medium',
      message: 'Product has fewer than 3 images',
    });
    score -= 5;
    optimizations.push({
      type: 'image',
      field: 'images',
      original: `${product.images.length} images`,
      suggestion: 'Add more product images from different angles',
      applied: false,
    });
  }

  // Image alt text
  const imagesWithoutAlt = product.images?.filter(img => !img.alt || img.alt.trim() === '').length;
  if (imagesWithoutAlt > 0 && product.images && product.images.length > 0) {
    issues.push({
      type: 'image',
      severity: 'medium',
      message: `${imagesWithoutAlt} images missing alt text`,
    });
    score -= 5;
    optimizations.push({
      type: 'image',
      field: 'image_alt',
      original: 'Missing alt text',
      suggestion: `${product.title} - product image`,
      applied: false,
    });
  }

  // Handle/URL checks
  if (!product.handle || product.handle.includes('copy-of') || product.handle.includes('untitled')) {
    issues.push({
      type: 'url',
      severity: 'medium',
      message: 'Product URL could be improved',
    });
    score -= 10;
    optimizations.push({
      type: 'url',
      field: 'handle',
      original: product.handle || '',
      suggestion: product.title ? product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '') : 'improved-product-url',
      applied: false,
    });
  }

  // Tag checks
  if (!product.tags || product.tags.length === 0) {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'No product tags defined',
    });
    score -= 10;
    optimizations.push({
      type: 'content',
      field: 'tags',
      original: '',
      suggestion: `${product.product_type || ''}, quality product, best seller`,
      applied: false,
    });
  }

  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score));

  return { issues, score, optimizations };
}
