import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Box, Sphere, Torus, Cone } from '@react-three/drei';

const SpinningMesh = ({ children, speed = 0.02 }) => {
  const meshRef = useRef(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 1.5;
    }
  });
  return <group ref={meshRef}>{children}</group>;
};

// SEO: Globe / Sphere
const SeoIcon = () => (
  <SpinningMesh speed={0.01}>
    <Sphere args={[1.2, 16, 16]}>
      <meshStandardMaterial color="#f97316" wireframe />
    </Sphere>
  </SpinningMesh>
);

// Growth: Upward Cone + Platform
const GrowthIcon = () => {
  const meshRef = useRef(null);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y -= 0.02;
  });
  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      <Cone args={[0.8, 1.5, 4]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
      </Cone>
      <Box args={[1.5, 0.2, 1.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Box>
    </group>
  );
};

// Data: Animated Bar Chart
const DataIcon = () => {
  const group = useRef(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.children[0].scale.y = Math.max(0.1, Math.sin(clock.elapsedTime * 2) * 1 + 1);
      group.current.children[1].scale.y = Math.max(0.1, Math.sin(clock.elapsedTime * 2 + 1) * 1.5 + 1.5);
      group.current.children[2].scale.y = Math.max(0.1, Math.sin(clock.elapsedTime * 2 + 2) * 2 + 2);
    }
  });
  return (
    <group ref={group} position={[-0.8, -1, 0]}>
      <Box args={[0.4, 1, 0.4]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#f97316" />
      </Box>
      <Box args={[0.4, 1, 0.4]} position={[0.8, 0.5, 0]}>
        <meshStandardMaterial color="#f97316" />
      </Box>
      <Box args={[0.4, 1, 0.4]} position={[1.6, 0.5, 0]}>
        <meshStandardMaterial color="#f97316" />
      </Box>
    </group>
  );
};

// React: Atom-like intersecting rings
const ReactIcon = () => (
  <SpinningMesh speed={0.02}>
    <Torus args={[1, 0.1, 16, 100]}>
      <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
    </Torus>
    <Torus args={[1, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
    </Torus>
    <Sphere args={[0.3]}>
      <meshStandardMaterial color="#f97316" />
    </Sphere>
  </SpinningMesh>
);

// 3D: Rotatin cube with wireframe inner
const ThreeDIcon = () => (
  <SpinningMesh speed={0.015}>
    <Box args={[1.2, 1.2, 1.2]}>
      <meshStandardMaterial color="#8b5cf6" transparent opacity={0.5} />
    </Box>
    <Box args={[0.8, 0.8, 0.8]}>
      <meshStandardMaterial color="#ffffff" wireframe />
    </Box>
  </SpinningMesh>
);

// Perf: Spinning Ring
const PerfIcon = () => {
  const ringRef = useRef(null);
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.1;
      ringRef.current.rotation.x = Math.PI / 3;
    }
  });
  return (
    <group>
      <Torus ref={ringRef} args={[1.2, 0.2, 16, 32]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Torus>
      <Sphere args={[0.5]}>
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1} />
      </Sphere>
    </group>
  );
};

const ThreeIcon = ({ type }) => {
  const getIcon = () => {
    switch (type) {
      case 'seo': return <SeoIcon />;
      case 'growth': return <GrowthIcon />;
      case 'data': return <DataIcon />;
      case 'react': return <ReactIcon />;
      case '3d': return <ThreeDIcon />;
      case 'perf': return <PerfIcon />;
      default: return <Box />;
    }
  };

  return (
    <div className="w-20 h-20 -ml-4 -mt-4 shrink-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        {getIcon()}
      </Canvas>
    </div>
  );
};

export default ThreeIcon;
