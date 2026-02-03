import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FlowRateChartProps {
    data: Array<{
        timestamp: string;
        flowRate: number;
    }>;
}

function FlowRateChart({ data }: FlowRateChartProps) {
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
                    label={{ value: 'Flow Rate (L/min)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                />
                <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value} L/min`, 'Flow Rate']}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="flowRate"
                    stroke="#00b4d8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Flow Rate"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default FlowRateChart;
