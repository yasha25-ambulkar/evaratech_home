import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface AssetStatusData {
    name: string;
    value: number;
    color: string;
}

interface AssetStatusPieChartProps {
    data: AssetStatusData[];
}

function AssetStatusPieChart({ data }: AssetStatusPieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default AssetStatusPieChart;
