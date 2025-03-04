
import { supabase } from "@/lib/supabase";

interface LogEntry {
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
}

export async function logUserAction(logData: LogEntry) {
  console.log("Registrando ação de usuário:", logData);
  
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: logData.user_id,
        action: logData.action,
        resource_type: logData.resource_type,
        resource_id: logData.resource_id,
        details: logData.details
      });
    
    if (error) {
      console.error("Erro ao registrar log de auditoria:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao registrar log de auditoria:", error);
    // We don't throw here to avoid failing the main operation
    // just because logging failed
    return false;
  }
}

export async function getAuditLogs(resourceType?: string, resourceId?: string, limit = 100) {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (resourceType) {
    query = query.eq('resource_type', resourceType);
  }
  
  if (resourceId) {
    query = query.eq('resource_id', resourceId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Erro ao buscar logs de auditoria:", error);
    throw error;
  }
  
  return data;
}
