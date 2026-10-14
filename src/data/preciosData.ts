export type VariedadCafe = 'Brasil' | 'Colombia' | 'Etiopía';
export type TamanioCafe = 'Pocillo' | 'Mediano' | 'Taza grande';
export type NombrePasteleria = 'Muffins de chocolate' | 'Torta selva negra';

export const CONFIG_CAFE = {
  precioBaseExpreso: 2500,
  precioBaseFiltrado: 3200,
  gramosExpreso: {
    'Pocillo': 18,
    'Mediano': 27,
    'Taza grande': 36,
  } as Record<TamanioCafe, number>,
  gramosFiltrado: {
    'Pocillo': 6,
    'Mediano': 15,
    'Taza grande': 25,
  } as Record<TamanioCafe, number>,
  variedades: {
    'Brasil': 140,
    'Colombia': 180,
    'Etiopía': 240,
  } as Record<VariedadCafe, number>,
};

export const PASTELERIA_PRECIOS: Record<NombrePasteleria, number> = {
  'Muffins de chocolate': 2500,
  'Torta selva negra': 4200,
};