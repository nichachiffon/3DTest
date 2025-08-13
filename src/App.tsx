import { useState, useEffect, useRef, Suspense, type TouchEvent as ReactTouchEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { AlertTriangle, Activity, Thermometer, Settings, Download, RotateCcw, Play, Pause, Wifi, WifiOff } from 'lucide-react';
import * as THREE from 'three';
import './App.css';

interface Machine {
  id: string;
  name: string;
  temp: number;
  status: 'OK' | 'WARN' | 'ALARM';
  type: 'injection' | 'cnc' | 'assembly';
  lastUpdate: Date;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface MachineData {
  id: string;
  temp?: number;
  status?: 'OK' | 'WARN' | 'ALARM';
  machines?: Machine[];
}

// 3D Machine Component
const Machine3D = ({ machine, isSelected, onClick, isMobile = false }: { machine: Machine; isSelected: boolean; onClick: () => void; isMobile?: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);

  const getMachineColor = () => {
    switch (machine.status) {
      case 'OK': return '#10b981';
      case 'WARN': return '#f59e0b';
      case 'ALARM': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getMachineEmissive = () => {
    switch (machine.status) {
      case 'OK': return '#10b981';
      case 'WARN': return '#f59e0b';
      case 'ALARM': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getMachineGlowIntensity = () => {
    switch (machine.status) {
      case 'OK': return 0.3;
      case 'WARN': return 0.6;
      case 'ALARM': return 1.0;
      default: return 0.3;
    }
  };

  const isLightGrayMachine = machine.id === 'M-A';

  // Injection Molding Machine - ปรับปรุงให้สวยงามและมีสีสันมากขึ้น
  const InjectionMachine = () => (
    <group>
      {/* Main Machine Body - เพิ่มสีสันและเอฟเฟกต์ */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 2.4, 4.8]} />
        <meshStandardMaterial 
          color={isLightGrayMachine ? '#e5e7eb' : '#1f2937'}
          metalness={0.8} 
          roughness={0.2}
          emissive={isLightGrayMachine ? '#000000' : '#111827'}
          emissiveIntensity={isLightGrayMachine ? 0 : 0.05}
        />
      </mesh>
      
      {/* Decorative Stripes */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[4.3, 0.12, 4.9]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6" 
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.3} 
        />
      </mesh>
      
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[4.3, 0.12, 4.9]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6" 
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.3} 
        />
      </mesh>
      
      {/* Injection Unit - ปรับปรุงสีและเอฟเฟกต์ */}
      <mesh position={[0, 1.2, -2.4]}>
        <cylinderGeometry args={[0.36, 0.36, 1.8, 16]} />
        <meshStandardMaterial 
          color="#6b7280" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#111827"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Mold Clamp - เพิ่มสีสัน */}
      <mesh position={[0, 0, 2.4]}>
        <boxGeometry args={[3.6, 2.2, 0.6]} />
        <meshStandardMaterial 
          color={isLightGrayMachine ? '#cbd5e1' : '#111827'}
          metalness={0.7} 
          roughness={0.3}
          emissive="#000000"
          emissiveIntensity={0}
        />
      </mesh>
      
      {/* Control Panel - ปรับปรุงให้สวยงาม */}
      <mesh position={[1.6, 0.4, 0]}>
        <boxGeometry args={[0.24, 1.0, 1.8]} />
        <meshStandardMaterial 
          color={isLightGrayMachine ? '#d1d5db' : '#111827'}
          metalness={0.6} 
          roughness={0.4}
          emissive="#000000"
          emissiveIntensity={0}
        />
      </mesh>
      
      {/* Display Screen - เพิ่มเอฟเฟกต์แสง */}
      <mesh position={[1.6, 0.4, 0]}>
        <boxGeometry args={[0.06, 0.6, 1.4]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#1e40af" 
          emissiveIntensity={machine.status === 'ALARM' ? 1.2 : 0.8}
        />
      </mesh>
      
      {/* Temperature Sensors - เพิ่มสีสันตามสถานะ */}
      <mesh position={[0, 0.8, 1.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Hydraulic Pipes - เพิ่มสีสัน */}
      <mesh position={[0.75, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.0, 16]} />
        <meshStandardMaterial 
          color="#dc2626" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#dc2626"
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Cooling System - ปรับปรุงสี */}
      <mesh position={[-1.0, 0, 0]}>
        <boxGeometry args={[0.5, 1.5, 3.0]} />
        <meshStandardMaterial 
          color="#1d4ed8" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#3b82f6"
          emissiveIntensity={machine.status === 'ALARM' ? 0.6 : 0.2}
        />
      </mesh>
      
      {/* Ventilation Grills - เพิ่มสีสัน */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[-1.2, -0.5 + i * 0.45, 0]}>
          <boxGeometry args={[0.1, 0.1, 2.2]} />
          <meshStandardMaterial 
            color="#475569" 
            metalness={0.6} 
            roughness={0.4}
            emissive="#64748b"
            emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
          />
        </mesh>
      ))}
      
      {/* Status LED Ring */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={getMachineGlowIntensity()}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );

  // CNC Machine - ปรับปรุงให้สวยงามและมีสีสันมากขึ้น
  const CNCMachine = () => (
    <group>
      {/* Machine Base - เพิ่มสีสันและเอฟเฟกต์ */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.8, 0.5, 4.8]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#334155"
          emissiveIntensity={machine.status === 'ALARM' ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Decorative Stripes */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[4.9, 0.06, 4.9]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          emissive="#06b6d4" 
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.4} 
        />
      </mesh>
      
      {/* X-Axis Rails - ปรับปรุงสี */}
      <mesh position={[0, 0.25, -2.2]}>
        <boxGeometry args={[4.4, 0.24, 0.36]} />
        <meshStandardMaterial 
          color="#475569" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#64748b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.6 : 0.2}
        />
      </mesh>
      
      <mesh position={[0, 0.25, 2.2]}>
        <boxGeometry args={[4.4, 0.24, 0.36]} />
        <meshStandardMaterial 
          color="#475569" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#64748b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.6 : 0.2}
        />
      </mesh>
      
      {/* Y-Axis Carriage - เพิ่มสีสัน */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.0, 0.36, 3.8]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* Z-Axis Spindle - ปรับปรุงสี */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 1.8, 16]} />
        <meshStandardMaterial 
          color="#475569" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#64748b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Spindle Motor - เพิ่มสีสัน */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.48, 16]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.6 : 0.2}
        />
      </mesh>
      
      {/* Cutting Tool - เพิ่มเอฟเฟกต์แสง */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.24, 12]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          metalness={1} 
          roughness={0}
          emissive="#fbbf24"
          emissiveIntensity={machine.status === 'ALARM' ? 1.0 : 0.5}
        />
      </mesh>
      
      {/* Work Table - ปรับปรุงสี */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[4.2, 0.12, 4.2]} />
        <meshStandardMaterial 
          color="#64748b" 
          metalness={0.6} 
          roughness={0.4}
          emissive="#94a3b8"
          emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* T-Slots - เพิ่มสีสัน */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[-1.0 + i * 1.0, 0.06, 0]}>
          <boxGeometry args={[0.1, 0.04, 2.4]} />
          <meshStandardMaterial 
            color="#0f172a" 
            metalness={0.5} 
            roughness={0.5}
            emissive="#1e293b"
            emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
          />
        </mesh>
      ))}
      
      {/* Control Panel - ปรับปรุงให้สวยงาม */}
      <mesh position={[2.0, 0.4, 0]}>
        <boxGeometry args={[0.36, 0.84, 1.8]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.6} 
          roughness={0.4}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* Display - เพิ่มเอฟเฟกต์แสง */}
      <mesh position={[2.0, 0.4, 0]}>
        <boxGeometry args={[0.06, 0.6, 1.4]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#0891b2" 
          emissiveIntensity={machine.status === 'ALARM' ? 1.2 : 0.8}
        />
      </mesh>
      
      {/* Emergency Stop Button - เพิ่มสีสัน */}
      <mesh position={[2.0, 0.12, 0.7]}>
        <cylinderGeometry args={[0.096, 0.096, 0.096, 16]} />
        <meshStandardMaterial 
          color="#dc2626" 
          emissive="#dc2626" 
          emissiveIntensity={machine.status === 'ALARM' ? 1.0 : 0.6}
        />
      </mesh>
      
      {/* Status LEDs - เพิ่มสีสันตามสถานะ */}
      <mesh position={[0, 2.6, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={getMachineGlowIntensity()}
        />
      </mesh>
      
      {/* LED Ring */}
      <mesh position={[0, 2.6, 0]}>
        <ringGeometry args={[0.08, 0.12, 16]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={getMachineGlowIntensity()}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );

  // Assembly Line Machine - ปรับปรุงให้สวยงามและมีสีสันมากขึ้น
  const AssemblyMachine = () => (
    <group>
      {/* Main Conveyor Belt - เพิ่มสีสันและเอฟเฟกต์ */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.36, 4.8]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#334155"
          emissiveIntensity={machine.status === 'ALARM' ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Decorative Stripes */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[4.3, 0.024, 4.9]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.4} 
        />
      </mesh>
      
      {/* Conveyor Rollers - ปรับปรุงสี */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[-1.7 + i * 0.42, 0.18, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 4.6, 16]} />
          <meshStandardMaterial 
            color="#64748b" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#94a3b8"
            emissiveIntensity={machine.status === 'ALARM' ? 0.6 : 0.2}
          />
        </mesh>
      ))}
      
      {/* Assembly Station 1 - Welding - เพิ่มสีสัน */}
      <mesh position={[-0.72, 0.48, 0]}>
        <boxGeometry args={[0.96, 0.96, 0.96]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.6} 
          roughness={0.4}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* Welding Arm - ปรับปรุงสี */}
      <mesh position={[-0.48, 0.96, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.72, 12]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.6 : 0.2}
        />
      </mesh>
      
      {/* Welding Tip - เพิ่มเอฟเฟกต์แสง */}
      <mesh position={[-0.48, 1.44, 0]}>
        <coneGeometry args={[0.018, 0.096, 12]} />
        <meshStandardMaterial 
          color="#f97316" 
          emissive="#f97316" 
          emissiveIntensity={machine.status === 'ALARM' ? 1.2 : 0.8}
        />
      </mesh>
      
      {/* Assembly Station 2 - Screwing - เพิ่มสีสัน */}
      <mesh position={[0.72, 0.48, 0]}>
        <boxGeometry args={[0.96, 0.96, 0.96]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.6} 
          roughness={0.4}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* Screw Driver - ปรับปรุงสี */}
      <mesh position={[0.48, 0.96, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.6 : 0.2}
        />
      </mesh>
      
      {/* Screw Bit - เพิ่มเอฟเฟกต์แสง */}
      <mesh position={[0.48, 1.32, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          metalness={1} 
          roughness={0}
          emissive="#fbbf24"
          emissiveIntensity={machine.status === 'ALARM' ? 1.0 : 0.6}
        />
      </mesh>
      
      {/* Assembly Station 3 - Quality Check - เพิ่มสีสัน */}
      <mesh position={[0, 0.48, 1.8]}>
        <boxGeometry args={[0.96, 0.96, 0.96]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.6} 
          roughness={0.4}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* Camera Sensor - ปรับปรุงสี */}
      <mesh position={[0, 0.96, 1.44]}>
        <cylinderGeometry args={[0.096, 0.096, 0.18, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#1e293b" 
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Lens - เพิ่มเอฟเฟกต์แสง */}
      <mesh position={[0, 1.08, 1.44]}>
        <sphereGeometry args={[0.048, 20, 20]} />
        <meshStandardMaterial 
          color="#1d4ed8" 
          emissive="#1d4ed8" 
          emissiveIntensity={machine.status === 'ALARM' ? 1.0 : 0.6}
        />
      </mesh>
      
      {/* Control Panel - ปรับปรุงให้สวยงาม */}
      <mesh position={[1.44, 0.36, 0]}>
        <boxGeometry args={[0.24, 0.84, 1.8]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.6} 
          roughness={0.4}
          emissive="#1e293b"
          emissiveIntensity={machine.status === 'ALARM' ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* Display Screen - เพิ่มเอฟเฟกต์แสง */}
      <mesh position={[1.44, 0.36, 0]}>
        <boxGeometry args={[0.06, 0.6, 1.4]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#059669" 
          emissiveIntensity={machine.status === 'ALARM' ? 1.2 : 0.8}
        />
      </mesh>
      
      {/* Status Indicators - เพิ่มสีสันตามสถานะ */}
      <mesh position={[0, 1.92, 0]}>
        <sphereGeometry args={[0.072, 20, 20]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={getMachineGlowIntensity()}
        />
      </mesh>
      
      {/* LED Ring */}
      <mesh position={[0, 1.92, 0]}>
        <ringGeometry args={[0.12, 0.2, 20]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={getMachineGlowIntensity()}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Safety Guards - เพิ่มสีสัน */}
      <mesh position={[0, 0.6, -1.44]}>
        <boxGeometry args={[2.4, 0.096, 0.096]} />
        <meshStandardMaterial 
          color="#dc2626" 
          metalness={0.5} 
          roughness={0.5}
          emissive="#dc2626"
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.3}
        />
      </mesh>
      
      <mesh position={[0, 0.6, 1.44]}>
        <boxGeometry args={[2.4, 0.096, 0.096]} />
        <meshStandardMaterial 
          color="#dc2626" 
          metalness={0.5} 
          roughness={0.5}
          emissive="#dc2626"
          emissiveIntensity={machine.status === 'ALARM' ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  );

  const renderMachine = () => {
    switch (machine.type) {
      case 'injection':
        return <InjectionMachine />;
      case 'cnc':
        return <CNCMachine />;
      case 'assembly':
        return <AssemblyMachine />;
      default:
        return <InjectionMachine />;
    }
  };

  return (
    <group 
      ref={meshRef}
      position={machine.position} 
      rotation={machine.rotation} 
      scale={machine.scale}
      onClick={onClick}
    >
      {renderMachine()}

      {/* Enhanced Status Indicator */}
        <mesh position={[isMobile ? -2.6 : 0, isMobile ? 2.4 : 3.2, isMobile ? 0.2 : 0]}>
          <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={getMachineGlowIntensity()} 
        />
      </mesh>

      {/* Status Ring */}
        <mesh position={[isMobile ? -2.6 : 0, isMobile ? 2.4 : 3.2, isMobile ? 0.2 : 0]}>
          <ringGeometry args={[isMobile ? 0.22 : 0.24, isMobile ? 0.34 : 0.36, 20]} />
        <meshStandardMaterial 
          color={getMachineColor()} 
          emissive={getMachineEmissive()} 
          emissiveIntensity={getMachineGlowIntensity()}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Enhanced Text Display */}
      <Html position={[isMobile ? 2.6 : 0, isMobile ? 4.4 : 4.2, isMobile ? 0.4 : 1.6]} center>
        <div className="enhanced-text" style={{ transform: `scale(${isMobile ? 0.95 : 1.15})` }}>
          <div className="machine-name-enhanced">{machine.name}</div>
          <div className="temp-enhanced">{machine.temp.toFixed(1)}°C</div>
          <div className={`status-enhanced ${machine.status.toLowerCase()}`}>
            {machine.status}
          </div>
        </div>
      </Html>

      {/* Enhanced Selection Highlight */}
      {isSelected && (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.2, 2.5, 4.2]} />
            <meshBasicMaterial
              color={getMachineColor()}
              transparent
              opacity={0.15}
              wireframe
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[2.5, 2.7, 32]} />
            <meshBasicMaterial
              color={getMachineColor()}
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        </group>
      )}

    </group>
  );
};

// Central Control Hub (removed from scene for performance)
// const ControlHub = () => null;

// Data Streams (removed from scene for performance)
// const DataStreams = () => null;

// Responsive helper
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
};

// 3D Scene Component
const Scene3D = ({ machines, selectedMachine, onMachineSelect, visibleIndex }: {
  machines: Machine[];
  selectedMachine: string | null;
  onMachineSelect: (id: string) => void;
  visibleIndex?: number;
}) => {
  const isMobile = useIsMobile();
  const cameraSettings = isMobile
    ? { position: [0, 10, 20] as [number, number, number], fov: 50 }
    : { position: [0, 8, 14] as [number, number, number], fov: 40 };
  const canvasHeight = isMobile ? '78vh' : '90vh';
  const dprRange = isMobile ? ([1, 1.05] as [number, number]) : ([1, 1.25] as [number, number]);
  const safeIndex = Math.min(Math.max((visibleIndex ?? 0), 0), Math.max(machines.length - 1, 0));
  const mobileMachines = [machines[safeIndex]].filter(Boolean) as Machine[];
  return (
    <Canvas
      camera={cameraSettings}
      dpr={dprRange}
      frameloop="demand"
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{ height: canvasHeight, background: '#1f2937' }}
    >
      <Suspense fallback={null}>
        {/* Simplified Lighting for performance */}
        <ambientLight intensity={isMobile ? 1.2 : 0.7} />
        <directionalLight position={[10, 12, 8]} intensity={isMobile ? 1.0 : 0.8} color="#ffffff" />
        
        {/* Ground Plane (neutral gray, matte) */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial 
            color="#4b5563" 
            metalness={0.05} 
            roughness={0.95}
            emissive="#000000"
            emissiveIntensity={0}
          />
        </mesh>

        {/* Minimal scene: no extra effects */}

        {/* Machines */}
        {(isMobile ? mobileMachines : machines).map((machine) => (
          <Machine3D
            key={machine.id}
            machine={{
              ...machine,
              position: isMobile ? [0, 0.5, 0] : machine.position,
              scale: isMobile ? [1.35, 1.35, 1.35] : machine.scale,
            }}
            isSelected={selectedMachine === machine.id}
            onClick={() => onMachineSelect(machine.id)}
            isMobile={isMobile}
          />
        ))}

        {/* Fixed Camera - No Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
        />
      </Suspense>
    </Canvas>
  );
};

const FactoryDashboard = () => {
  const [machines, setMachines] = useState<Machine[]>([
    { 
      id: 'M-A', 
      name: 'Injection Molder A', 
      temp: 65, 
      status: 'OK', 
      type: 'injection', 
      lastUpdate: new Date(),
      position: [7, 0, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1.1, 1.1]
    },
    { 
      id: 'M-B', 
      name: 'CNC Machine B', 
      temp: 72, 
      status: 'OK', 
      type: 'cnc', 
      lastUpdate: new Date(),
      position: [-7, 0, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1.1, 1.1]
    },
    { 
      id: 'M-C', 
      name: 'Assembly Line C', 
      temp: 58, 
      status: 'OK', 
      type: 'assembly', 
      lastUpdate: new Date(),
      position: [0, 0.3, 3],
      rotation: [0, 0, 0],
      scale: [1.1, 1.1, 1.1]
    }
  ]);
  const isMobile = useIsMobile();
  const [visibleIndex, setVisibleIndex] = useState(2);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);

  useEffect(() => {
    if (!isMobile) return;
    if (visibleIndex < 0 || visibleIndex >= machines.length) {
      setVisibleIndex((prev) => Math.min(Math.max(prev, 0), machines.length - 1));
    }
  }, [isMobile, visibleIndex, machines.length]);

  const goPrev = () => setVisibleIndex((i) => (i - 1 + machines.length) % machines.length);
  const goNext = () => setVisibleIndex((i) => (i + 1) % machines.length);

  const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };
  const onTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current == null) return;
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };
  const onTouchEnd = () => {
    const delta = touchDeltaXRef.current;
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
    const threshold = 40;
    if (Math.abs(delta) < threshold) return;
    if (delta < 0) goNext(); else goPrev();
  };
  
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [uptime, setUptime] = useState(0);
  const [nodeRedUrl, setNodeRedUrl] = useState('ws://localhost:1880/ws/factory');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  // สถิติระบบ
  const stats = {
    total: machines.length,
    online: machines.filter(m => m.status === 'OK').length,
    warning: machines.filter(m => m.status === 'WARN').length,
    alarm: machines.filter(m => m.status === 'ALARM').length,
    avgTemp: machines.reduce((sum, m) => sum + m.temp, 0) / machines.length
  };

  // การเชื่อมต่อ WebSocket กับ Node-RED
  const connectToNodeRed = () => {
    try {
      websocketRef.current = new WebSocket(nodeRedUrl);
      
      websocketRef.current.onopen = () => {
        console.log('Connected to Node-RED');
        setIsConnected(true);
        setIsSimulating(false);
      };
      
      websocketRef.current.onmessage = (event: MessageEvent) => {
        try {
          const data: MachineData = JSON.parse(event.data);
          if (data.machines) {
            setMachines(prevMachines => 
              prevMachines.map(machine => {
                const newData = data.machines!.find(m => m.id === machine.id);
                return newData ? { ...machine, ...newData, lastUpdate: new Date() } : machine;
              })
            );
          } else if (data.id) {
            setMachines(prevMachines =>
              prevMachines.map(machine =>
                machine.id === data.id 
                  ? { ...machine, ...data, lastUpdate: new Date() }
                  : machine
              )
            );
          }
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };
      
      websocketRef.current.onclose = () => {
        console.log('Disconnected from Node-RED');
        setIsConnected(false);
        if (!isSimulating) {
          setIsSimulating(true);
        }
      };
      
      websocketRef.current.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect to Node-RED:', error);
    }
  };

  const disconnectFromNodeRed = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    setIsConnected(false);
  };

  const simulateData = () => {
    setMachines(prevMachines =>
      prevMachines.map(machine => {
        const baseTemp = { injection: 65, cnc: 70, assembly: 60 }[machine.type] || 65;
        const variation = (Math.random() - 0.5) * 30;
        const newTemp = Math.max(40, Math.min(120, baseTemp + variation));
        
        let status: 'OK' | 'WARN' | 'ALARM' = 'OK';
        if (newTemp > 95) status = 'ALARM';
        else if (newTemp > 80) status = 'WARN';
        
        if (Math.random() < 0.05) {
          status = 'ALARM';
        }
        
        return {
          ...machine,
          temp: newTemp,
          status,
          lastUpdate: new Date()
        };
      })
    );
  };

  const sendCommand = (command: string, machineId: string | null = null) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        command,
        machineId,
        timestamp: new Date().toISOString()
      };
      websocketRef.current.send(JSON.stringify(payload));
    }
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      machines,
      stats,
      uptime: formatUptime(uptime)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory_data_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(uptimeInterval);
  }, []);

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = window.setInterval(simulateData, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating]);

  useEffect(() => {
    return () => {
      disconnectFromNodeRed();
    };
  }, []);

  const MachineCard = ({ machine }: { machine: Machine }) => {
    const getMachineIcon = (type: string) => {
      switch (type) {
        case 'injection': return '🏭';
        case 'cnc': return '⚙️';
        case 'assembly': return '🔧';
        default: return '🏭';
      }
    };

    const performance = Math.max(0, Math.min(100, 100 - ((machine.temp - 40) / 80) * 100));
    const performanceClass = performance > 80 ? 'high' : performance > 50 ? 'medium' : 'low';

    return (
      <div className={`machine-card ${machine.status.toLowerCase()} ${selectedMachine === machine.id ? 'selected' : ''}`}
           onClick={() => setSelectedMachine(machine.id)}>
        <div className="machine-header">
          <div className="machine-info">
            <span className="machine-icon">{getMachineIcon(machine.type)}</span>
            <div>
              <h3 className="machine-name">{machine.name}</h3>
              <p className="machine-id">{machine.id}</p>
            </div>
          </div>
          <div className={`status-badge ${machine.status.toLowerCase()}`}>
            {machine.status}
          </div>
        </div>
        
        <div className="machine-details">
          <div className="temp-row">
            <div className="temp-label">
              <Thermometer style={{ width: '1rem', height: '1rem', color: '#60a5fa' }} />
              <span>Temperature</span>
            </div>
            <span className="temp-value">
              {machine.temp.toFixed(1)}°C
            </span>
          </div>
          
          <div>
            <div className="temp-row">
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Performance</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>{performance.toFixed(0)}%</span>
            </div>
                          <div className="performance-bar">
                <div 
                  className={`performance-fill ${performanceClass}`}
                  style={{ width: `${performance}%` }}
                ></div>
              </div>
            </div>
            
            <div className="temp-row">
              <span className={`status-badge ${machine.status.toLowerCase()}`}>
                {machine.status}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {machine.lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              3D FACTORY DASHBOARD
            </h1>
            <p className="dashboard-subtitle">Neural Network Powered Industrial Control System</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
              {isConnected ? <Wifi style={{ width: '1rem', height: '1rem' }} /> : <WifiOff style={{ width: '1rem', height: '1rem' }} />}
              <span>
                {isConnected ? 'Node-RED Connected' : 'Simulation Mode'}
              </span>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="settings-button"
            >
              <Settings style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <h3 className="settings-title">Connection Settings</h3>
            <div className="settings-form">
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Node-RED WebSocket URL
                </label>
                <input
                  type="text"
                  value={nodeRedUrl}
                  onChange={(e) => setNodeRedUrl(e.target.value)}
                  className="settings-input"
                  placeholder="ws://localhost:1880/ws/factory"
                />
              </div>
              <div className="settings-buttons">
                {!isConnected ? (
                  <button
                    onClick={connectToNodeRed}
                    className="btn btn-primary"
                  >
                    Connect
                  </button>
                ) : (
                  <button
                    onClick={disconnectFromNodeRed}
                    className="btn btn-danger"
                  >
                    Disconnect
                  </button>
                )}
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {isSimulating ? <Pause style={{ width: '1rem', height: '1rem' }} /> : <Play style={{ width: '1rem', height: '1rem' }} />}
                  <span>{isSimulating ? 'Stop Simulation' : 'Start Simulation'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3D Scene */}
        <div 
          className="scene-container"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Scene3D 
            machines={machines}
            selectedMachine={selectedMachine}
            onMachineSelect={setSelectedMachine}
            visibleIndex={isMobile ? visibleIndex : undefined}
          />
          {isMobile && (
            <>
              <button className="carousel-arrow left" onClick={goPrev} aria-label="Previous">
                ‹
              </button>
              <button className="carousel-arrow right" onClick={goNext} aria-label="Next">
                ›
              </button>
              <div className="carousel-dots">
                {machines.map((_, i) => (
                  <span key={i} className={`dot ${i === visibleIndex ? 'active' : ''}`}></span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#60a5fa' }}>{stats.total}</div>
            <div className="stat-label">Total Machines</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#4ade80' }}>{stats.online}</div>
            <div className="stat-label">Online</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#facc15' }}>{stats.warning}</div>
            <div className="stat-label">Warnings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f87171' }}>{stats.alarm}</div>
            <div className="stat-label">Alarms</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#67e8f9' }}>{stats.avgTemp.toFixed(1)}°C</div>
            <div className="stat-label">Avg Temp</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#c084fc' }}>{formatUptime(uptime)}</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>

        {/* Machine Cards */}
        <div className="machines-grid">
          {machines.map(machine => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <h3 className="control-title">Control Panel</h3>
          <div className="control-buttons">
            <button
              onClick={() => sendCommand('reset_all')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw style={{ width: '1rem', height: '1rem' }} />
              <span>Reset All</span>
            </button>
            <button
              onClick={() => sendCommand('emergency_stop')}
              className="btn btn-danger"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <AlertTriangle style={{ width: '1rem', height: '1rem' }} />
              <span>Emergency Stop</span>
            </button>
            <button
              onClick={exportData}
              className="btn btn-success"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download style={{ width: '1rem', height: '1rem' }} />
              <span>Export Data</span>
            </button>
            <button
              onClick={simulateData}
              className="btn btn-purple"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Activity style={{ width: '1rem', height: '1rem' }} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  function App() {
    return (
      <div className="App">
        <FactoryDashboard />
      </div>
    );
  }

  export default App;