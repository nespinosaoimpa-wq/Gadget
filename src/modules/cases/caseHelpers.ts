import type { CaseClassification, CaseStatus } from '../../types/case';

export const getStatusColor = (status: CaseStatus) => {
  switch (status) {
    case 'RECIBIDA': return 'var(--text-muted)';
    case 'EN INVESTIGACIÓN': return 'var(--accent-yellow)';
    case 'AMPLIACIÓN': return 'var(--accent-orange)';
    case 'REQUERIMIENTO': return 'var(--primary-cyan)';
    case 'ELEVADA': return 'var(--accent-green)';
    case 'ARCHIVADA': return '#666';
    default: return 'var(--text-muted)';
  }
};

export const getClassificationColor = (classification: CaseClassification) => {
  switch (classification) {
    case 'SECRETO': return 'var(--accent-red)';
    case 'RESERVADO': return 'var(--accent-orange)';
    case 'CONFIDENCIAL': return 'var(--accent-yellow)';
    case 'USO INTERNO': return 'var(--accent-green)';
    case 'PÚBLICO': return '#fff';
    default: return '#fff';
  }
};

export const getClassificationIcon = (classification: CaseClassification) => {
  switch (classification) {
    case 'SECRETO': return '🔴';
    case 'RESERVADO': return '🟠';
    case 'CONFIDENCIAL': return '🟡';
    case 'USO INTERNO': return '🟢';
    case 'PÚBLICO': return '⚪';
    default: return '⚪';
  }
};
