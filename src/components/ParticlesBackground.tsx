// src/components/FoodParticlesBackground.tsx
import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const FoodParticlesBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles-food"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        particles: {
          number: {
            value: 20,
            density: {
              enable: true,
              area: 800,
            },
          },
          shape: {
            type: 'image',
            image: [
              {
                src: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
                width: 32,
                height: 32,
              },
              {
                src: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png',
                width: 32,
                height: 32,
              },
              
              
            ],
          },
          opacity: {
            value: 0.9,
          },
          size: {
            value: 24,
            random: {
              enable: true,
              minimumValue: 16,
            },
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            outModes: {
              default: 'out',
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
      }}
      style={{
        position: 'absolute',
        zIndex: 0,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default FoodParticlesBackground;
