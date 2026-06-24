import { lazy } from 'react';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import PublicOnlyRoute from '../components/shared/PublicOnlyRoute';

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
const Unauthorized = lazy(() => import("../components/pages/Unauthorized"));
const DrugForm = lazy(() => import("../components/CompoundForm/CompoundForm"));
const SectionedViewDrug = lazy(() => import("../components/Compound/SectionedViewDrug"));
const BookMark = lazy(() => import("../components/Bookmark/BookMark"));
const DrugsList = lazy(() => import("../components/DrugsList/DrugsList"));
const DrugPreview = lazy(() => import("../components/DrugPreview/DrugPreview"));
const UsersTable = lazy(() => import("../components/UserTable/UsersTable"));

// Helper to wrap with ProtectedRoute (authenticated users only)
const protect = (element: React.ReactNode) => (
    <ProtectedRoute>{element}</ProtectedRoute>
);

// Helper to wrap with ProtectedRoute + role restriction
const protectWithRoles = (roles: string[], element: React.ReactNode) => (
    <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>
);

// Helper to wrap with PublicOnlyRoute (redirects logged-in users to /home)
const publicOnly = (element: React.ReactNode) => (
    <PublicOnlyRoute>{element}</PublicOnlyRoute>
);

export const routesConfig = [
    // ── Pre-login only routes (logged-in users → redirected to /home) ──────────
    { path: "/",              element: publicOnly(<LandingPage />) },
    { path: "/register",      element: publicOnly(<Register />) },
    { path: "/login",         element: publicOnly(<Login />) },
    { path: "/what-we-do",    element: publicOnly(<WhatWeDo />) },
    { path: "/areas-served",  element: publicOnly(<AreasServed />) },

    // ── Open routes – accessible to everyone (before AND after login) ───────────
    { path: "/about",         element: <About /> },
    { path: "/contacts",      element: <Contacts /> },
    { path: "/unauthorized",  element: <Unauthorized /> },

    // ── Authenticated routes (any logged-in user) ──────────────────────────────
    { path: "/home",                                    element: protect(<Home />) },
    { path: "/bookmark",                                element: protect(<BookMark />) },
    { path: ":ccategory/:searchtext",                   element: protect(<DrugsTable />) },
    { path: ":ccategory/:searchtext/:cid/:version",     element: protect(<SectionedViewDrug />) },
    { path: "/drug-preview",                            element: protect(<DrugPreview />) },

    // ── Editor + Admin routes ──────────────────────────────────────────────────
    { path: "/drug-form",     element: protectWithRoles(["editor", "admin"], <DrugForm />) },
    { path: "/drugsList",     element: protectWithRoles(["editor", "admin"], <DrugsList />) },

    // ── Admin-only routes ──────────────────────────────────────────────────────
    { path: "/admin",         element: protectWithRoles(["admin"], <UsersTable />) },

    // ── Catch-all ──────────────────────────────────────────────────────────────
    { path: "*", element: <NotFound /> },
];