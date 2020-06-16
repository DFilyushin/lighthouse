import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthenticationService from 'services/Authentication.service'

interface IRouteWithLayout {
    isAuth: boolean,
    layout: any,
    component: any,
    exact?: boolean
    path?: string
}

const RouteWithLayout = (props: IRouteWithLayout) => {
    const { isAuth, layout: Layout, component: Component, ...rest } = props;


    if (isAuth && !AuthenticationService.isAuthenticated())
         return <Redirect to="/login"/>

    if ((isAuth && AuthenticationService.isAuthenticated()) || (!isAuth)) {
        return (
            <Route
                {...rest}
                render={matchProps => (
                    <Layout>
                        <Component {...matchProps} />
                    </Layout>
                )}
            />
        );
    }
    return null
};

export default RouteWithLayout;
