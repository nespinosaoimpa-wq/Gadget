// @ts-ignore
import distance from 'jaro-winkler';
import type { AnyEntity, PersonEntity } from '../../types/intelligenceTypes';

export interface SuggestedMerge {
  entityA: AnyEntity;
  entityB: AnyEntity;
  score: number;
  matchType: 'EXACT' | 'FUZZY';
  reason: string;
}

export const findSuggestedMerges = (entities: AnyEntity[]): SuggestedMerge[] => {
  const suggestions: SuggestedMerge[] = [];
  const people = entities.filter(e => e.entityType === 'PERSONA') as PersonEntity[];

  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const p1 = people[i];
      const p2 = people[j];

      // Exact DNI match
      if (p1.dni && p2.dni && p1.dni === p2.dni) {
        suggestions.push({
          entityA: p1,
          entityB: p2,
          score: 1.0,
          matchType: 'EXACT',
          reason: `DNI idéntico: ${p1.dni}`
        });
        continue;
      }

      // Fuzzy Name match
      const nameScore = distance(p1.label.toLowerCase(), p2.label.toLowerCase());
      if (nameScore > 0.88) {
        suggestions.push({
          entityA: p1,
          entityB: p2,
          score: nameScore,
          matchType: 'FUZZY',
          reason: `Similitud de nombres: ${Math.round(nameScore * 100)}%`
        });
      }

      // Alias match
      const commonAlias = p1.aliases.find(a => p2.aliases.includes(a));
      if (commonAlias) {
        suggestions.push({
          entityA: p1,
          entityB: p2,
          score: 0.9,
          matchType: 'FUZZY',
          reason: `Alias común detectado: ${commonAlias}`
        });
      }
    }
  }

  return suggestions;
};
