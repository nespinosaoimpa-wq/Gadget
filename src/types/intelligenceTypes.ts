import type { CaseClassification } from './case';

// === ENTITY TYPES (NODES) ===
export type EntityType = 
  | 'PERSONA' 
  | 'ORGANIZACION' 
  | 'VEHICULO' 
  | 'TELEFONO' 
  | 'UBICACION' 
  | 'EVENTO' 
  | 'CAUSA' 
  | 'DOCUMENTO';

export interface BaseEntity {
  id: string;
  entityType: EntityType;
  label: string;
  createdAt: string;
  source: string;
  classification: CaseClassification;
  metadata?: Record<string, any>;
}

export interface PersonEntity extends BaseEntity {
  entityType: 'PERSONA';
  dni?: string;
  aliases: string[];
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  photo?: string;
  physicalDescription?: string;
  criminalRecord: string[]; // IDs of related Case entities
}

export interface OrgEntity extends BaseEntity {
  entityType: 'ORGANIZACION';
  orgType: 'BANDA' | 'EMPRESA_FACHADA' | 'CLAN' | 'GRUPO_LOGISTICO' | 'OTROS';
  territory?: string;
  hierarchy: Array<{ personId: string; rank: string; role?: string }>;
}

export interface VehicleEntity extends BaseEntity {
  entityType: 'VEHICULO';
  plate?: string;
  vin?: string;
  make?: string;
  model?: string;
  color?: string;
  description?: string;
}

export interface PhoneEntity extends BaseEntity {
  entityType: 'TELEFONO';
  number: string;
  imei?: string;
  provider?: string;
  subscriberName?: string;
}

export interface LocationEntity extends BaseEntity {
  entityType: 'UBICACION';
  address: string;
  lat?: number;
  lng?: number;
  locationType: 'DOMICILIO' | 'LUGAR_HECHO' | 'PUNTO_VENTA' | 'AGUANTADERO' | 'OTROS';
}

export interface EventEntity extends BaseEntity {
  entityType: 'EVENTO';
  eventType: string;
  date: string;
  description: string;
}

// === RELATIONSHIP TYPES (EDGES) ===
export type RelationType = 
  | 'CO_IMPUTADO' 
  | 'FAMILIAR' 
  | 'COMUNICACION' 
  | 'FINANCIERO' 
  | 'PROPIETARIO' 
  | 'UBICADO_EN' 
  | 'PARTICIPO_EN' 
  | 'MIEMBRO_DE' 
  | 'SOSPECHOSO_DE' 
  | 'TESTIGO_DE' 
  | 'ASOCIADO_CON'
  | 'VINCULADO_A';

export interface GraphEdge {
  id: string;
  source: string; // Entity ID
  target: string; // Entity ID
  relationType: RelationType;
  confidence: number; // 0.0 to 1.0
  sourceInfo: string;
  dateDetected: string;
  metadata?: Record<string, any>;
}

export type AnyEntity = 
  | PersonEntity 
  | OrgEntity 
  | VehicleEntity 
  | PhoneEntity 
  | LocationEntity 
  | EventEntity 
  | BaseEntity;
