import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthenticationService from 'services/Authentication.service'
import {AccessGroups} from "../../utils/AppConst";

interface IRouteWithLayout {
    isAuth: boolean;
    layout: any;
    component: any;
    exact?: boolean;
    path?: string;
    access: AccessGroups[]
}

const AuthRouteWithLayout = (props: IRouteWithLayout) => {
    const { isAuth, layout: Layout, component: Component, access, ...rest } = props;
    const isAuthenticated = AuthenticationService.isAuthenticated()

    if (isAuth && !isAuthenticated)
         return <Redirect to="/login"/>

    const hasAccess = AuthenticationService.hasGroup(access)
    console.log('AccessToRouteWithLayout', hasAccess)

    if ((isAuth && isAuthenticated) || (!isAuth)) {
        if (hasAccess) {
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
        else{
            return <Redirect to={{ pathname: '/'}} />;
        }
    }
    return null
};

export default AuthRouteWithLayout;
