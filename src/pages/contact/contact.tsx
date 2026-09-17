import { useState } from "react";
import { Link } from "wouter";
import { APP_VERSION } from "../../version";

const ContactPage = () => {
  const [copied, setCopied] = useState(false);
  const email = "Abhiseck@outlook.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors group"
          >
            <span className="p-1 rounded bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </span>
            <span>Back to Playground</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
              v{APP_VERSION}
            </span>
            <a
              href="https://github.com/iamalipe/canvas-playground"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
              title="GitHub Repository"
            >
              <svg className="w-5 h-5 fill-current">
                <use href="/icons.svg#github-icon" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Section Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Creator Information
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
              Get in Touch
            </h1>
            <p className="text-neutral-400 text-base leading-relaxed">
              Have an idea for a canvas experiment, found a bug, or want to
              collaborate on algorithmic visualizers and games? Reach out!
            </p>
          </div>

          {/* Profile & Contact Details Card */}
          <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/50 backdrop-blur p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Abhiseck Bhattacharya
                </h2>
                <p className="text-sm text-neutral-400">
                  Developer & Creative Coding Explorer
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/iamalipe"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current">
                    <use href="/icons.svg#github-icon" />
                  </svg>
                  GitHub @iamalipe
                </a>
              </div>
            </div>

            {/* Direct Email Option */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Direct Email
              </label>
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="p-2 rounded-lg bg-neutral-900 text-indigo-400 border border-neutral-800">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="font-mono text-sm text-neutral-200 hover:text-indigo-400 transition-colors truncate"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                  >
                    {copied ? "Copied! ✓" : "Copy"}
                  </button>
                  <a
                    href={`mailto:${email}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>

            {/* Links and Channels */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Web & Projects
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://canvas.abhiseck.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-sm text-neutral-300 group-hover:text-white">
                      canvas.abhiseck.dev
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>

                <a
                  href="https://github.com/iamalipe/canvas-playground"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 fill-current text-neutral-400 group-hover:text-white">
                      <use href="/icons.svg#github-icon" />
                    </svg>
                    <span className="text-sm text-neutral-300 group-hover:text-white">
                      Source Repository
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Abhiseck Bhattacharya. Canvas Playground.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-neutral-300 transition-colors">
              Playground
            </Link>
            <span className="text-neutral-700">•</span>
            <span className="font-mono">v{APP_VERSION}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
