import React from 'react';
import { Route } from 'react-router-dom';

interface IRouteWithLayout {
    layout: any;
    component: any;
    exact?: boolean;
    path?: string;
}

const RouteWithLayout = (props: IRouteWithLayout) => {
    const { layout: Layout, component: Component, ...rest } = props;

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
};

export default RouteWithLayout;
