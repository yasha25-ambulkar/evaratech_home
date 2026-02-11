import L from 'leaflet';
import { BaseAsset } from '../models/Asset';
import styles from '../pages/AssetMap/AssetMap.module.css';

/**
 * Strategy Pattern: Handles the polymorphic rendering of map elements based on 
 * the asset type and its encapsulated logic.
 */
export class AssetRenderer {
    /**
     * Polymorphism: Generates a custom divIcon using the asset's own status color 
     * and indicator letter.
     */
    static createIcon(asset: BaseAsset): L.DivIcon {
        const color = asset.getDisplayColor();
        const letter = asset.getIndicatorLetter();
        const isCritical = asset.status === 'Critical';

        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="${styles.glassMarker} ${isCritical ? styles.critical : ''}" style="--marker-color: ${color}">
                    <span>${letter}</span>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}
