// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sun,
  Moon,
  MessageCircle,
  Server,
  ShieldCheck,
  Wrench,
  LineChart,
  Cloud as CloudIcon,
} from 'lucide-react';

/* ------------------------------ Particles ------------------------------ */
function ParticlesCanvas({ darkMode }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const prefersReduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (prefersReduce) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0;
    let height = 0;

    const color = darkMode
      ? { r: 243, g: 108, b: 33 }
      : { r: 255, g: 102, b: 0 };
    const linkOpacity = isMobile ? 0 : 0.28;
    const maxDist = isMobile ? 0 : 150;
    const repulseDist = isMobile ? 70 : 100;

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      width = clientWidth;
      height = clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = isMobile ? 52000 : 18000;
      const count = Math.max(24, Math.floor((width * height) / density));
      const arr = particlesRef.current;

      if (arr.length === 0) {
        for (let i = 0; i < count; i++) {
          arr.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
          });
        }
      } else if (arr.length < count) {
        for (let i = arr.length; i < count; i++) {
          arr.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
          });
        }
      } else if (arr.length > count) {
        arr.splice(count);
      }
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };

    const onMouseLeave = () => {
      mouse.current.active = false;
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    let lastTs = 0;
    const step = (ts) => {
      if (isMobile && ts - lastTs < 28) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      lastTs = ts;

      ctx.clearRect(0, 0, width, height);
      const arr = particlesRef.current;

      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        if (mouse.current.active && !isMobile) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < repulseDist * repulseDist) {
            const dist = Math.max(0.0001, Math.sqrt(dist2));
            const force = (repulseDist - dist) / repulseDist;
            p.vx += (dx / dist) * force * 0.6;
            p.vy += (dy / dist) * force * 0.6;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.85)`;
        ctx.fill();
      }

      if (maxDist > 0) {
        ctx.lineWidth = 1;
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            const a = arr[i];
            const b = arr[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < maxDist * maxDist) {
              const alpha = linkOpacity * (1 - Math.sqrt(dist2) / maxDist);
              ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 will-change-transform"
    />
  );
}

/* ------------------------------- Data ------------------------------- */
const WHY_US = [
  {
    t: 'Acompañamiento Integral',
    d: 'Desde la implementación hasta la capacitación y soporte continuo. Todo integrado de punta a punta.',
  },
  {
    t: 'Soporte Técnico Especializado',
    d: 'Especialistas en Tango Gestión e integraciones: resolvemos rápido y sin cortes.',
  },
  {
    t: 'Soluciones en la Nube',
    d: 'Disponibilidad, seguridad y escalabilidad con acceso remoto y backups.',
  },
];

const SERVICES = [
  {
    t: 'Tango Software',
    d: 'Tango Gestión, Punto de Venta, Tiendas, Estudios Contables y Restó.',
    icon: Server,
  },
  {
    t: 'Soporte Técnico y Nube',
    d: 'Mantenimiento, backups y soporte remoto continuo.',
    icon: ShieldCheck,
  },
  {
    t: 'Desarrollos a Medida',
    d: 'Integraciones personalizadas sobre Tango y otros sistemas.',
    icon: Wrench,
  },
  {
    t: 'CRM y MRP',
    d: 'Action Sales y Capataz para potenciar ventas y producción.',
    icon: LineChart,
  },
];

const CLOUD_PLANS = [
  { name: 'KAIZEN 1', cpu: 2, ram: 8, ssd: 80, trafico: 20, code: 'CCX13' },
  { name: 'KAIZEN 2', cpu: 4, ram: 16, ssd: 160, trafico: 20, code: 'CCX23' },
  { name: 'KAIZEN 3', cpu: 8, ram: 32, ssd: 240, trafico: 30, code: 'CCX33' },
];

/* ------------------------------- Main ------------------------------- */
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toggleMode = () => setDarkMode((v) => !v);

  // Imagen de hero (día / noche)
  const heroImgDay =
    'https://media.istockphoto.com/id/1566680995/es/foto/tecnolog%C3%ADa-futura-conexi%C3%B3n-de-red-de-datos-digitales-ciberseguridad-de-computaci%C3%B3n-en-la-nube.webp?a=1&b=1&s=612x612&w=0&k=20&c=40JpCptRYBflf3SZ6PRn9exkhFCE4ZNSlzF0XRLcw2U=';
  // misma imagen con tratamiento oscuro para "noche"
  const heroImgNight = heroImgDay;

  const theme = darkMode
    ? {
        bg: 'bg-neutral-950 text-gray-100',
        sectionBg: 'bg-neutral-950',
        gradient: 'from-neutral-950/60 via-neutral-900/70 to-orange-950/30',
        text: 'text-white',
      }
    : {
        bg: 'bg-white text-neutral-900',
        sectionBg: 'bg-white',
        gradient: 'from-white/50 via-gray-100/60 to-orange-50/50',
        text: 'text-neutral-900',
      };

  return (
    <div
      className={`relative min-h-screen font-sans overflow-x-hidden transition-colors duration-700 ${theme.bg}`}
    >
      {/* Fondo animado + partículas */}
      <ParticlesCanvas darkMode={darkMode} />

      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b border-neutral-300/30 shadow-md transition ${
          darkMode ? 'bg-neutral-950/90' : 'bg-white/90'
        } md:backdrop-blur`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <img
            src="/img/logo-icon.png"
            alt="Kaizen logo"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            loading="eager"
            decoding="async"
          />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Nosotros', 'Servicios', 'Cloud', 'Contactanos'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="hover:text-orange-500 transition"
              >
                {link}
              </a>
            ))}
          </nav>
          <button
            onClick={toggleMode}
            className="ml-4 p-3 rounded-full border border-orange-500 hover:bg-orange-500 hover:text-white transition"
            aria-label="Cambiar tema"
            title="Cambiar tema"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Hero con imagen + movimiento y tratamiento día/noche */}
      <section
        className={`relative min-h-[82vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden ${theme.sectionBg}`}
      >
        {/* Capa imagen animada */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${darkMode ? heroImgNight : heroImgDay}')`,
            filter: darkMode
              ? 'brightness(0.55) saturate(1.15) contrast(1.05)'
              : 'brightness(0.9)',
          }}
          initial={{ scale: 1.06, y: 0 }}
          animate={
            prefersReducedMotion
              ? {}
              : { scale: [1.06, 1.12, 1.06], y: [0, -10, 0] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Degradé superior */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${theme.gradient}`}
        />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className={`font-extrabold leading-tight ${theme.text} text-4xl sm:text-5xl md:text-6xl`}
          >
            AUTOMATIZACIÓN Y SOPORTE A MEDIDA | SOFTWARE TANGO GESTIÓN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: prefersReducedMotion ? 0 : 0.8,
            }}
            className="mt-5 sm:mt-6 text-base sm:text-lg max-w-2xl mx-auto text-gray-100/90 md:text-gray-200 dark:text-gray-300"
          >
            Tecnología que potencia tu empresa. Implementamos, optimizamos,
            capacitamos y damos soporte a soluciones tecnológicas adaptadas a tu
            empresa.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <a
              href="#servicios"
              className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-medium transition w-full sm:w-auto"
            >
              Ver Servicios
            </a>
            <a
              href="#contactanos"
              className="border border-orange-600 text-orange-100 md:text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-full font-medium transition w-full sm:w-auto"
            >
              Contacto
            </a>
          </motion.div>
        </div>
      </section>

      {/* Nosotros */}
      <section
        id="nosotros"
        className="py-16 sm:py-20 text-center px-4 sm:px-6"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 ${theme.text}`}
          >
            Nosotros
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed">
            Optimizamos tu empresa con tecnología, mejorando la eficiencia
            operativa. Acompañamos de forma cercana con soluciones a medida y
            foco en resultados.
          </p>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section
        id="porqueelegirnos"
        className="py-16 sm:py-20 text-center px-4 sm:px-6 bg-gradient-to-b from-orange-50/60 to-transparent dark:from-neutral-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 ${theme.text}`}
          >
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 text-left">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: i * 0.12,
                  duration: prefersReducedMotion ? 0 : 0.6,
                }}
                className="p-6 rounded-2xl shadow-lg border border-orange-500/20 bg-white/80 dark:bg-neutral-900/70 hover:-translate-y-1.5 transition-transform"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-2.5">
                  {item.t}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {item.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section
        id="servicios"
        className="py-16 sm:py-20 px-4 sm:px-6 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          className={`text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 ${theme.text}`}
        >
          Nuestros Servicios
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: i * 0.12,
                  duration: prefersReducedMotion ? 0 : 0.6,
                }}
                className="p-6 rounded-2xl shadow-lg border border-orange-500/20 bg-white/80 dark:bg-neutral-900/70 hover:-translate-y-2 transition-transform"
              >
                <div className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-600/20">
                  <Icon />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-2">
                  {s.t}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {s.d}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Cloud */}
      <section id="cloud" className="py-16 sm:py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          className={`text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 ${theme.text}`}
        >
          Planes de Infraestructura Cloud
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 px-4 sm:px-6">
          {CLOUD_PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: i * 0.15,
                duration: prefersReducedMotion ? 0 : 0.7,
              }}
              className="relative p-7 sm:p-8 rounded-3xl border border-orange-500/40 shadow-lg bg-gradient-to-b from-orange-600/10 to-transparent hover:scale-[1.02] transition-transform backdrop-blur-lg"
            >
              <div className="absolute -top-6 left-6">
                <span className="inline-flex items-center gap-2 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  <CloudIcon size={14} /> Optimizado
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-orange-500 mb-3">
                {p.name}
              </h3>
              <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2 mb-6 text-sm sm:text-base">
                <li>
                  <strong>vCPUs:</strong> {p.cpu}
                </li>
                <li>
                  <strong>RAM:</strong> {p.ram} GB
                </li>
                <li>
                  <strong>SSD:</strong> {p.ssd} GB
                </li>
                <li>
                  <strong>Tráfico:</strong> {p.trafico} TB
                </li>
              </ul>
              <a
                href={`https://wa.me/5491122546422?text=Hola! Me interesa conocer más sobre el paquete ${p.name} (${p.code}) de infraestructura cloud de Kaizen.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-medium transition"
              >
                Consultar por WhatsApp
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contacto (FormSubmit → info@kaizenit.com.ar) */}
      <section id="contactanos" className="relative py-20 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${theme.text}`}>
            Contactanos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 text-base sm:text-lg">
            Llevá tu empresa al siguiente nivel. Descubrí cómo optimizar tu
            gestión y mejorar tu eficiencia con nuestras soluciones.
          </p>

          {/* IMPORTANTE: primera vez te enviará un correo de verificación de FormSubmit */}
          <form
            action="https://formsubmit.co/info@kaizenit.com.ar"
            method="POST"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10"
          >
            {/* campos ocultos útiles */}
            <input
              type="hidden"
              name="_subject"
              value="Nuevo contacto desde kaizenit.com.ar"
            />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="box" />
            <input
              type="hidden"
              name="_next"
              value="https://kaizenit.com.ar#contactanos"
            />

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              autoComplete="name"
              required
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="empresa"
              placeholder="Empresa"
              autoComplete="organization"
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              inputMode="tel"
              autoComplete="tel"
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              name="mensaje"
              placeholder="Mensaje"
              rows={4}
              required
              className="md:col-span-2 p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>

            <motion.button
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              type="submit"
              className="md:col-span-2 bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition"
            >
              Enviar mensaje
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t border-neutral-200 dark:border-neutral-800 py-8 sm:py-10 text-center text-sm ${
          darkMode ? 'bg-black text-gray-500' : 'bg-white text-neutral-600'
        }`}
      >
        <p>
          © {new Date().getFullYear()} Kaizen Consultora IT. Todos los derechos
          reservados.
        </p>
      </footer>

      {/* WhatsApp FAB */}
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: 0.8 }}
        href="https://wa.me/5491122546422?text=Hola! Quiero recibir más información sobre los servicios de Kaizen Consultora IT."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 bg-green-500 hover:bg-green-400 text-white p-4 rounded-full shadow-lg z-50"
        aria-label="WhatsApp Kaizen"
      >
        <MessageCircle size={26} />
      </motion.a>
    </div>
  );
}
