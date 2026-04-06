import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import problems from '../json/problems.json';

const allCategories = ['All', ...new Set(problems.map((problem) => problem.category))];
const allDifficulties = ['All', ...new Set(problems.map((problem) => problem.difficulty))];

function parseTimeLimitToSeconds(timeLimit) {
  if (!timeLimit || typeof timeLimit !== 'string') {
    return 120;
  }

  const [minutes = '0', seconds = '0'] = timeLimit.split(':');
  return Number(minutes) * 60 + Number(seconds);
}

function formatTime(secondsLeft) {
  const safeSeconds = Math.max(0, secondsLeft);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
  const seconds = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function Practice() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [problemIndex, setProblemIndex] = useState(null);
  const [bugGuess, setBugGuess] = useState('');
  const [fixAttempt, setFixAttempt] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);
  const [showBugReveal, setShowBugReveal] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      return matchesCategory && matchesDifficulty;
    });
  }, [selectedCategory, selectedDifficulty]);

  const activeProblem = problemIndex !== null ? filteredProblems[problemIndex] : null;

  useEffect(() => {
    if (filteredProblems.length === 0) {
      setProblemIndex(null);
      setHasStarted(false);
      setHasExpired(false);
      setSecondsLeft(0);
      return;
    }

    if (problemIndex !== null && problemIndex > filteredProblems.length - 1) {
      setProblemIndex(0);
    }
  }, [filteredProblems, problemIndex]);

  useEffect(() => {
    if (!activeProblem) {
      return;
    }

    setBugGuess('');
    setFixAttempt(activeProblem.code);
    setHasExpired(false);
    setShowBugReveal(false);
    setShowExplanation(false);
    setSecondsLeft(parseTimeLimitToSeconds(activeProblem.timeLimit));
  }, [activeProblem]);

  useEffect(() => {
    if (!hasStarted || !activeProblem || hasExpired) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setHasExpired(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [hasStarted, activeProblem, hasExpired]);

  const startRandomProblem = () => {
    if (filteredProblems.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    setProblemIndex(randomIndex);
    setHasStarted(true);
  };

  const startFirstProblem = () => {
    if (filteredProblems.length === 0) {
      return;
    }

    setProblemIndex(0);
    setHasStarted(true);
  };

  const nextProblem = () => {
    if (filteredProblems.length === 0) {
      return;
    }

    const nextIndex = problemIndex === null ? 0 : (problemIndex + 1) % filteredProblems.length;
    setProblemIndex(nextIndex);
    setHasStarted(true);
  };

  const resetSession = () => {
    setProblemIndex(null);
    setHasStarted(false);
    setHasExpired(false);
    setShowBugReveal(false);
    setShowExplanation(false);
    setSecondsLeft(0);
    setBugGuess('');
    setFixAttempt('');
  };

  const revealBug = () => {
    setShowBugReveal(true);
  };

  const toggleExplanation = () => {
    setShowExplanation((current) => !current);
  };

  const timerPercentage = activeProblem
    ? (secondsLeft / parseTimeLimitToSeconds(activeProblem.timeLimit)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Practice mode</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Blind Java debugging drills</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Start a problem and work from the code alone. Think through the bug yourself, write your diagnosis, and optionally draft a fix.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
            >
              Back home
            </Link>
            <Link
              to="/problems"
              className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
            >
              Problem library
            </Link>
          </div>
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
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Available drills</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{filteredProblems.length}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Start</div>
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

        {activeProblem ? (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Current drill</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Debug drill</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Read the code carefully, determine the bug on your own, and write your reasoning before moving on.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {activeProblem.difficulty}
                </span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                  {activeProblem.category}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {activeProblem.timeLimit}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Timer</div>
                  <div className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-950">
                    {formatTime(secondsLeft)}
                  </div>
                </div>
                <div className="text-right text-sm text-slate-600">
                  {hasExpired ? 'Time is up. Review your thinking and continue.' : 'Solve before the timer ends.'}
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                    hasExpired ? 'bg-red-500' : 'bg-sky-600'
                  }`}
                  style={{ width: `${Math.max(0, timerPercentage)}%` }}
                />
              </div>
            </div>

            <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-100">
              <code>{activeProblem.code}</code>
            </pre>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  What do you think the bug is?
                </label>
                <textarea
                  value={bugGuess}
                  onChange={(event) => setBugGuess(event.target.value)}
                  placeholder="Write your diagnosis here..."
                  className="mt-3 min-h-[180px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Bonus: draft your fix
                </label>
                <textarea
                  value={fixAttempt}
                  onChange={(event) => setFixAttempt(event.target.value)}
                  className="mt-3 min-h-[180px] w-full rounded-2xl border border-slate-300 bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={revealBug}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
              >
                Reveal bug
              </button>
              <button
                type="button"
                onClick={nextProblem}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Next problem
              </button>
              <button
                type="button"
                onClick={resetSession}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
              >
                End session
              </button>
            </div>
            {showBugReveal && (
              <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Bug reveal</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {activeProblem.title}
                </p>

                <button
                  type="button"
                  onClick={toggleExplanation}
                  className="mt-4 rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 transition hover:border-sky-500 hover:text-sky-900"
                >
                  {showExplanation ? 'Hide explanation' : 'Explain >'}
                </button>

                {showExplanation && (
                  <div className="mt-4 rounded-2xl border border-sky-100 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Explanation</div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {activeProblem.explanation || 'No explanation available yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Ready to practice</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Choose filters and start a drill</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Practice mode hides the explanation and lets you work from the code itself. Start random for a surprise rep or start all to move through the filtered set in order.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}