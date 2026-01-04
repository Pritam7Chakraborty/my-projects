import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

// A single Sprinkle component
const Sprinkle = ({ position, rotation, color }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
      <meshStandardMaterial color={color} roughness={0.3} />
    </mesh>
  );
};

const DeluxeDonut = () => {
  // Generate random sprinkles positions only ONCE
  const sprinkles = useMemo(() => {
    const items = [];
    const colors = ["#ffffff", "#ffff00", "#00ffff", "#ff0000"]; // White, Yellow, Cyan, Red
    
    for (let i = 0; i < 40; i++) {
      // Math to scatter them on the top surface of the torus
      const angle = (Math.PI * 2 * i) / 40; // Spread around the ring
      const x = Math.cos(angle) * 1.8; // 1.8 is the donut radius
      const y = Math.sin(angle) * 1.8;
      
      // Random offsets to make it look natural
      const offsetX = (Math.random() - 0.5) * 0.5;
      const offsetY = (Math.random() - 0.5) * 0.5;

      items.push({
        position: [x + offsetX, y + offsetY, 0.6], // z=0.6 puts it on top of the icing
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return items;
  }, []);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group rotation={[0.5, 0.5, 0]}>
        
        {/* 1. THE DOUGH (Golden Brown Base) */}
        <mesh position={[0, 0, -0.05]}>
          <torusGeometry args={[1.8, 0.6, 16, 100]} />
          <meshStandardMaterial color="#C19A6B" roughness={0.4} />
        </mesh>

        {/* 2. THE ICING (Glossy Pink Top) */}
        <mesh position={[0, 0, 0.05]}> 
          {/* Slightly thinner tube so dough shows on bottom */}
          <torusGeometry args={[1.8, 0.55, 16, 100]} />
          <meshStandardMaterial color="#FF69B4" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* 3. THE SPRINKLES */}
        {sprinkles.map((s, index) => (
          <Sprinkle key={index} {...s} />
        ))}

      </group>
    </Float>
  );
};

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