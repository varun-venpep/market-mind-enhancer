
import { useEffect, useState } from "react";
import { getSiteAuditHistory, getOptimizationHistory } from "@/services/shopify";
import type { WebsiteSEOAudit, ShopifyOptimizationHistory } from "@/types/shopify";

export function useShopifyAuditHistory(storeId: string | undefined) {
  const [siteAudit, setSiteAudit] = useState<WebsiteSEOAudit | null>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<ShopifyOptimizationHistory[]>([]);

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      try {
        const audits = await getSiteAuditHistory(storeId);
        if (audits && audits.length > 0) setSiteAudit(audits[0]);
      } catch {}

      try {
        const history = await getOptimizationHistory(storeId);
        setOptimizationHistory(history || []);
      } catch {}
    })();
  }, [storeId]);

  return { siteAudit, setSiteAudit, optimizationHistory, setOptimizationHistory };
}
