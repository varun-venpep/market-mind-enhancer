
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { performSiteAudit, applyOptimization } from '@/services/api';
import type { SiteAudit } from '@/types/shopify';

export function useShopifySiteAudit(storeId: string) {
  const [currentAudit, setCurrentAudit] = useState<SiteAudit | null>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<any[]>([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);
  const { toast } = useToast();

  const handleRunAudit = async () => {
    if (!storeId) return;
    
    setIsAuditLoading(true);
    
    try {
      const auditResult = await performSiteAudit(storeId);
      setCurrentAudit({
        store_id: storeId,
        audit_data: auditResult,
        created_at: new Date().toISOString(),
        score: auditResult.score
      });
      
      toast({
        title: "Site Audit Complete",
        description: "Full site SEO audit has been completed successfully"
      });
    } catch (error) {
      console.error("Error running site audit:", error);
      toast({
        title: "Audit Failed",
        description: "Failed to complete site SEO audit",
        variant: "destructive"
      });
    } finally {
      setIsAuditLoading(false);
    }
  };

  const handleApplyOptimization = async (optimization: any) => {
    if (!storeId || !currentAudit) return;
    
    try {
      await applyOptimization(storeId, optimization, currentAudit.id);
      
      setCurrentAudit(prev => {
        if (!prev) return null;
        
        const updatedAuditData = { ...prev.audit_data };
        updatedAuditData.optimizations = updatedAuditData.optimizations.map(opt => {
          if (opt.location === optimization.location && 
              opt.entity_id === optimization.entity_id && 
              opt.field === optimization.field) {
            return { ...opt, applied: true };
          }
          return opt;
        });
        
        return {
          ...prev,
          audit_data: updatedAuditData
        };
      });
      
      const newHistoryItem = {
        id: crypto.randomUUID(),
        store_id: storeId,
        optimization_type: optimization.type,
        entity_id: optimization.entity_id,
        entity_type: optimization.location,
        field: optimization.field,
        original_value: optimization.original,
        new_value: optimization.suggestion,
        applied_at: new Date().toISOString()
      };
      
      setOptimizationHistory(prev => [newHistoryItem, ...prev]);
      
      toast({
        title: "Optimization Applied",
        description: "SEO optimization has been successfully applied"
      });
    } catch (error) {
      console.error("Error applying optimization:", error);
      toast({
        title: "Optimization Failed",
        description: "Failed to apply SEO optimization",
        variant: "destructive"
      });
    }
  };

  return {
    currentAudit,
    optimizationHistory,
    isAuditLoading,
    handleRunAudit,
    handleApplyOptimization
  };
}
