export const USE_AUTO_SEQUENCE_LEN = 0
export const DEFAULT_SEQUENCE_MS = USE_AUTO_SEQUENCE_LEN

export const USE_AUTO_SEEKWINDOW_LEN = 0
export const DEFAULT_SEEKWINDOW_MS = USE_AUTO_SEEKWINDOW_LEN

export const DEFAULT_OVERLAP_MS = 8

export const AUTOSEQ_TEMPO_LOW = 0.5
export const AUTOSEQ_TEMPO_TOP = 2.0

export const AUTOSEQ_AT_MIN = 125.0
export const AUTOSEQ_AT_MAX = 50.0

export const AUTOSEQ_K =
  (AUTOSEQ_AT_MAX - AUTOSEQ_AT_MIN) / (AUTOSEQ_TEMPO_TOP - AUTOSEQ_TEMPO_LOW)
export const AUTOSEQ_C = AUTOSEQ_AT_MIN - AUTOSEQ_K * AUTOSEQ_TEMPO_LOW

export const AUTOSEEK_AT_MIN = 25.0
export const AUTOSEEK_AT_MAX = 15.0

export const AUTOSEEK_K =
  (AUTOSEEK_AT_MAX - AUTOSEEK_AT_MIN) / (AUTOSEQ_TEMPO_TOP - AUTOSEQ_TEMPO_LOW)
export const AUTOSEEK_C = AUTOSEEK_AT_MIN - AUTOSEEK_K * AUTOSEQ_TEMPO_LOW

export const SCAN_OFFSETS = [
  [
    124, 186, 248, 310, 372, 434, 496, 558, 620, 682, 744, 806, 868, 930, 992,
    1054, 1116, 1178, 1240, 1302, 1364, 1426, 1488, 0,
  ],
  [
    -100, -75, -50, -25, 25, 50, 75, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0,
  ],
  [
    -20, -15, -10, -5, 5, 10, 15, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ],
  [-4, -3, -2, -1, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

export const BUFFER_SIZE = 16384