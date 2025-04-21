
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
  try {
    const { data, error } = await supabase
      .from('shopify_optimization_history')
      .insert({
        store_id: storeId,
        entity_id: entityId.toString(),
        entity_type: entityType,
        field: field,
        original_value: originalValue,
        new_value: newValue,
        applied_at: new Date().toISOString(),
        applied_by: userId,
        optimization_type: field.includes('meta') ? 'metadata' : 'content'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error recording optimization history:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error recording optimization history:', error);
    throw error;
  }
}
