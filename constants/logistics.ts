// src/constants/logistics.ts

export const CONTAINER_TYPES = ['40HC', '40HR', '20DV', '45PH'] as const;

export const CUSTOMERS = [
    { id: 'HAP', name: 'HAPAG' },
    { id: 'MSK', name: 'MAERSK' },
    { id: 'COS', name: 'COSCO' },
    { id: 'MSC', name: 'MSC' },
    { id: 'CMA', name: 'CMA' },
    { id: 'SUD', name: 'HAMBURG SUD' }
] as const;

export const DEFAULT_STATUS = 'EXP';

// AGREGA ESTA LÍNEA:
export type CustomerID = typeof CUSTOMERS[number]['id'];