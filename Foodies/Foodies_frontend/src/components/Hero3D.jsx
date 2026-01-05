import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

// --- 1. GENERATE DATA OUTSIDE THE COMPONENT ---
// This runs only once when the app starts, so it's "Pure" and safe.
const colors = ["#ffffff", "#ffff00", "#00ffff", "#ff0000"]; // White, Yellow, Cyan, Red
const sprinkleData = Array.from({ length: 40 }).map((_, i) => {
  const angle = (Math.PI * 2 * i) / 40; 
  const x = Math.cos(angle) * 1.8;
  const y = Math.sin(angle) * 1.8;
  const offsetX = (Math.random() - 0.5) * 0.5;
  const offsetY = (Math.random() - 0.5) * 0.5;

  return {
    position: [x + offsetX, y + offsetY, 0.6], 
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    color: colors[Math.floor(Math.random() * colors.length)],
  };
});

// --- 2. SPRINKLE COMPONENT ---
const Sprinkle = ({ position, rotation, color }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
      <meshStandardMaterial color={color} roughness={0.3} />
    </mesh>
  );
};

// --- 3. DONUT COMPONENT ---
const DeluxeDonut = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group rotation={[0.5, 0.5, 0]}>
        
        {/* Dough Base */}
        <mesh position={[0, 0, -0.05]}>
          <torusGeometry args={[1.8, 0.6, 16, 100]} />
          <meshStandardMaterial color="#C19A6B" roughness={0.4} />
        </mesh>

        {/* Pink Icing */}
        <mesh position={[0, 0, 0.05]}> 
          <torusGeometry args={[1.8, 0.55, 16, 100]} />
          <meshStandardMaterial color="#FF69B4" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Sprinkles (Using the static data) */}
        {sprinkleData.map((s, index) => (
          <Sprinkle key={index} {...s} />
        ))}

      </group>
    </Float>
  );
};

// --- 4. MAIN SCENE ---
const Hero3D = () => {
  return (
    <div className="h-100 w-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={10} />
        <pointLight position={[-10, -10, -10]} color="white" intensity={5} />
        
        <DeluxeDonut />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
};

export default Hero3D;