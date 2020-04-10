import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { RouteWithLayout } from './components';
import {
    Minimal as MinimalLayout,
    Main as MainLayout
} from './layouts';
import {
    Login as LoginView,
    NotFound as NotFoundView,
    UserList as UserListView,
    EmployeeList as EmployeeListView,
    OrgName as OrgNameView,
    Dashboard as DashboardView,
    EmployeeItem as EmployeeItemView
} from './views'

const Routes = () => {
    return (
        <Switch>
            <Redirect
                exact
                from="/"
                to="/dashboard"
            />
            <RouteWithLayout
                component={LoginView}
                layout={MinimalLayout}
                path="/login"
                exact
            />
            <RouteWithLayout
                layout={MainLayout}
                component={DashboardView}
                path="/dashboard"
                exact
            />
            <RouteWithLayout
                component={UserListView}
                exact
                layout={MainLayout}
                path="/users"
            />
            <RouteWithLayout
                component={EmployeeListView}
                exact
                layout={MainLayout}
                path="/employees"
            />
            <RouteWithLayout
                component={EmployeeItemView}
                exact
                layout={MainLayout}
                path="/employee"
            />
            <RouteWithLayout
                component={OrgNameView}
                exact
                layout={MainLayout}
                path="/org"
            />
            <RouteWithLayout
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                path="/not-found"
            />
            <Redirect to="/not-found" />
        </Switch>
    );
};

export default Routes;

