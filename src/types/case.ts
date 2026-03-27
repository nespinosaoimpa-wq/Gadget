export type CaseStatus = 'RECIBIDA' | 'EN INVESTIGACIÓN' | 'AMPLIACIÓN' | 'REQUERIMIENTO' | 'ELEVADA' | 'ARCHIVADA' | 'RESUELTO';
export type CaseClassification = 'SECRETO' | 'RESERVADO' | 'CONFIDENCIAL' | 'USO INTERNO' | 'PÚBLICO';

export interface Person {
  id: string;
  name: string;
  dni?: string;
  role: 'IMPUTADO' | 'TESTIGO' | 'VÍCTIMA' | 'DAMNIFICADO' | 'OTROS';
  alias?: string;
  status?: string;
}

export interface Case {
  id: string;
  cuij: string;
  title: string;
  description: string;
  type: 'NARCOTRÁFICO' | 'HOMICIDIO' | 'ROBO CALIFICADO' | 'MICROTRÁFICO' | 'DELITO COMPLEJO' | 'TRATA DE PERSONAS' | 'OTROS';
  status: CaseStatus;
  classification: CaseClassification;
  fiscal: string;
  fiscalia: string;
  startDate: string;
  incidentDate?: string;
  location?: {
    address: string;
    lat?: number;
    lng?: number;
  };
  persons: Person[];
  tags: string[];
}
