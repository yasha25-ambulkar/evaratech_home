import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface GlassChartTooltipProps extends TooltipProps<ValueType, NameType> {
    showLabel?: boolean;
    unit?: string;
}

export default function GlassChartTooltip({ active, payload, label, showLabel = true, unit = '' }: GlassChartTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid white',
                borderRadius: '16px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                minWidth: '120px'
            }}>
                {showLabel && (
                    <p style={{
                        margin: '0 0 8px 0',
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: 600
                    }}>
                        {label}
                    </p>
                )}
                {payload.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: entry.color,
                            display: 'block'
                        }} />
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#0f172a'
                        }}>
                            {entry.value} {unit}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
}
