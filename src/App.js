import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { renderRoutes } from 'react-router-config';
import routes from './js/routes';
import CombinedContext from './js/context/AppContext'

const App = () => {
    return (
        <CombinedContext>
            <Router>
                <div className="d-flex flex-column"style={{flex:1, height:'100vh',width:'100vw'}}>          
                    <NavbarContainer/>
                    <Switch>
                        {renderRoutes(routes)}
                    </Switch>
                </div>
            </Router>
        </CombinedContext>
    );
};

export default App;



