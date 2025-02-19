
export const AVAILABLE_POSITIONS = [
  'Supervisor',
  'Auxiliar Supervisor',
  'Auxiliar Administrativo',
  'Administrador',
  'Porteiro',
  'Auxiliar de Portaria',
  'Auxiliar de Serviços Gerais',
  'Encarregado',
  'Serviços Gerais Líder',
  'Auxiliar de Manutenção',
  'Bombeiro',
  'Vigia',
  'Recepcionista',
  'Jardineiro'
] as const;

export type Position = typeof AVAILABLE_POSITIONS[number];
