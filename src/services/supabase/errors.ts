
export function handleApiError(error: any, defaultMessage: string = 'An error occurred'): string {
  console.error('API Error:', error);
  
  if (error.message) {
    // If it's a standard Error object
    return error.message;
  } else if (error.error) {
    // If it's a Supabase error
    return error.error.message || error.error;
  } else if (typeof error === 'string') {
    // If it's a string
    return error;
  }
  
  // Default fallback
  return defaultMessage;
}
