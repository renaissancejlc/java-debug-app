import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import problems from '../json/problems.json';

const allCategories = ['All', ...new Set(problems.map((problem) => problem.category))];
const allDifficulties = ['All', ...new Set(problems.map((problem) => problem.difficulty))];

function ProblemCard({ problem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          {problem.difficulty}
        </span>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          {problem.category}
        </span>
        <span className="ml-auto text-sm font-medium text-slate-500">{problem.timeLimit}</span>
      </div>

      <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{problem.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{problem.symptom}</p>

      <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        <code>{problem.code}</code>
      </pre>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Read → identify → fix → verify</div>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
        >
          Open
        </button>
      </div>
    </article>
  );
}

function ActiveProblemPanel({ problem, currentPosition, totalProblems, onNext, onClear }) {
  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Now solving</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{problem.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{problem.symptom}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {problem.difficulty}
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            {problem.category}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            {problem.timeLimit}
          </span>
        </div>
      </div>

      <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        <code>{problem.code}</code>
      </pre>

      <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Progress</div>
          <p className="mt-1 text-sm text-slate-700">
            Problem {currentPosition} of {totalProblems} in the current filtered set.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Next problem
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
          >
            Stop session
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Problems() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeProblemIndex, setActiveProblemIndex] = useState(null);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      return matchesCategory && matchesDifficulty;
    });
  }, [selectedCategory, selectedDifficulty]);

  const activeProblem = activeProblemIndex !== null ? filteredProblems[activeProblemIndex] : null;

  useEffect(() => {
    if (filteredProblems.length === 0) {
      setActiveProblemIndex(null);
      return;
    }

    if (activeProblemIndex !== null && activeProblemIndex > filteredProblems.length - 1) {
      setActiveProblemIndex(0);
    }
  }, [filteredProblems, activeProblemIndex]);

  const startRandomProblem = () => {
    if (filteredProblems.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    setActiveProblemIndex(randomIndex);
  };

  const startFirstProblem = () => {
    if (filteredProblems.length === 0) {
      return;
    }

    setActiveProblemIndex(0);
  };

  const goToNextProblem = () => {
    if (filteredProblems.length === 0) {
      return;
    }

    if (activeProblemIndex === null) {
      setActiveProblemIndex(0);
      return;
    }

    const nextIndex = (activeProblemIndex + 1) % filteredProblems.length;
    setActiveProblemIndex(nextIndex);
  };

  const clearActiveProblem = () => {
    setActiveProblemIndex(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Problem library</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Java debugging problems</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Pick filters, press play, and jump straight into a bug. You can start on a random problem or just work through the current filtered set one by one.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex w-fit items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
          >
            Back home
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Category</label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-500"
              >
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(event) => setSelectedDifficulty(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-500"
              >
                {allDifficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Visible problems</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{filteredProblems.length}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Start solving</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={startRandomProblem}
                  disabled={filteredProblems.length === 0}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  ▶ Random
                </button>
                <button
                  type="button"
                  onClick={startFirstProblem}
                  disabled={filteredProblems.length === 0}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  Start all
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeProblem && (
          <ActiveProblemPanel
            problem={activeProblem}
            currentPosition={activeProblemIndex + 1}
            totalProblems={filteredProblems.length}
            onNext={goToNextProblem}
            onClear={clearActiveProblem}
          />
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            No problems match those filters.
          </div>
        )}
      </div>
    </div>
  );
}