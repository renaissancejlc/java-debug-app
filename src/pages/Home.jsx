import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Starter bugs', value: '24+' },
  { label: 'Core categories', value: '8' },
  { label: 'Timed drills', value: 'Per problem' },
];

const categories = [
  'Null pointer',
  'String equality',
  'Loop boundaries',
  'Collections',
  'Streams',
  'Exceptions',
  'State mutation',
  'Spring basics',
];

const sampleProblems = [
  {
    id: 1,
    title: 'String comparison trap',
    difficulty: 'Easy',
    time: '02:00',
    category: 'String equality',
    symptom: 'Expected true for new String("ADMIN"), got false.',
    code: `public static boolean isAdmin(String role) {\n    return role == "ADMIN";\n}`,
  },
  {
    id: 2,
    title: 'Array sum misses the last value',
    difficulty: 'Easy',
    time: '02:00',
    category: 'Loop boundaries',
    symptom: 'sum([1, 2, 3]) returns 3 instead of 6.',
    code: `public static int sum(int[] nums) {\n    int total = 0;\n    for (int i = 0; i < nums.length - 1; i++) {\n        total += nums[i];\n    }\n    return total;\n}`,
  },
  {
    id: 3,
    title: 'Concurrent modification crash',
    difficulty: 'Medium',
    time: '04:00',
    category: 'Collections',
    symptom: 'Throws ConcurrentModificationException while removing blanks.',
    code: `for (String name : names) {\n    if (name.isBlank()) {\n        names.remove(name);\n    }\n}`,
  },
];

const testimonials = [
  'Read the code. Spot the signal. Name the bug.',
  'Bonus mode lets you patch the code and verify the fix.',
  'Great for interview prep, debugging reps, and pattern memory.',
];

function CountdownCard() {
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progress = (secondsLeft / 120) * 100;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Live drill preview</div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Per-question timer</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Each bug gets its own clock so you can train under light pressure, then review the explanation after time expires.
          </p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Time left</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-950">{minutes}:{seconds}</div>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-sky-600 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Prompt</div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Identify the bug causing the method to fail for a newly constructed admin role string.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Reward</div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Earn bonus credit for fixing the code before the countdown ends and verifying the solution.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProblemPreviewCard({ problem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
          {problem.difficulty}
        </span>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
          {problem.category}
        </span>
        <span className="ml-auto text-sm font-medium text-slate-500">{problem.time}</span>
      </div>

      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{problem.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{problem.symptom}</p>

      <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        <code>{problem.code}</code>
      </pre>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Core flow</div>
          <p className="mt-1 text-sm text-slate-600">View code → identify bug → fix it → verify</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
        >
          Open drill
        </button>
      </div>
    </motion.article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');

  const visibleProblems = useMemo(() => {
    if (activeCategory === 'All') {
      return sampleProblems;
    }

    return sampleProblems.filter((problem) => problem.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f9ff_0%,_#ffffff_42%,_#f8fafc_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),transparent_38%,rgba(15,23,42,0.05))]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">Java Debug Trainer</div>
              <p className="mt-2 text-sm text-slate-600">Small timed bug drills for building real debugging instincts.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/practice"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
              >
                Practice mode
              </Link>
              <Link
                to="/problems"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Start drilling
              </Link>
            </div>
          </div>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-medium text-sky-800 shadow-sm backdrop-blur"
              >
                Read the code. Identify the bug. Fix it if you can.
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl"
              >
                Train your Java debugging skills with short, timed code drills.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
              >
                Each problem shows a broken Java snippet and a visible symptom. Spot the root cause, explain the bug, then earn bonus points by patching the code and verifying the corrected solution.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="mt-10 grid gap-4 sm:grid-cols-3"
              >
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                    <div className="text-3xl font-semibold tracking-tight text-slate-950">{item.value}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{item.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <CountdownCard />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 sm:px-8 lg:px-10">
        <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-300">Why this app works</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Built for actual debugging reps, not just coding trivia.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((text) => (
              <div key={text} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-200">
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">Problem library</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Start small, then scale into a large bug bank.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Begin with common Java traps, then expand into stream bugs, Spring issues, concurrency scenarios, and enterprise-style debugging problems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {['All', ...categories].map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-950'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {visibleProblems.map((problem) => (
            <ProblemPreviewCard key={problem.id} problem={problem} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-6 pb-24 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">Core categories</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Train across the patterns that actually show up.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-8 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">Practice loop</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">A clean workflow for every question.</h2>
            <div className="mt-8 space-y-4">
              {[
                'View the broken Java snippet and visible symptom.',
                'Identify the bug category and explain the root cause.',
                'Bonus: patch the code directly in the browser.',
                'Verify the corrected solution and review the explanation.',
              ].map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/problems"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Browse problems
              </Link>
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
              >
                View roadmap
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}