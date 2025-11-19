import { lazy } from 'react';

// Lazy load all components
const Login = lazy(() => import("../components/LoginPage"));
const Register = lazy(() => import("../components/RegisterPage"));
const Home = lazy(() => import('../pages/Home'));
const Home1 = lazy(() => import('../pages/Home1'));
const WhatWeDo = lazy(() => import('../pages/WhatWeDo'));
const AreasServed = lazy(() => import('../pages/AreasServed'));
const About = lazy(() => import('../pages/About'));
const Contacts = lazy(() => import('../pages/Contacts'));
const ResultList = lazy(() => import('../components/Results/ResultList'));
const NotFound = lazy(() => import("../pages/NotFound"));
const UniversalCompoundRenderer = lazy(() => import("../components/Compound/shared/UniversalCompoundRenderer"));
const BookMark = lazy(() => import("../components/Bookmark/BookMark"));
const DrugsList = lazy(() => import("../components/DrugsList/DrugsList"));
const UniversalForm=lazy(()=>import("../components/CompoundForm/UniversalForm"))

export const routesConfig=[
    {path:"/",element:<Home1 />},
    {path:"/register",element:<Register />},
    {path:"/login",element:<Login />},
    {path:"/home",element:<Home />},
    {path:"/what-we-do",element:<WhatWeDo />},
    {path:"/areas-served",element:<AreasServed />},
    {path:"/about",element:<About />},
    {path:"/contacts",element:<Contacts />},
    {path:":ccategory/:searchtext",element:<ResultList />},
    {path:":ccategory/:searchtext/:cid/:version",element:<UniversalCompoundRenderer />},
    {path:"/drug-form",element:<UniversalForm />},
    {path:"/bookmark",element:<BookMark />},
    {path:"/drugsList",element:<DrugsList />},
    {path:"*",element:<NotFound />}
]