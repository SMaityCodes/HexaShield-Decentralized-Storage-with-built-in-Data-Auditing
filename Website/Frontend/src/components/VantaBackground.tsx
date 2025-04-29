import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min';
import NET from 'vanta/dist/vanta.net.min';
import WAVES from 'vanta/dist/vanta.waves.min';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import GLOBE from 'vanta/dist/vanta.globe.min';

type VantaEffect = 'birds' | 'net' | 'waves' | 'clouds' | 'globe';

interface VantaBackgroundProps {
  effect?: VantaEffect;
  children: React.ReactNode;
  lineColor?: string; // Color for lines
  pointColor?: string; // Color for points/intersections
  backgroundColor?: string; // Background color
}

const effectMap = {
  birds: BIRDS,
  net: NET,
  waves: WAVES,
  clouds: CLOUDS,
  globe: GLOBE
};

// Helper to convert hex string to hex number
const hexToNumber = (hex: string): number => {
  // Remove # if present
  const cleanHex = hex.startsWith('#') ? hex.substring(1) : hex;
  return parseInt(cleanHex, 16);
};

const VantaBackground: React.FC<VantaBackgroundProps> = ({ 
  effect = 'net', 
  children,
  lineColor = '#10b981', // Default emerald-500
  pointColor = '#10b981', // Default same as line color
  backgroundColor = '#0f172a', // Default slate-900
}) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const lineColorRef = useRef(lineColor);
  const pointColorRef = useRef(pointColor || lineColor);
  
  // Update refs when props change
  useEffect(() => {
    lineColorRef.current = lineColor;
    pointColorRef.current = pointColor || lineColor;
  }, [lineColor, pointColor]);

  // Custom function to update line colors after effect initialization
  const updateLineColors = (effect: any) => {
    if (!effect || !effect.scene) return;
    
    // For direct THREE.js manipulation
    const lineColorHex = hexToNumber(lineColorRef.current);
    
    // Find and update all line materials in the scene
    effect.scene.traverse((object: any) => {
      // Check if it's a Line object
      if (object instanceof THREE.Line && object.material) {
        // Handle both array of materials and single material
        if (Array.isArray(object.material)) {
          object.material.forEach((mat: any) => {
            if (mat.color) {
              mat.color.setHex(lineColorHex);
              mat.needsUpdate = true;
            }
          });
        } else if (object.material.color) {
          object.material.color.setHex(lineColorHex);
          object.material.needsUpdate = true;
        }
      }
    });
    
    // Force a render update
    if (effect.renderer) {
      effect.renderer.render(effect.scene, effect.camera);
    }
  };

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effectFunction = effectMap[effect];
      
      // Convert hex string colors to numbers
      const lineColorHex = hexToNumber(lineColorRef.current);
      const pointColorHex = hexToNumber(pointColorRef.current);
      const backgroundColorHex = hexToNumber(backgroundColor);
      
      // Base configuration for all effects
      const baseConfig = {
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: backgroundColorHex,
      };
      
      // Effect-specific configurations
      let effectConfig;
      
      switch(effect) {
        case 'net':
          effectConfig = {
            ...baseConfig,
            color: pointColorHex,
            points: 10.00,
            maxDistance: 20.00,
            spacing: 17.00,
            showDots: true,
          };
          break;
        // Other cases remain the same
        case 'birds':
          effectConfig = {
            ...baseConfig,
            color1: lineColorHex,
            color2: 0x000000,
            colorMode: 'variance',
            birdSize: 1.50,
            wingSpan: 30.00,
            quantity: 3.00,
          };
          break;
        case 'waves':
          effectConfig = {
            ...baseConfig,
            color: lineColorHex,
            waveHeight: 20.00,
            shininess: 50.00,
            waveSpeed: 1.00,
            zoom: 0.75,
          };
          break;
        case 'globe':
          effectConfig = {
            ...baseConfig,
            color: lineColorHex,
            size: 1.00,
            points: 8.00,
            maxDistance: 20.00,
          };
          break;
        case 'clouds':
          effectConfig = {
            ...baseConfig,
            skyColor: lineColorHex,
            cloudColor: backgroundColorHex,
            cloudShadowColor: 0x000000,
            speed: 1.00,
          };
          break;
        default:
          effectConfig = {
            ...baseConfig,
            color: lineColorHex,
          };
      }
      
      try {
        const effectInstance = effectFunction(effectConfig);
        
        // Store the original animation function to hook into the render loop
        if (effect === 'net' && lineColor !== pointColor) {
          const originalOnAnimationTick = effectInstance.onAnimationTick;
          
          // Replace animation tick with our own that updates line colors
          effectInstance.onAnimationTick = function() {
            // Call original function first
            if (originalOnAnimationTick) {
              originalOnAnimationTick.call(this);
            }
            
            // Find and modify all line materials
            updateLineColors(effectInstance);
          };
          
          // Initial update
          setTimeout(() => updateLineColors(effectInstance), 100);
        }
        
        setVantaEffect(effectInstance);
      } catch (error) {
        console.error("Error initializing Vanta effect:", error);
        setVantaEffect(null);
      }
    }
    
    // Cleanup
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [effect, backgroundColor]); // Only re-initialize on effect or background change
  
  // Update colors without reinitializing
  useEffect(() => {
    if (vantaEffect && effect === 'net') {
      // Update point colors directly through the effect instance
      if (vantaEffect.uniforms && vantaEffect.uniforms.uColor) {
        vantaEffect.options.color = hexToNumber(pointColorRef.current);
        vantaEffect.uniforms.uColor.value = new THREE.Color(vantaEffect.options.color);
      }
      
      // Update line colors with our custom function
      updateLineColors(vantaEffect);
    }
  }, [lineColor, pointColor]);
  
  return (
    <div className="vanta-container w-full min-h-screen">
      <div 
        ref={vantaRef} 
        className="fixed inset-0 w-full h-full -z-10"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -10 
        }}
      />
      <div className="z-10 relative min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;