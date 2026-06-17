"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();

    const getSize = () => ({
      width: Math.max(1, mount.clientWidth || window.innerWidth),
      height: Math.max(1, mount.clientHeight || window.innerHeight),
    });

    const { width, height } = getSize();

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearAlpha(0);

    mount.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const root = new THREE.Group();
    scene.add(root);

    function createGlowTexture(): THREE.CanvasTexture {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;

      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.28, "rgba(255,255,255,0.75)");
      gradient.addColorStop(0.62, "rgba(255,255,255,0.18)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    const glowTexture = createGlowTexture();

    // Iets voller deeltjesveld, want het is nu het enige element.
    const particleCount = prefersReducedMotion ? 400 : isMobile ? 1000 : 2200;

    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    const palette = [
      new THREE.Color("#22d3ee"),
      new THREE.Color("#8b5cf6"),
      new THREE.Color("#10b981"),
      new THREE.Color("#f0c86a"),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const radius = 6 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.75;
      particlePositions[i3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;

      particleSizes[i] = Math.random() * 0.55 + 0.18;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );
    particleGeometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(particleSizes, 1)
    );

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: {
          value: Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2),
        },
        uTexture: { value: glowTexture },
      },
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          vec3 pos = position;
          pos.x += sin(uTime * 0.45 + position.y * 0.12) * 0.45;
          pos.y += cos(uTime * 0.35 + position.x * 0.12) * 0.35;
          pos.z += sin(uTime * 0.3 + position.x * 0.08) * 0.35;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * uPixelRatio * (220.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;

        void main() {
          float alpha = texture2D(uTexture, gl_PointCoord).a;
          gl_FragColor = vec4(vColor, alpha * 0.85);
        }
      `,
      vertexColors: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    root.add(particles);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handlePointerMove = (event: PointerEvent) => {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      const nextSize = getSize();

      camera.aspect = nextSize.width / nextSize.height;
      camera.updateProjectionMatrix();

      renderer.setSize(nextSize.width, nextSize.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));

      particleMaterial.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        isMobile ? 1.4 : 2
      );
    });

    resizeObserver.observe(mount);

    let rafId = 0;

    const renderScene = () => {
      const elapsed = clock.getElapsedTime();

      particleMaterial.uniforms.uTime.value = elapsed;

      mouse.lerp(targetMouse, 0.045);

      root.rotation.y = elapsed * 0.035 + mouse.x * 0.12;
      root.rotation.x = mouse.y * 0.045;

      particles.rotation.y = elapsed * 0.018;
      particles.rotation.x = Math.sin(elapsed * 0.18) * 0.035;

      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.025;
      camera.position.y += (1.6 + mouse.y * 0.7 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const animate = () => {
      renderScene();
      rafId = requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      renderScene();
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(rafId);

      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      glowTexture.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        background:
          "radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.22), transparent 30%), radial-gradient(circle at 80% 35%, rgba(139, 92, 246, 0.22), transparent 32%), radial-gradient(circle at 50% 85%, rgba(16, 185, 129, 0.14), transparent 34%), #020617",
      }}
    />
  );
};

export default ThreeScene;