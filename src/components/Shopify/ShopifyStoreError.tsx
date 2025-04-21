
import React from "react";
import { useNavigate } from "react-router-dom";
interface Props {
  error: string;
}
const ShopifyStoreError = ({ error }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-8">
      <div className="rounded-lg bg-red-50 p-6 shadow-sm border border-red-200 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Error Loading Store</h1>
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard/shopify')} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Back to Stores
        </button>
      </div>
    </div>
  );
};
export default ShopifyStoreError;
