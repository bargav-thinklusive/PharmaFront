import Login from "../components/LoginPage";
import Home from '../pages/Home';
import About from '../pages/About';
import Contacts from '../pages/Contacts';
import ResultList from '../components/Results/ResultList';
import NotFound from "../pages/NotFound";
import CompoundInformation from "../components/Compound/CompoundInformation";

export const routesConfig=[
    {path:"/login",element:<Login />},
    {path:"/home",element:<Home />},
    {path:"/about",element:<About />},
    {path:"/contacts",element:<Contacts />},
    {path:":ccategory/:searchtext",element:<ResultList />},
    {path:":ccategory/:searchtext/:cid",element:<CompoundInformation />},
    {path:"*",element:<NotFound />}
]