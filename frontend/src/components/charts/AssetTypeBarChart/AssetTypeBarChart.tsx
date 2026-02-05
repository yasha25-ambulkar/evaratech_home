import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface AssetTypeData {
    type: string;
    count: number;
}

interface AssetTypeBarChartProps {
    data: AssetTypeData[];
}

function AssetTypeBarChart({ data }: AssetTypeBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0077b6" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default AssetTypeBarChart;
