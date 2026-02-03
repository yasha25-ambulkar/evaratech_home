import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import WaterFlowVisualization from './WaterFlowVisualization';

interface WaterFlowCanvasProps {
    flowRate: number;
    pipelineId: string;
}

function WaterFlowCanvas({ flowRate, pipelineId }: WaterFlowCanvasProps) {
    return (
        <div style={{ width: '100%', height: '400px', background: '#0a1929', borderRadius: '10px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <WaterFlowVisualization flowRate={flowRate} pipelineId={pipelineId} />
                <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
            </Canvas>
        </div>
    );
}

export default WaterFlowCanvas;
