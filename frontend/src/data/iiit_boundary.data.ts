import type { PipelineGeoJSON } from '../types';

export const iiitBoundaryGeoJSON: PipelineGeoJSON = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'IIIT Campus Boundary' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34421576102346, 17.444321738644263],
                    [78.34850594511107, 17.449017317913487],
                    [78.35250292657423, 17.445076263435396],
                    [78.35108118149105, 17.444078190665607],
                    [78.34970589494185, 17.44195895026006],
                    [78.34423577066752, 17.444273406669197],
                    [78.34427833305284, 17.444293709112216],
                    [78.34421576102346, 17.444321738644263] // Closing the loop manually for better visual
                ],
            },
        },
    ],
};
