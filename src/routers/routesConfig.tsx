import { lazy } from 'react';

// Lazy load all components
const Login = lazy(() => import("../components/LoginPage"));
const Register = lazy(() => import("../components/RegisterPage"));
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contacts = lazy(() => import('../pages/Contacts'));
const ResultList = lazy(() => import('../components/Results/ResultList'));
const NotFound = lazy(() => import("../pages/NotFound"));
const UniversalCompoundRenderer = lazy(() => import("../components/Compound/shared/UniversalCompoundRenderer"));
const SearchHistory = lazy(() => import("../components/SearchHistory/SearchHistory"));
const DrugsList = lazy(() => import("../components/DrugsList/DrugsList"));

export const routesConfig=[
    {path:"/register",element:<Register />},
    {path:"/login",element:<Login />},
    {path:"/home",element:<Home />},
    {path:"/about",element:<About />},
    {path:"/contacts",element:<Contacts />},
    {path:":ccategory/:searchtext",element:<ResultList />},
    {path:":ccategory/:searchtext/:cid/:version",element:<UniversalCompoundRenderer />},
    {path:"/search-history",element:<SearchHistory />},
    {path:"/drugsList",element:<DrugsList />},
    {path:"*",element:<NotFound />}
]