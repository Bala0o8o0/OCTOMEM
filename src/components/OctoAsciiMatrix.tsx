'use client';

import React, { useEffect, useRef } from 'react';

interface OctoAsciiMatrixProps {
  /** Optional path to your image in /public (e.g. "/octomem-2nd.jpg"). Defaults to built-in 1:1 octo-chip wireframe. */
  imageSrc?: string;
  /** Primary ASCII matrix phosphor color. Defaults to "#FF5500". */
  color?: string;
  /** ASCII grid cell height in pixels (smaller = higher detail). Defaults to 6. */
  cellSize?: number;
  /** Animation speed multiplier. Defaults to 1.1. */
  speed?: number;
  /** Optional additional wrapper classes */
  className?: string;
}

interface GridCell {
  lum: number;
  dist: number;
  angle: number;
}

const CHAR_RAMP = ' ·:-=+*#%@';

export default function OctoAsciiMatrix({
  imageSrc,
  color = '#FF5500',
  cellSize = 6,
  speed = 1.1,
  className = '',
}: OctoAsciiMatrixProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Offscreen canvases for procedural wireframe / image sampling
    const sourceCanvas = document.createElement('canvas');
    const sCtx = sourceCanvas.getContext('2d');
    const sampleCanvas = document.createElement('canvas');
    const smpCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!sCtx || !smpCtx) return;

    let cols = 0;
    let rows = 0;
    let baseGrid: GridCell[] = [];
    let time = 0;
    let lastFrameTime = performance.now();
    let animationFrameId = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    /**
     * Synthesizes the 1:1 octagonal microchip + 8 segmented wireframe tentacles
     */
    const drawProceduralOctoChip = () => {
      const size = 1024;
      sourceCanvas.width = size;
      sourceCanvas.height = size;
      const cx = size / 2;
      const cy = size / 2;

      sCtx.fillStyle = '#000000';
      sCtx.fillRect(0, 0, size, size);
      sCtx.lineCap = 'round';
      sCtx.lineJoin = 'round';

      const traceOctagon = (radius: number, rot = Math.PI / 8) => {
        sCtx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = rot + (i * Math.PI) / 4;
          const x = cx + Math.cos(a) * radius;
          const y = cy + Math.sin(a) * radius;
          if (i === 0) sCtx.moveTo(x, y);
          else sCtx.lineTo(x, y);
        }
        sCtx.closePath();
      };

      // 8 curved segmented wireframe tentacles
      const leftTentacles = [
        { startAng: -2.18, angles: [-2.15, -1.92, -1.68, -1.55, -1.72, -2.1, -2.65, -3.25, -3.75, -4.15], step: 37, thick: 46 },
        { startAng: -2.78, angles: [-2.78, -2.65, -2.52, -2.6, -2.85, -3.22, -3.65, -4.08, -4.45, -4.78], step: 38, thick: 48 },
        { startAng: 2.78, angles: [2.78, 2.92, 3.12, 3.25, 3.1, 2.72, 2.25, 1.82, 1.45, 1.12], step: 38, thick: 48 },
        { startAng: 2.22, angles: [2.22, 2.35, 2.48, 2.42, 2.18, 1.78, 1.32, 0.88, 0.48, 0.12], step: 39, thick: 50 },
      ];

      const tentacleConfigs = [
        ...leftTentacles,
        ...leftTentacles.map((t) => ({
          startAng: t.startAng < 0 ? -(Math.PI + t.startAng) : Math.PI - t.startAng,
          angles: t.angles.map((a) => Math.PI - a),
          step: t.step,
          thick: t.thick,
        })),
      ];

      tentacleConfigs.forEach((t) => {
        const startR = 176;
        const points: { x: number; y: number; r: number; angle: number }[] = [];
        let curX = cx + Math.cos(t.startAng) * startR;
        let curY = cy + Math.sin(t.startAng) * startR;
        const totalSegs = t.angles.length;

        for (let s = 0; s <= totalSegs; s++) {
          const prog = s / totalSegs;
          const ang = s < totalSegs ? t.angles[s] : t.angles[totalSegs - 1];
          if (s > 0) {
            const segLen = t.step * (1 - prog * 0.24);
            curX += Math.cos(ang) * segLen;
            curY += Math.sin(ang) * segLen;
          }
          const radius = s === totalSegs ? 1.2 : t.thick * Math.pow(1 - prog * 0.85, 0.88);
          points.push({ x: curX, y: curY, r: radius, angle: ang });
        }

        for (let s = 0; s < points.length - 1; s++) {
          const p0 = points[s];
          const p1 = points[s + 1];
          const perp0 = p0.angle + Math.PI / 2;
          const perp1 = p1.angle + Math.PI / 2;

          const p0L = { x: p0.x + Math.cos(perp0) * p0.r, y: p0.y + Math.sin(perp0) * p0.r };
          const p0R = { x: p0.x - Math.cos(perp0) * p0.r, y: p0.y - Math.sin(perp0) * p0.r };
          const p1L = { x: p1.x + Math.cos(perp1) * p1.r, y: p1.y + Math.sin(perp1) * p1.r };
          const p1R = { x: p1.x - Math.cos(perp1) * p1.r, y: p1.y - Math.sin(perp1) * p1.r };

          const grad = sCtx.createLinearGradient(p0L.x, p0L.y, p0R.x, p0R.y);
          grad.addColorStop(0, '#e5e5e5');
          grad.addColorStop(0.25, '#787878');
          grad.addColorStop(0.52, '#222222');
          grad.addColorStop(0.8, '#8e8e8e');
          grad.addColorStop(1, '#f0f0f0');

          sCtx.beginPath();
          sCtx.moveTo(p0L.x, p0L.y);
          sCtx.lineTo(p1L.x, p1L.y);
          sCtx.lineTo(p1R.x, p1R.y);
          sCtx.lineTo(p0R.x, p0R.y);
          sCtx.closePath();
          sCtx.fillStyle = grad;
          sCtx.fill();

          sCtx.strokeStyle = '#ffffff';
          sCtx.lineWidth = s === points.length - 2 ? 2.6 : 2.1;
          sCtx.stroke();

          // Longitudinal & cross-hatched wireframe grid lines
          sCtx.strokeStyle = 'rgba(255,255,255,0.42)';
          sCtx.lineWidth = 0.85;
          for (let m = 1; m < 5; m++) {
            const frac = m / 5;
            sCtx.beginPath();
            sCtx.moveTo(p0L.x + (p0R.x - p0L.x) * frac, p0L.y + (p0R.y - p0L.y) * frac);
            sCtx.lineTo(p1L.x + (p1R.x - p1L.x) * frac, p1L.y + (p1R.y - p1L.y) * frac);
            sCtx.stroke();
          }
          for (let rSub = 1; rSub <= 2; rSub++) {
            const tFrac = rSub / 3;
            sCtx.beginPath();
            sCtx.moveTo(p0L.x + (p1L.x - p0L.x) * tFrac, p0L.y + (p1L.y - p0L.y) * tFrac);
            sCtx.lineTo(p0R.x + (p1R.x - p0R.x) * tFrac, p0R.y + (p1R.y - p0R.y) * tFrac);
            sCtx.stroke();
          }
        }
      });

      // Cardinal mechanical vents
      [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((ang) => {
        sCtx.save();
        sCtx.translate(cx, cy);
        sCtx.rotate(ang);
        sCtx.beginPath();
        sCtx.moveTo(185, -52);
        sCtx.lineTo(232, -34);
        sCtx.lineTo(232, 34);
        sCtx.lineTo(185, 52);
        sCtx.closePath();
        sCtx.fillStyle = '#4a4a4a';
        sCtx.fill();
        sCtx.strokeStyle = '#ffffff';
        sCtx.lineWidth = 2.5;
        sCtx.stroke();

        sCtx.fillStyle = '#111111';
        sCtx.fillRect(194, -22, 28, 44);
        sCtx.strokeStyle = '#dddddd';
        sCtx.lineWidth = 1.8;
        sCtx.strokeRect(194, -22, 28, 44);
        for (let vy = -11; vy <= 11; vy += 11) {
          sCtx.beginPath();
          sCtx.moveTo(194, vy);
          sCtx.lineTo(222, vy);
          sCtx.stroke();
        }
        sCtx.restore();
      });

      // Layered octagonal chassis
      [
        { r: 205, fill: '#555555', stroke: '#ffffff', lw: 3.0 },
        { r: 192, fill: '#262626', stroke: '#dcdcdc', lw: 2.0 },
        { r: 176, fill: '#7a7a7a', stroke: '#ffffff', lw: 2.8 },
        { r: 158, fill: '#333333', stroke: '#e5e5e5', lw: 2.2 },
        { r: 142, fill: '#141414', stroke: '#ffffff', lw: 3.0 },
      ].forEach((layer) => {
        traceOctagon(layer.r);
        sCtx.fillStyle = layer.fill;
        sCtx.fill();
        sCtx.strokeStyle = layer.stroke;
        sCtx.lineWidth = layer.lw;
        sCtx.stroke();
      });

      // Radial struts & corner bolts
      for (let i = 0; i < 8; i++) {
        const a = Math.PI / 8 + (i * Math.PI) / 4;
        sCtx.beginPath();
        sCtx.moveTo(cx + Math.cos(a) * 142, cy + Math.sin(a) * 142);
        sCtx.lineTo(cx + Math.cos(a) * 205, cy + Math.sin(a) * 205);
        sCtx.strokeStyle = '#ffffff';
        sCtx.lineWidth = 2.2;
        sCtx.stroke();

        if (i % 2 === 1) {
          const bx = cx + Math.cos(a) * 167;
          const by = cy + Math.sin(a) * 167;
          sCtx.beginPath();
          sCtx.arc(bx, by, 9, 0, Math.PI * 2);
          sCtx.fillStyle = '#222222';
          sCtx.fill();
          sCtx.strokeStyle = '#ffffff';
          sCtx.lineWidth = 2;
          sCtx.stroke();
          sCtx.beginPath();
          sCtx.arc(bx, by, 3.5, 0, Math.PI * 2);
          sCtx.fillStyle = '#ffffff';
          sCtx.fill();
        }
      }

      // Inner silicon PCB & central microchip die
      traceOctagon(134);
      sCtx.fillStyle = '#0c0c0e';
      sCtx.fill();
      sCtx.strokeStyle = '#ffffff';
      sCtx.lineWidth = 2.2;
      sCtx.stroke();

      const chipHalf = 36;
      sCtx.strokeStyle = '#f0f0f0';
      sCtx.fillStyle = '#ffffff';
      sCtx.lineWidth = 1.9;

      for (let side = 0; side < 4; side++) {
        sCtx.save();
        sCtx.translate(cx, cy);
        sCtx.rotate((side * Math.PI) / 2);
        for (let p = 0; p < 7; p++) {
          const offset = -24 + p * 8;
          const fanOut = -58 + p * 19.3;
          sCtx.beginPath();
          sCtx.moveTo(offset, -chipHalf);
          sCtx.lineTo(offset, -chipHalf - 16);
          sCtx.lineTo(fanOut, -76);
          sCtx.lineTo(fanOut, -108);
          sCtx.stroke();

          sCtx.beginPath();
          sCtx.arc(fanOut, -110, 2.8, 0, Math.PI * 2);
          sCtx.fill();
        }
        sCtx.restore();
      }

      sCtx.fillStyle = '#1e1e22';
      sCtx.fillRect(cx - chipHalf, cy - chipHalf, chipHalf * 2, chipHalf * 2);
      sCtx.strokeStyle = '#ffffff';
      sCtx.lineWidth = 3;
      sCtx.strokeRect(cx - chipHalf, cy - chipHalf, chipHalf * 2, chipHalf * 2);
      sCtx.strokeStyle = '#aaaaaa';
      sCtx.lineWidth = 1.5;
      sCtx.strokeRect(cx - chipHalf + 7, cy - chipHalf + 7, (chipHalf - 7) * 2, (chipHalf - 7) * 2);
    };

    /**
     * Samples luminance & polar geometry onto the ASCII grid
     */
    const rebuildSampleGrid = () => {
      if (!sourceCanvas.width || !sourceCanvas.height) return;
      const charW = cellSize * 0.62;
      const charH = cellSize;

      cols = Math.max(20, Math.floor(canvas.width / charW));
      rows = Math.max(15, Math.floor(canvas.height / charH));

      sampleCanvas.width = cols;
      sampleCanvas.height = rows;

      smpCtx.fillStyle = '#000000';
      smpCtx.fillRect(0, 0, cols, rows);

      const srcAspect = sourceCanvas.width / sourceCanvas.height;
      const gridAspect = (cols * charW) / (rows * charH);

      let drawW: number;
      let drawH: number;
      if (srcAspect > gridAspect) {
        drawW = cols * 0.92;
        drawH = (drawW * charW) / (srcAspect * charH);
      } else {
        drawH = rows * 0.92;
        drawW = (drawH * charH * srcAspect) / charW;
      }

      smpCtx.drawImage(
        sourceCanvas,
        (cols - drawW) / 2,
        (rows - drawH) / 2,
        drawW,
        drawH
      );

      const imgData = smpCtx.getImageData(0, 0, cols, rows).data;
      const grid = new Array<GridCell>(rows * cols);
      const cx = cols / 2;
      const cy = rows / 2;
      const maxDist = Math.hypot(cx, cy);
      const contrast = 1.3;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = (y * cols + x) * 4;
          let lum = (0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2]) / 255;
          lum = Math.max(0, Math.min(1, (lum - 0.5) * contrast + 0.5));

          const dx = (x - cx) * (charW / charH);
          const dy = y - cy;
          grid[y * cols + x] = {
            lum,
            dist: Math.hypot(dx, dy) / (maxDist * 0.72),
            angle: Math.atan2(dy, dx),
          };
        }
      }
      baseGrid = grid;
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      rebuildSampleGrid();
    };

    // Load either custom imageSrc prop or built-in procedural 1:1 octo-chip
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        sourceCanvas.width = img.width;
        sourceCanvas.height = img.height;
        sCtx.fillStyle = '#000000';
        sCtx.fillRect(0, 0, img.width, img.height);
        sCtx.drawImage(img, 0, 0);
        handleResize();
      };
      img.onerror = () => {
        drawProceduralOctoChip();
        handleResize();
      };
      img.src = imageSrc;
    } else {
      drawProceduralOctoChip();
      handleResize();
    }

    /**
     * Real-time #FF5500 Matrix ASCII Animation Loop
     */
    const renderLoop = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;
      time += dt * speed;

      const charW = cellSize * 0.62;
      const charH = cellSize;
      const rampLen = CHAR_RAMP.length;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `700 ${cellSize}px "JetBrains Mono", "Fira Code", monospace`;
      ctx.textBaseline = 'top';

      const startX = (canvas.width - cols * charW) / 2;
      const startY = (canvas.height - rows * charH) / 2;
      const scanY = (((time * 0.38) % 1.2) - 0.1) * rows;

      for (let y = 0; y < rows; y++) {
        const py = startY + y * charH;

        for (let x = 0; x < cols; x++) {
          const baseCell = baseGrid[y * cols + x];
          if (!baseCell) continue;

          // Organic tentacle wave motion on outer appendages
          let sampleX = x;
          let sampleY = y;
          if (baseCell.dist > 0.34) {
            const tentacleFactor = Math.min(1.5, (baseCell.dist - 0.34) * 2.1);
            const waveX = Math.sin(time * 2.5 + y * 0.14 + baseCell.angle * 3) * 1.15 * tentacleFactor;
            const waveY = Math.cos(time * 2.1 + x * 0.12 - baseCell.angle * 2) * 0.95 * tentacleFactor;
            sampleX = Math.max(0, Math.min(cols - 1, Math.round(x + waveX)));
            sampleY = Math.max(0, Math.min(rows - 1, Math.round(y + waveY)));
          }

          const cell = baseGrid[sampleY * cols + sampleX] || baseCell;
          let lum = cell.lum;

          if (lum < 0.04) {
            if (mouse.active) {
              const px = startX + x * charW;
              const mDist = Math.hypot(px - mouse.x, py - mouse.y);
              if (mDist < 110) lum = (1 - mDist / 110) * 0.35;
            }
            if (lum < 0.04) continue;
          }

          // Radial energy pulse from core -> tentacles
          const radialWave = Math.sin(cell.dist * 14 - time * 5.2);
          const circuitSurge = Math.pow(Math.max(0, radialWave), 4) * 0.38;
          const corePulse = cell.dist < 0.25 ? Math.sin(time * 4.5) * 0.16 : 0;
          let energyBoost = circuitSurge + corePulse;

          // Matrix scanline shimmer
          let isGlitching = false;
          const distToScan = Math.abs(y - scanY);
          if (distToScan < 3.2) {
            energyBoost += (1 - distToScan / 3.2) * 0.32;
            if (Math.random() < 0.18) isGlitching = true;
          }
          if (lum > 0.55 && Math.random() < 0.012) {
            isGlitching = true;
          }

          // Interactive cursor energy ripple
          if (mouse.active) {
            const px = startX + x * charW;
            const mDist = Math.hypot(px - mouse.x, py - mouse.y);
            if (mDist < 140) {
              const factor = 1 - mDist / 140;
              energyBoost += factor * 0.45;
            }
          }

          const finalLum = Math.max(0, Math.min(1, lum + energyBoost));
          let charIdx = Math.floor(finalLum * (rampLen - 1));
          if (isGlitching && rampLen > 2) {
            charIdx = 1 + Math.floor(Math.random() * (rampLen - 1));
          }

          const ch = CHAR_RAMP[charIdx];
          if (ch === ' ') continue;

          // Monochrome #FF5500 intensity shading (deep ember -> vibrant #FF5500 -> bright hot core)
          ctx.fillStyle = color;
          ctx.globalAlpha = Math.max(0.28, Math.min(1, 0.25 + finalLum * 0.85));
          ctx.fillText(ch, startX + x * charW, py);
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [imageSrc, color, cellSize, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[400px] bg-black overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}