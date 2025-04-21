
export async function getStore(supabase: any, storeId: string) {
  const { data: store, error: storeError } = await supabase
    .from('shopify_stores')
    .select('*')
    .eq('id', storeId)
    .maybeSingle();
  return { store, error: storeError };
}
