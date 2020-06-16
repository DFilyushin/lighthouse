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
    ClientItem as ClientItemView,
    Products as ProductsView,
    ProductItem as ProductItemView,
    Raws as RawsView,
    RawItem as RawItemView,
    Formulas as FormulaView,
    FormulaItem as FormulaItemView,
    Tares as TareView,
    TareItem as TareItemView,
    Units as UnitView,
    UnitItem as UnitItemView,
    Staffs as StaffView,
    StaffItem as StaffItemView,
    ProductionList as ProductionListView,
    FactoryLine as FactoryLineView,
    FactoryLineItem as FactoryLineItemView,
    ProductionDetails as ProductionDetailsView,
    DepartmentList as DepartmentListView,
    DepartmentItem as DepartmentItemView,
    About as AboutView,
    Changelog as ChangelogView,
    Setup as SetupView,
    ContractList as ContractListView,
    ContractItem as ContractItemView,
    CostList as CostListView,
    CostItem as CostItemView
} from './views'

const Routes = () => {

    return (
        <Switch>
            <Redirect exact from="/" to="/dashboard"/>

            <RouteWithLayout isAuth={false} component={LoginView} layout={MinimalLayout} path="/login" exact/>
            <RouteWithLayout isAuth={true} component={DashboardView} layout={MainLayout} path="/dashboard" exact/>

            <RouteWithLayout isAuth={true} component={ClientListView} layout={MainLayout} path="/clients" exact/>
            <RouteWithLayout isAuth={true} component={ClientItemView} layout={MainLayout} path="/client/:id" exact/>

            <RouteWithLayout isAuth={true} component={ContractListView} layout={MainLayout} path="/contracts" exact/>
            <RouteWithLayout isAuth={true} component={ContractItemView} layout={MainLayout} path="/contracts/:id" exact/>

            <RouteWithLayout isAuth={true} component={UserListView} layout={MainLayout} path="/users" exact/>

            <RouteWithLayout isAuth={true} component={CostListView} layout={MainLayout} path="/catalogs/cost" exact/>
            <RouteWithLayout isAuth={true} component={CostItemView} layout={MainLayout} path="/catalogs/cost/:id" exact/>


            <RouteWithLayout isAuth={true} component={ProductsView} layout={MainLayout} path="/catalogs/product" exact/>
            <RouteWithLayout isAuth={true} component={ProductItemView} layout={MainLayout} path="/catalogs/product/:id" exact/>

            <RouteWithLayout isAuth={true} component={FormulaView} layout={MainLayout} path="/catalogs/formula" exact/>
            <RouteWithLayout isAuth={true} component={FormulaItemView} layout={MainLayout} path="/catalogs/formula/:id" exact/>

            <RouteWithLayout isAuth={true} component={TareView} layout={MainLayout} path="/catalogs/tare" exact/>
            <RouteWithLayout isAuth={true} component={TareItemView} layout={MainLayout} path="/catalogs/tare/:id" exact/>

            <RouteWithLayout isAuth={true} component={RawsView} layout={MainLayout} path="/catalogs/raw" exact/>
            <RouteWithLayout isAuth={true} component={RawItemView} layout={MainLayout} path="/catalogs/raw/:id" exact/>

            <RouteWithLayout isAuth={true} component={UnitView} layout={MainLayout} path="/catalogs/units" exact/>
            <RouteWithLayout isAuth={true} component={UnitItemView} layout={MainLayout} path="/catalogs/units/:id" exact/>

            <RouteWithLayout isAuth={true} component={StaffView} layout={MainLayout} path="/org/staff" exact/>
            <RouteWithLayout isAuth={true} component={StaffItemView} layout={MainLayout} path="/org/staff/:id" exact/>

            <RouteWithLayout isAuth={true} component={EmployeeListView} layout={MainLayout} path="/org/employee" exact/>
            <RouteWithLayout isAuth={true} component={EmployeeItemView} layout={MainLayout} path="/org/employee/:id" exact/>
            <RouteWithLayout isAuth={true} component={OrgNameView} layout={MainLayout} path="/org/requisite" exact/>
            <RouteWithLayout isAuth={true} component={DepartmentListView} layout={MainLayout} path="/org/structure" exact/>
            <RouteWithLayout isAuth={true} component={DepartmentItemView} layout={MainLayout} path="/org/structure/:id" exact/>

            <RouteWithLayout isAuth={true} layout={MainLayout} component={FactoryLineView} path="/catalogs/lines" exact/>
            <RouteWithLayout isAuth={true} layout={MainLayout} component={FactoryLineItemView} path="/catalogs/lines/:id" exact/>

            <RouteWithLayout isAuth={true} layout={MainLayout} component={ProductionListView} path="/factory" exact/>
            <RouteWithLayout isAuth={true} layout={MainLayout} component={ProductionDetailsView} path="/factory/:id" exact/>

            <RouteWithLayout isAuth={true} component={AboutView} layout={MainLayout} path="/about" exact/>
            <RouteWithLayout isAuth={true} component={ChangelogView} layout={MainLayout} path="/changelog" exact/>
            <RouteWithLayout isAuth={true} component={SetupView} layout={MainLayout} path="/setup" exact/>

            <RouteWithLayout isAuth={true} component={NotFoundView} layout={MainLayout} path="/NotFound" exact/>

            <Redirect to="/NotFound" />
        </Switch>
    );
};

export default Routes;

