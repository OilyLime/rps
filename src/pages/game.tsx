import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type ModelProps = {
  url: string;
};

const Model: React.FC<ModelProps> = ({ url }) => {
  const { scene } = useGLTF(url) as GLTF;
  return <primitive object={scene} dispose={null} />;
};

const Game: React.FC = () => {
  const [choice, setChoice] = useState<string | null>(null);

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          {choice && <Model key={choice} url={`./models/${choice}.glb`} />}
          <Stage environment="city" intensity={0.5} castShadow />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <div style={{ position: 'absolute', bottom: '1rem' }}>
        <button onClick={() => setChoice('rock')}>Rock</button>
        <button onClick={() => setChoice('paper')}>Paper</button>
        <button onClick={() => setChoice('scissors')}>Scissors</button>
      </div>
    </div>
  );
};

export default Game;
