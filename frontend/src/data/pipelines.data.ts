import type { PipelineGeoJSON } from '../types';

// Migrated from pipelines.html GeoJSON data
export const pipelineGeoJSON: PipelineGeoJSON = {
    type: 'FeatureCollection',
    features: [
        // PH2 Distribution Lines
        {
            type: 'Feature',
            properties: { name: 'PH2 - OBH/PALASH', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.3492569095647, 17.446057476630784],
                    [78.34825099866276, 17.445482194972044],
                    [78.34720892666434, 17.44630656687505],
                    [78.34598638379146, 17.445050104381707],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH2 - KADAMBA/NBH', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34717428867077, 17.4468858335199],
                    [78.34687317239377, 17.446583646976833],
                    [78.34721168790577, 17.446302774851645],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH2 - HIMALAYA', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34925379742043, 17.44605617669069],
                    [78.34908273787016, 17.445883817839018],
                    [78.34973473021046, 17.44532883606179],
                    [78.3496616935484, 17.44524815714857],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH2 - VINDYA', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.349258777606, 17.446050296030123],
                    [78.34973190965451, 17.44566149363318],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH2 - PARIJAT/NGH', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34924741075247, 17.446051955076115],
                    [78.34798068042636, 17.447117930045437],
                    [78.34812314046127, 17.447270012848705],
                    [78.34779469227817, 17.447551631476756],
                ],
            },
        },
        // PH1 - PH3 Feeder
        {
            type: 'Feature',
            properties: { name: 'PH1 - PH3', type: 'Main Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.35156809621168, 17.445565496370946],
                    [78.3510818505751, 17.445402935739253],
                    [78.34871393327182, 17.44297366973413],
                ],
            },
        },
        // PH3 Distribution
        {
            type: 'Feature',
            properties: { name: 'PH3 - BLOCK B', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.3486649229556, 17.443007256799305],
                    [78.34880425711145, 17.443140183708365],
                    [78.34848826715137, 17.443396542473252],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH3 - BLOCK A', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.3484335287335, 17.44398521679085],
                    [78.34908292542195, 17.44341553199783],
                    [78.34880425711145, 17.443140183708365],
                ],
            },
        },
        // PH1 - PH4 Feeder
        {
            type: 'Feature',
            properties: { name: 'PH1 - PH4', type: 'Main Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.35159848364157, 17.44557532910399],
                    [78.35095289614935, 17.44576982116662],
                    [78.34859125482501, 17.447747056552885],
                    [78.34890811607835, 17.448093307337402],
                ],
            },
        },
        // PH4 Distribution
        {
            type: 'Feature',
            properties: { name: 'PH4 - BAKUL OHT', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34889099161575, 17.4481030150547],
                    [78.34863663284784, 17.44782419439771],
                    [78.34842828429481, 17.448006849815854],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH4 - NWH Block C', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34863200557686, 17.447827892848082],
                    [78.34798863298869, 17.44714473747763],
                    [78.34746274583108, 17.44761440706972],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH4 - NWH Block B', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34798944843249, 17.44714716987866],
                    [78.34775073198728, 17.446898400205413],
                    [78.3472021023727, 17.447350593243257],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'PH4 - NWH Block A', type: 'Dist Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34774710095786, 17.44689799488779],
                    [78.34744051382114, 17.44658242120913],
                    [78.346897993527019, 17.44704423616315],
                ],
            },
        },
        // Bore Pipelines (Red)
        {
            type: 'Feature',
            properties: { id: 'pipe-p5-s1', color: '#d62828', type: 'Bore Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.349013, 17.447797],
                    [78.349042, 17.448091],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { id: 'pipe-p5-s7', color: '#d62828', type: 'Bore Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.349018, 17.44778],
                    [78.349951, 17.446921],
                    [78.34909, 17.445962],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { id: 'pipe-p8-s2', color: '#d62828', type: 'Bore Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.345291, 17.44512],
                    [78.346206, 17.444911],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { id: 'pipe-p9-s3', color: '#d62828', type: 'Bore Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.346714, 17.446868],
                    [78.346915, 17.446715],
                    [78.346984, 17.446784],
                ],
            },
        },
        {
            type: 'Feature',
            properties: { id: 'pipe-p10-s5', color: '#d62828', type: 'Bore Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.350157, 17.443927],
                    [78.349693, 17.444322],
                    [78.350068, 17.444701],
                ],
            },
        },
        // PH1 - PH2 Main Line
        {
            type: 'Feature',
            properties: { name: 'PH1 - PH2', type: 'Main Line' },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [78.34925227266547, 17.44607018219577],
                    [78.34983216194138, 17.446702074561657],
                ],
            },
        },
    ],
};
