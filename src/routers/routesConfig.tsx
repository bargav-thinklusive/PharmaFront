import { lazy } from 'react';
import ProtectedRoute from '../components/shared/ProtectedRoute';

// Lazy load all components
const Login = lazy(() => import("../components/pages/auth/LoginPage"));
const Register = lazy(() => import("../components/pages/auth/RegisterPage"));
const Home = lazy(() => import('../components/pages/Home'));
const LandingPage = lazy(() => import('../components/pages/LandingPage'));
const WhatWeDo = lazy(() => import('../components/pages/WhatWeDo'));
const AreasServed = lazy(() => import('../components/pages/AreasServed'));
const About = lazy(() => import('../components/pages/About'));
const Contacts = lazy(() => import('../components/pages/Contacts'));
const DrugsTable = lazy(() => import('../components/DrugTable/DrugsTable'));
const NotFound = lazy(() => import("../components/pages/NotFound"));
const DrugForm = lazy(() => import("../components/CompoundForm/CompoundForm"));
const SectionedViewDrug = lazy(() => import("../components/Compound/SectionedViewDrug"));
const BookMark = lazy(() => import("../components/Bookmark/BookMark"));
const DrugsList = lazy(() => import("../components/DrugsList/DrugsList"));

// Helper to wrap with ProtectedRoute
const protect = (element: React.ReactNode) => (
    <ProtectedRoute>{element}</ProtectedRoute>
);

export const routesConfig = [
    // ── Public routes ─────────────────────────────────────────────────────────
    { path: "/",              element: <LandingPage /> },
    { path: "/register",      element: <Register /> },
    { path: "/login",         element: <Login /> },
    { path: "/what-we-do",    element: <WhatWeDo /> },
    { path: "/areas-served",  element: <AreasServed /> },
    { path: "/about",         element: <About /> },
    { path: "/contacts",      element: <Contacts /> },

    // ── Protected routes (login required) ─────────────────────────────────────
    { path: "/home",                                    element: protect(<Home />) },
    { path: "/drug-form",                               element: protect(<DrugForm />) },
    { path: "/bookmark",                                element: protect(<BookMark />) },
    { path: "/drugsList",                               element: protect(<DrugsList />) },
    { path: ":ccategory/:searchtext",                   element: protect(<DrugsTable />) },
    { path: ":ccategory/:searchtext/:cid/:version",     element: protect(<SectionedViewDrug />) },

    // ── Fallback ───────────────────────────────────────────────────────────────
    { path: "*", element: <NotFound /> },
];