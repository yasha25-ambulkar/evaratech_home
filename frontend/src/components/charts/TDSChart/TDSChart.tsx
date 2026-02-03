import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TDSChartProps {
    data: Array<{
        timestamp: string;
        tds: number;
    }>;
}

function TDSChart({ data }: TDSChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis
                    label={{ value: 'TDS (ppm)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                />
                <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value} ppm`, 'TDS']}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="tds"
                    stroke="#0077b6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="TDS Level"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default TDSChart;
