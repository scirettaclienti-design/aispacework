/* eslint-disable react/no-unknown-property */
import { useEffect, useState, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { Canvas } from '@react-three/fiber';
import { BlendFunction } from 'postprocessing';
import { TrackJourney } from './components/TrackJourney';
import { CommandBar } from './components/CommandBar';
import { UIOverlay } from './components/UIOverlay';
import { Preloader } from './components/Preloader';
import { NeuralCursor } from './components/NeuralCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { HyperFocusProvider, useHyperFocus } from './HyperFocusContext';
import * as THREE from 'three';



// Internal component to use the context
function AppContent({ isBooted, setIsBooted }) {
  const { hyperFocus } = useHyperFocus();

  return (
    <>
      {!isBooted && <Preloader onComplete={() => setIsBooted(true)} />}
      
      <div 
        className="fixed inset-0 z-0 bg-black transition-[filter] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ filter: hyperFocus ? 'blur(12px) brightness(0.6)' : 'blur(0px) brightness(1)' }}
      >
        <Canvas camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 200 }}>
          <color attach="background" args={['#000002']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <TrackJourney />
          </Suspense>
        </Canvas>
      </div>

      <NeuralCursor />
      <ScrollProgress />
      <UIOverlay isBooted={isBooted} />
      <CommandBar />
    </>
  );
}

export default function App() {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    // Wait until boot sequence is finished before enabling scrolling
    if (!isBooted) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isBooted]);

  return (
    <HyperFocusProvider>
      <div id="story-container" className="bg-transparent text-white relative font-sans h-[800vh]">
        <AppContent isBooted={isBooted} setIsBooted={setIsBooted} />
      </div>
    </HyperFocusProvider>
  );
}
