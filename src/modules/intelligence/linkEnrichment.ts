import type { AnyEntity, GraphEdge, RelationType } from '../../types/intelligenceTypes';

/**
 * Automáticamente descubre vínculos basados en data compartida entre entidades
 * Inspirado en las transformaciones de Maltego
 */
export const runLinkEnrichment = (entities: AnyEntity[]): GraphEdge[] => {
  const newEdges: GraphEdge[] = [];
  
  // 1. Vínculos por Co-imputación (si están en la misma lista de criminalRecord)
  const people = entities.filter(e => e.entityType === 'PERSONA');
  
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const p1 = people[i] as any;
      const p2 = people[j] as any;
      
      const commonCausas = p1.criminalRecord.filter((c: string) => p2.criminalRecord.includes(c));
      
      if (commonCausas.length > 0) {
        newEdges.push({
          id: `auto-link-${p1.id}-${p2.id}`,
          source: p1.id,
          target: p2.id,
          relationType: 'CO_IMPUTADO' as RelationType,
          confidence: 0.9,
          verificationLevel: 'INFERIDO',
          sourceInfo: `Automático: Co-imputados en ${commonCausas.length} causa(s)`,
          dateDetected: new Date().toISOString()
        });
      }
    }
  }
  
  return newEdges;
};
