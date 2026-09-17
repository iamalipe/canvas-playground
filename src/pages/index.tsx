import { Router, Route, Switch, Link } from "wouter";
import LandingPage from "./landing-page/landing-page";
import ContactPage from "./contact/contact";
import Program1 from "./program1/program1";
import Program2 from "./program2/program2";

const NotFound = () => (
  <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
    <div className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 mb-4 font-mono text-sm">
      404 • Page Not Found
    </div>
    <h1 className="text-3xl font-bold text-white mb-2">Experiment Not Found</h1>
    <p className="text-neutral-400 text-sm max-w-md mb-6">
      The canvas program or page you requested does not exist or has moved.
    </p>
    <Link
      to="/"
      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
    >
      Return to Playground
    </Link>
  </div>
);

const MainRoute = () => {
  // Normalize base path for wouter (supports custom domain or repo subpath)
  const rawBase = import.meta.env.BASE_URL || "/";
  const base =
    rawBase === "./" || rawBase === "/" ? "" : rawBase.replace(/\/$/, "");

  return (
    <Router base={base}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/program1" component={Program1} />
        <Route path="/program2" component={Program2} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default MainRoute;
