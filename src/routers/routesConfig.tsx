import { lazy } from 'react';
import DrugForm from '../components/CompoundForm/CompoundForm';

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
const ViewDrug = lazy(() => import("../components/Compound/ViewDrug"));
const SectionedViewDrug = lazy(() => import("../components/Compound/SectionedViewDrug"));
const BookMark = lazy(() => import("../components/Bookmark/BookMark"));
const DrugsList = lazy(() => import("../components/DrugsList/DrugsList"));
//const UniversalForm = lazy(() => import("../components/CompoundForm/UniversalForm"));

export const routesConfig = [
    { path: "/", element: <LandingPage /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/what-we-do", element: <WhatWeDo /> },
    { path: "/areas-served", element: <AreasServed /> },
    { path: "/about", element: <About /> },
    { path: "/contacts", element: <Contacts /> },
    { path: ":ccategory/:searchtext", element: <DrugsTable /> },
    // { path: ":ccategory/:searchtext/:cid/:version", element: <DrugViewer /> },
    { path: "/drug-form", element: <DrugForm /> },
    { path: "/bookmark", element: <BookMark /> },
    { path: "/drugsList", element: <DrugsList /> },
    { path: "/sampledrug", element: <SectionedViewDrug /> },
    { path: ":ccategory/:searchtext/:cid/:version", element: <ViewDrug /> },
    { path: "*", element: <NotFound /> }
];