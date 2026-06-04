// frontend/src/data/factoresSimetria.ts

// Factor de corrección por simetría para cables en paralelo (FactorSimetria.png)
export const FACTOR_SIMETRIA_PARALELO = {
  // fs = 1.0 si se cumple la condición de disposición (figura 1.15) para 2 o 4 cables.
  // En cualquier otro caso (3 cables, no cumple disposición, o cables multipolares), fs = 0.8
  cumpleDisposicionFigura1_15: {
    dos_o_cuatro_cables: 1.0,
    tres_cables: 0.8
  },
  no_cumple_disposicion: 0.8,
  cables_multipolares: 0.8
};
