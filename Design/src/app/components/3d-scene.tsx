import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function QuantumParticles({ count = 500 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = Math.random() * 40 - 20;
      const y = Math.random() * 40 - 20;
      const z = Math.random() * 40 - 20;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle;

      time = particle.time += speed;

      const a = Math.cos(time) + Math.sin(time * 1) / 10;
      const b = Math.sin(time) + Math.cos(time * 2) / 10;

      dummy.position.set(
        x + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
        y + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 10,
        z + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10
      );

      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(a * 2, b * 2, 0);
      dummy.updateMatrix();

      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#8b5cf6" />
    </instancedMesh>
  );
}

function CryptoSphere({ isEncrypting }: { isEncrypting: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color={isEncrypting ? "#8b5cf6" : "#3b82f6"}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function EncryptionRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.y = time * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = time * -0.4;
      ring2Ref.current.rotation.z = time * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.6;
      ring3Ref.current.rotation.z = time * -0.3;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

interface Scene3DProps {
  isEncrypting?: boolean;
}

export function Scene3D({ isEncrypting = false }: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <color attach="background" args={["#0a0a0f"]} />
        <fog attach="fog" args={["#0a0a0f", 5, 25]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#fff" />

        <CryptoSphere isEncrypting={isEncrypting} />
        <EncryptionRings />
        <QuantumParticles count={500} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
