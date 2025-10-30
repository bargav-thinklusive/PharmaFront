import Login from "../components/LoginPage";
import Register from "../components/RegisterPage";
import Home from '../pages/Home';
import About from '../pages/About';
import Contacts from '../pages/Contacts';
import ResultList from '../components/Results/ResultList';
import NotFound from "../pages/NotFound";
import UniversalCompoundRenderer from "../components/Compound/shared/UniversalCompoundRenderer";
import SearchHistory from "../components/SearchHistory/SearchHistory";

export const routesConfig=[
    {path:"/register",element:<Register />},
    {path:"/login",element:<Login />},
    {path:"/home",element:<Home />},
    {path:"/about",element:<About />},
    {path:"/contacts",element:<Contacts />},
    {path:":ccategory/:searchtext",element:<ResultList />},
    {path:":ccategory/:searchtext/:cid/:version",element:<UniversalCompoundRenderer />},
    {path:"/search-history/:searchtext",element:<SearchHistory />},
    {path:"*",element:<NotFound />}
]