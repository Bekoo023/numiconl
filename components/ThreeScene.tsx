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
    scene.fog = new THREE.FogExp2("#020617", 0.035);

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

    const coreGroup = new THREE.Group();
    root.add(coreGroup);

    const ambientLight = new THREE.AmbientLight("#38bdf8", 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.8);
    keyLight.position.set(6, 8, 10);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight("#06b6d4", 3.5, 30);
    cyanLight.position.set(-7, 3, 5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight("#8b5cf6", 3, 30);
    violetLight.position.set(7, -2, 4);
    scene.add(violetLight);

    const emeraldLight = new THREE.PointLight("#10b981", 2.4, 26);
    emeraldLight.position.set(0, 6, -5);
    scene.add(emeraldLight);

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

    const particleCount = prefersReducedMotion ? 350 : isMobile ? 750 : 1600;

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

      const radius = 9 + Math.random() * 24;
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

    const coreGeometry = new THREE.IcosahedronGeometry(1.45, 3);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: "#0f172a",
      emissive: "#0891b2",
      emissiveIntensity: 0.65,
      metalness: 0.45,
      roughness: 0.18,
      transmission: 0.25,
      transparent: true,
      opacity: 0.78,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
    });

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(core);

    const wireGeometry = new THREE.IcosahedronGeometry(1.52, 2);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: "#67e8f9",
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });

    const wireCore = new THREE.Mesh(wireGeometry, wireMaterial);
    coreGroup.add(wireCore);

    const haloGeometry = new THREE.TorusGeometry(2.25, 0.012, 12, 180);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: "#22d3ee",
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const ring1 = new THREE.Mesh(haloGeometry, haloMaterial);
    ring1.rotation.x = Math.PI / 2.35;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      haloGeometry.clone(),
      new THREE.MeshBasicMaterial({
        color: "#8b5cf6",
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      })
    );
    ring2.rotation.y = Math.PI / 2.5;
    coreGroup.add(ring2);

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(3.05, 0.01, 10, 220),
      new THREE.MeshBasicMaterial({
        color: "#f0c86a",
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
    );
    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.z = Math.PI / 6;
    coreGroup.add(ring3);

    const networkGeometry = new THREE.BufferGeometry();
    const networkPositions: number[] = [];
    const networkColors: number[] = [];

    const lineCount = isMobile ? 24 : 54;

    for (let i = 0; i < lineCount; i++) {
      const angleA = Math.random() * Math.PI * 2;
      const angleB = angleA + (Math.random() - 0.5) * 1.6;

      const radiusA = 5 + Math.random() * 12;
      const radiusB = radiusA + Math.random() * 7;

      const start = new THREE.Vector3(
        Math.cos(angleA) * radiusA,
        (Math.random() - 0.5) * 10,
        Math.sin(angleA) * radiusA
      );

      const end = new THREE.Vector3(
        Math.cos(angleB) * radiusB,
        start.y + (Math.random() - 0.5) * 5,
        Math.sin(angleB) * radiusB
      );

      networkPositions.push(start.x, start.y, start.z);
      networkPositions.push(end.x, end.y, end.z);

      const color = palette[Math.floor(Math.random() * palette.length)];
      networkColors.push(color.r, color.g, color.b);
      networkColors.push(color.r * 0.35, color.g * 0.35, color.b * 0.35);
    }

    networkGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(networkPositions, 3)
    );
    networkGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(networkColors, 3)
    );

    const networkMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
    });

    const network = new THREE.LineSegments(networkGeometry, networkMaterial);
    root.add(network);

    const shardGeometries: THREE.BufferGeometry[] = [];
    const shardMaterials: THREE.Material[] = [];
    const shards: THREE.Mesh[] = [];

    const shardCount = isMobile ? 5 : 10;

    for (let i = 0; i < shardCount; i++) {
      const geometry =
        i % 2 === 0
          ? new THREE.OctahedronGeometry(0.25 + Math.random() * 0.25, 0)
          : new THREE.TetrahedronGeometry(0.3 + Math.random() * 0.25, 0);

      const color = palette[Math.floor(Math.random() * palette.length)];

      const material = new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25,
        metalness: 0.55,
        roughness: 0.22,
        transparent: true,
        opacity: 0.62,
      });

      const mesh = new THREE.Mesh(geometry, material);

      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 4.2 + Math.random() * 5.8;

      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 5,
        Math.sin(angle) * radius
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        offset: Math.random() * Math.PI * 2,
        speed: 0.55 + Math.random() * 0.75,
      };

      shardGeometries.push(geometry);
      shardMaterials.push(material);
      shards.push(mesh);
      root.add(mesh);
    }

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

      core.rotation.x = elapsed * 0.18;
      core.rotation.y = elapsed * 0.24;

      wireCore.rotation.x = -elapsed * 0.12;
      wireCore.rotation.y = elapsed * 0.16;

      ring1.rotation.z = elapsed * 0.32;
      ring2.rotation.x = elapsed * 0.24;
      ring3.rotation.z = -elapsed * 0.18;

      network.rotation.y = -elapsed * 0.018;
      network.rotation.x = Math.sin(elapsed * 0.12) * 0.04;

      shards.forEach((shard, index) => {
        const data = shard.userData;

        shard.position.x =
          data.baseX + Math.sin(elapsed * data.speed + data.offset) * 0.35;
        shard.position.y =
          data.baseY + Math.cos(elapsed * data.speed + data.offset) * 0.45;
        shard.position.z =
          data.baseZ + Math.sin(elapsed * data.speed * 0.7 + index) * 0.25;

        shard.rotation.x += 0.006 + index * 0.0004;
        shard.rotation.y += 0.004 + index * 0.0003;
      });

      cyanLight.position.x = Math.sin(elapsed * 0.65) * 8;
      cyanLight.position.z = Math.cos(elapsed * 0.5) * 8;

      violetLight.position.x = Math.cos(elapsed * 0.5) * 8;
      violetLight.position.y = Math.sin(elapsed * 0.8) * 5;

      emeraldLight.position.z = Math.sin(elapsed * 0.45) * 7;

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

      coreGeometry.dispose();
      coreMaterial.dispose();

      wireGeometry.dispose();
      wireMaterial.dispose();

      haloGeometry.dispose();
      haloMaterial.dispose();

      ring2.geometry.dispose();
      ring2.material.dispose();

      ring3.geometry.dispose();
      ring3.material.dispose();

      networkGeometry.dispose();
      networkMaterial.dispose();

      shardGeometries.forEach((geometry) => geometry.dispose());
      shardMaterials.forEach((material) => material.dispose());

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