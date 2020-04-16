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
    EmployeeItem as EmployeeItemView,
    ClientList as ClientListView,
    ClientItem as ClientItemView
} from './views'

const Routes = () => {
    return (
        <Switch>
            <Redirect exact from="/" to="/dashboard"/>

            <RouteWithLayout isAuth={false} component={LoginView} layout={MinimalLayout} path="/login" exact/>
            <RouteWithLayout isAuth={true} component={DashboardView} layout={MainLayout} path="/dashboard" exact/>

            <RouteWithLayout isAuth={true} component={ClientListView} layout={MainLayout} path="/clients" exact/>
            <RouteWithLayout isAuth={true} component={ClientItemView} layout={MainLayout} path="/client/:id" exact/>

            <RouteWithLayout isAuth={true} component={UserListView} layout={MainLayout} path="/users" exact/>

            <RouteWithLayout isAuth={true} component={EmployeeListView} layout={MainLayout} path="/employees" exact/>
            <RouteWithLayout isAuth={true} component={EmployeeItemView} layout={MainLayout} path="/employee" exact/>

            <RouteWithLayout isAuth={true} component={OrgNameView} layout={MainLayout} path="/org" exact/>
            <RouteWithLayout isAuth={true} component={NotFoundView} layout={MainLayout} path="/NotFound" exact/>

            <Redirect to="/NotFound" />
        </Switch>
    );
};

export default Routes;

