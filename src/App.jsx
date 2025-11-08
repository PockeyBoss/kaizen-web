// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

  const color = darkMode ? { r: 243, g: 108, b: 33 } : { r: 255, g: 102, b: 0 };
  const linkOpacity = 0.28;
  const maxDist = 150;
  const repulseDist = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0;
    let height = 0;

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      width = clientWidth;
      height = clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(40, Math.floor((width * height) / 18000));
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

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      const arr = particlesRef.current;
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        if (mouse.current.active) {
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
        p.vx *= 0.98;
        p.vy *= 0.98;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.85)`;
        ctx.fill();
      }
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

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
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
  // Claro por defecto
  const [darkMode, setDarkMode] = useState(false);
  const toggleMode = () => setDarkMode((v) => !v);

  const theme = darkMode
    ? {
        bg: 'bg-neutral-950 text-gray-100',
        sectionBg: 'bg-neutral-950',
        gradient: 'from-neutral-950 via-neutral-900 to-orange-950/40',
        text: 'text-white',
      }
    : {
        bg: 'bg-white text-neutral-900',
        sectionBg: 'bg-white',
        gradient: 'from-white via-gray-100 to-orange-50/50',
        text: 'text-neutral-900',
      };

  return (
    <div
      className={`relative min-h-screen font-sans overflow-x-hidden transition-colors duration-700 ${theme.bg}`}
    >
      {/* Capa de partículas + blobs animados */}
      <ParticlesCanvas darkMode={darkMode} />
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* blobs naranjas suaves */}
        <motion.div
          className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,130,50,0.35), transparent)',
          }}
          animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,100,20,0.25), transparent)',
          }}
          animate={{ x: [0, -20, 10, 0], y: [0, 15, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`sticky top-0 z-50 backdrop-blur border-b border-neutral-300/30 shadow-md transition ${
          darkMode ? 'bg-neutral-950/90' : 'bg-white/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <motion.img
            src="/img/logo-icon.png"
            alt="Kaizen logo"
            className="w-16 h-16 object-contain"
            initial={{ rotate: -15, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Nosotros', 'Servicios', 'Cloud', 'Contactanos'].map(
              (link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="hover:text-orange-500 transition"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                >
                  {link}
                </motion.a>
              )
            )}
          </nav>
          <button
            onClick={toggleMode}
            className="ml-6 p-3 rounded-full border border-orange-500 hover:bg-orange-500 hover:text-white transition"
            aria-label="Cambiar tema"
            title="Cambiar tema"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Hero */}
      <section
        className={`relative h-[90vh] md:h-[96vh] flex items-center justify-center overflow-hidden ${theme.sectionBg}`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1590608897129-79da98d159d8?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b ${theme.gradient}`}
          style={{ opacity: 0.85 }}
        />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`text-5xl md:text-6xl font-extrabold leading-tight ${theme.text}`}
          >
            AUTOMATIZACIÓN Y SOPORTE A MEDIDA | SOFTWARE TANGO GESTIÓN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-6 text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
          >
            Tecnología que potencia tu empresa. Implementamos, optimizamos,
            capacitamos y damos soporte a soluciones tecnológicas adaptadas a tu
            empresa.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex justify-center gap-6"
          >
            <a
              href="#servicios"
              className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-medium transition"
            >
              Ver Servicios
            </a>
            <a
              href="#contactanos"
              className="border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-full font-medium transition"
            >
              Contacto
            </a>
          </motion.div>
        </div>
        <motion.img
          src="https://www.axoft.com/img/logos/gestion.svg"
          alt="Tango Gestión"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.3, y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-40 opacity-60"
        />
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-24 text-center px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-4xl font-bold mb-8 ${theme.text}`}>Nosotros</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Optimizamos tu empresa con tecnología, mejorando la eficiencia
            operativa. Acompañamos de forma cercana con soluciones a medida y
            foco en resultados.
          </p>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section
        id="porqueelegirnos"
        className="py-24 text-center px-6 bg-gradient-to-b from-orange-50/60 to-transparent dark:from-neutral-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-12 ${theme.text}`}>
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="p-6 rounded-2xl shadow-lg border border-orange-500/20 bg-white/80 dark:bg-neutral-900/70 hover:-translate-y-2 transition-transform"
              >
                <h3 className="text-2xl font-semibold text-orange-600 mb-3">
                  {item.t}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-24 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`text-4xl font-bold mb-12 ${theme.text}`}
        >
          Nuestros Servicios
        </motion.h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="p-6 rounded-2xl shadow-lg border border-orange-500/20 bg-white/80 dark:bg-neutral-900/70 hover:-translate-y-3 transition-transform"
              >
                <div className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-600/20">
                  <Icon />
                </div>
                <h3 className="text-2xl font-semibold text-orange-600 mb-2">
                  {s.t}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{s.d}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Cloud */}
      <section id="cloud" className="py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`text-4xl font-bold mb-12 ${theme.text}`}
        >
          Planes de Infraestructura Cloud
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {CLOUD_PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="relative p-8 rounded-3xl border border-orange-500/40 shadow-lg bg-gradient-to-b from-orange-600/10 to-transparent hover:scale-[1.02] transition-transform backdrop-blur-lg"
            >
              <div className="absolute -top-6 left-6">
                <span className="inline-flex items-center gap-2 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  <CloudIcon size={14} /> Optimizado
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-orange-500 mb-4">
                {p.name}
              </h3>
              <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2 mb-6">
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

      {/* Contacto */}
      <section id="contactanos" className="relative py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className={`text-4xl font-bold mb-6 ${theme.text}`}>
            Contactanos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
            Llevá tu empresa al siguiente nivel. Descubrí cómo optimizar tu
            gestión y mejorar tu eficiencia con nuestras soluciones.
          </p>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <input
              type="text"
              placeholder="Nombre"
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Empresa"
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              placeholder="Mensaje"
              rows={4}
              className="col-span-2 p-4 rounded-lg border border-gray-300 dark:border-gray-500/30 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="col-span-2 bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition"
            >
              Enviar mensaje
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`border-top border-neutral-200 dark:border-neutral-800 py-10 text-center text-sm transition ${
          darkMode ? 'bg-black text-gray-500' : 'bg-white text-neutral-600'
        }`}
      >
        <p>
          © {new Date().getFullYear()} Kaizen Consultora IT. Todos los derechos
          reservados.
        </p>
      </motion.footer>

      {/* WhatsApp FAB */}
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        href="https://wa.me/5491122546422?text=Hola! Quiero recibir más información sobre los servicios de Kaizen Consultora IT."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 text-white p-4 rounded-full shadow-lg z-50"
        aria-label="WhatsApp Kaizen"
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
}
