
export async function recordOptimizationHistory(
  supabase: any,
  storeId: string,
  entityId: string | number,
  entityType: string,
  field: string,
  originalValue: string,
  newValue: string,
  userId: string
) {
  console.log('Recording optimization history:', {
    storeId,
    entityId,
    entityType,
    field
  });
  
  if (!storeId || !entityId || !entityType || !field) {
    console.error('Missing required parameters for optimization history');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('shopify_optimization_history')
      .insert({
        store_id: storeId,
        entity_id: entityId.toString(),
        entity_type: entityType,
        field: field,
        original_value: originalValue || '',
        new_value: newValue || '',
        applied_at: new Date().toISOString(),
        applied_by: userId || 'system',
        optimization_type: field.includes('meta') ? 'metadata' : 'content'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error recording optimization history:', error);
      throw error;
    }

    console.log('Successfully recorded optimization history with ID:', data?.id);
    return data?.id;
  } catch (error) {
    console.error('Error in recordOptimizationHistory:', error);
    // Don't throw here, just log the error to prevent blocking the optimization process
    return null;
  }
}
