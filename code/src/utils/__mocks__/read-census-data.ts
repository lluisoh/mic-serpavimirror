import { vi } from "vitest";

export const readCensusData = vi.fn(() => [
  {
    type: "Feature",
    properties: { codsec: "1234" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0],
        ],
      ],
    },
  },
]);
