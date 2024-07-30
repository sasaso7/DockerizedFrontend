// @ts-nocheck

import React, { useEffect, useRef } from 'react';
import SimplexNoise from 'simplex-noise';
import * as dat from 'dat.gui';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let screenWidth, screenHeight, centerX, centerY;
    let particles = [];
    let hueBase = 0;
    let simplexNoise;
    let zoff = 0;
    let gui;

    const Configs = {
      backgroundColor: '#eee9e9',
      particleNum: 1000,
      step: 5,
      base: 1000,
      zInc: 0.001
    };

    class HSLA {
      constructor(h, s, l, a) {
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
        this.a = a || 0;
      }

      toString() {
        return `hsla(${this.h},${this.s * 100}%,${this.l * 100}%,${this.a})`;
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = color || new HSLA();
        this.pastX = this.x;
        this.pastY = this.y;
      }
    }

    const onWindowResize = () => {
      screenWidth = canvas.width = window.innerWidth;
      screenHeight = canvas.height = window.innerHeight;
      centerX = screenWidth / 2;
      centerY = screenHeight / 2;
      context.lineWidth = 0.3;
      context.lineCap = context.lineJoin = 'round';
    };

    const onCanvasClick = () => {
      context.save();
      context.globalAlpha = 0.8;
      context.fillStyle = Configs.backgroundColor;
      context.fillRect(0, 0, screenWidth, screenHeight);
      context.restore();

      simplexNoise = new SimplexNoise();
    };

    const getNoise = (x, y, z) => {
      const octaves = 4;
      const fallout = 0.5;
      let amp = 1, f = 1, sum = 0;
      for (let i = 0; i < octaves; ++i) {
        amp *= fallout;
        sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5;
        f *= 2;
      }
      return sum;
    };

    const initParticle = (p) => {
      p.x = p.pastX = screenWidth * Math.random();
      p.y = p.pastY = screenHeight * Math.random();
      p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI;
      p.color.s = 1;
      p.color.l = 0.5;
      p.color.a = 0;
    };

    const update = () => {
      const step = Configs.step;
      const base = Configs.base;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pastX = p.x;
        p.pastY = p.y;

        const angle = Math.PI * 6 * getNoise(p.x / base * 1.75, p.y / base * 1.75, zoff);
        p.x += Math.cos(angle) * step;
        p.y += Math.sin(angle) * step;

        if (p.color.a < 1) p.color.a += 0.003;
        context.beginPath();
        context.strokeStyle = p.color.toString();
        context.moveTo(p.pastX, p.pastY);
        context.lineTo(p.x, p.y);
        context.stroke();

        if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
          initParticle(p);
        }
      }

      hueBase += 0.1;
      zoff += Configs.zInc;
      animationRef.current = requestAnimationFrame(update);
    };

    const init = () => {
      onWindowResize();
      window.addEventListener('resize', onWindowResize);

      for (let i = 0; i < Configs.particleNum; i++) {
        particles[i] = new Particle();
        initParticle(particles[i]);
      }

      simplexNoise = new SimplexNoise();
      canvas.addEventListener('click', onCanvasClick);

      gui = new dat.GUI();
      gui.add(Configs, 'step', 1, 10);
      gui.add(Configs, 'base', 500, 3000);
      gui.add(Configs, 'zInc', 0.0001, 0.01);
      gui.close();

      update();
    };

    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      canvas.removeEventListener('click', onCanvasClick);
      cancelAnimationFrame(animationRef.current);
      gui.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />;
};

export default AnimatedBackground;