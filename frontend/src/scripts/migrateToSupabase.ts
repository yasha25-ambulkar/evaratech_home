import { supabaseService } from '../services/supabase.service';
import { assetDatabase } from '../data/assets.data';
import { pipelineGeoJSON } from '../data/pipelines.data';

// Asset positions mapping (from AssetMap.tsx)
const assetPositions: Record<string, { position: [number, number]; type: string }> = {
    'Pump House 1': { position: [17.4456, 78.3516], type: 'pump' },
    'Pump House 2': { position: [17.44608, 78.34925], type: 'pump' },
    'Pump House 3': { position: [17.4430, 78.3487], type: 'pump' },
    'Pump House 4': { position: [17.4481, 78.3489], type: 'pump' },

    'Sump S1': { position: [17.448097, 78.349060], type: 'sump' },
    'Sump S2': { position: [17.444919, 78.346195], type: 'sump' },
    'Sump S3': { position: [17.446779, 78.346996], type: 'sump' },
    'Sump S4 (Main Sump)': { position: [17.445630, 78.351593], type: 'sump' },
    'Sump S5': { position: [17.444766, 78.350087], type: 'sump' },
    'Sump S6': { position: [17.445498, 78.350202], type: 'sump' },
    'Sump S7': { position: [17.44597, 78.34906], type: 'sump' },
    'Sump S8': { position: [17.446683, 78.348995], type: 'sump' },
    'Sump S9': { position: [17.446613, 78.346487], type: 'sump' },
    'Sump S10': { position: [17.443076, 78.348737], type: 'sump' },
    'Sump S11': { position: [17.444773, 78.347797], type: 'sump' },

    'Bakul OHT': { position: [17.448045, 78.348438], type: 'tank' },
    'Parijat OHT': { position: [17.447547, 78.347752], type: 'tank' },
    'Kadamba OHT': { position: [17.446907, 78.347178], type: 'tank' },
    'NWH Block C OHT': { position: [17.447675, 78.347430], type: 'tank' },
    'NWH Block B OHT': { position: [17.447391, 78.347172], type: 'tank' },
    'NWH Block A OHT': { position: [17.447081, 78.346884], type: 'tank' },
    'Palash Nivas OHT 7': { position: [17.445096, 78.345966], type: 'tank' },
    'Anand Nivas OHT 8': { position: [17.443976, 78.348432], type: 'tank' },
    'Budha Nivas OHT 9': { position: [17.443396, 78.348500], type: 'tank' },
    'C Block OHT 10': { position: [17.443387, 78.347834], type: 'tank' },
    'D Block OHT 11': { position: [17.443914, 78.347773], type: 'tank' },
    'E Block OHT 12': { position: [17.444391, 78.347958], type: 'tank' },
    'Vindhya OHT': { position: [17.44568, 78.34973], type: 'tank' },
    'Himalaya OHT (KRB)': { position: [17.44525, 78.34966], type: 'tank' },

    'Borewell P1': { position: [17.443394, 78.348117], type: 'bore' },
    'Borewell P2': { position: [17.443093, 78.348936], type: 'bore' },
    'Borewell P3': { position: [17.444678, 78.347234], type: 'bore' },
    'Borewell P4': { position: [17.446649, 78.350578], type: 'bore' },
    'Borewell P5': { position: [17.447783, 78.349040], type: 'bore' },
    'Borewell P6': { position: [17.448335, 78.348594], type: 'bore' },
    'Borewell P7': { position: [17.445847, 78.346416], type: 'bore' },
    'Borewell P8': { position: [17.445139, 78.345277], type: 'bore' },
    'Borewell P9': { position: [17.446922, 78.346699], type: 'bore' },
    'Borewell P10': { position: [17.443947, 78.350139], type: 'bore' },
    'Borewell P10A': { position: [17.443451, 78.349635], type: 'bore' },
    'Borewell P11': { position: [17.444431, 78.347649], type: 'bore' },

    'Borewell 1': { position: [17.444601, 78.345459], type: 'govt' },
    'Borewell 2': { position: [17.445490, 78.346838], type: 'govt' },
    'Borewell 3': { position: [17.446188, 78.350067], type: 'govt' },
    'Borewell 4': { position: [17.447111, 78.350151], type: 'govt' },
    'Borewell 5': { position: [17.446311, 78.351042], type: 'govt' },
    'Borewell 6': { position: [17.445584, 78.347148], type: 'govt' },
    'Borewell 7': { position: [17.446115, 78.348536], type: 'govt' },
};

/**
 * Migrate assets to Supabase
 */
export async function migrateAssets() {
    console.log('Starting asset migration...');
    let successCount = 0;
    let errorCount = 0;

    for (const [name, posData] of Object.entries(assetPositions)) {
        const dbEntry = assetDatabase[name];

        const asset = {
            id: dbEntry?.id || `asset_${name.toLowerCase().replace(/\s+/g, '_')}`,
            name,
            type: posData.type,
            latitude: posData.position[0],
            longitude: posData.position[1],
            capacity: dbEntry?.cap || 'N/A',
            specifications: dbEntry?.maint || 'N/A',
            maintenance_info: dbEntry?.maint || 'N/A',
            status: dbEntry?.status || 'Normal',
            is_critical: dbEntry?.status === 'Critical' || dbEntry?.status === 'Warning',
        };

        const result = await supabaseService.upsertAsset(asset);
        if (result) {
            successCount++;
            console.log(`✓ Migrated: ${name}`);
        } else {
            errorCount++;
            console.error(`✗ Failed: ${name}`);
        }
    }

    console.log(`\nAsset Migration Complete:`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
}

/**
 * Migrate pipelines to Supabase
 */
export async function migratePipelines() {
    console.log('\nStarting pipeline migration...');
    let successCount = 0;
    let errorCount = 0;

    for (const feature of pipelineGeoJSON.features) {
        const props = feature.properties;

        const pipeline = {
            id: props.id || `pipeline_${(props.name || 'unknown').toLowerCase().replace(/\s+/g, '_')}`,
            name: props.name || 'Unknown Pipeline',
            type: (props.type === 'Main Line' ? 'main' : props.type === 'Dist Line' ? 'distribution' : 'bore') as string,
            capacity: props.cap || 'N/A',
            maintenance_info: props.maint || 'N/A',
            status: props.status || 'Normal',
            color: props.color || '#00b4d8',
            coordinates: feature.geometry.coordinates,
        };

        const result = await supabaseService.upsertPipeline(pipeline);
        if (result) {
            successCount++;
            console.log(`✓ Migrated: ${props.name || 'Unknown'}`);
        } else {
            errorCount++;
            console.error(`✗ Failed: ${props.name || 'Unknown'}`);
        }
    }

    console.log(`\nPipeline Migration Complete:`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
}

/**
 * Run full migration
 */
export async function runMigration() {
    console.log('='.repeat(50));
    console.log('EvaraTech Data Migration to Supabase');
    console.log('='.repeat(50));

    await migrateAssets();
    await migratePipelines();

    console.log('\n' + '='.repeat(50));
    console.log('Migration Complete!');
    console.log('='.repeat(50));
}

// Uncomment to run migration
// runMigration();
