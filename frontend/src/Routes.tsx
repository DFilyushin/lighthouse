import React from 'react';
import {Redirect, Switch} from 'react-router-dom';
import {AuthRouteWithLayout, RouteWithLayout} from './components';
import {Main as MainLayout, Minimal as MinimalLayout} from './layouts';
import {
    About as AboutView,
    Changelog as ChangelogView,
    ClientItem as ClientItemView,
    ClientList as ClientListView,
    ContractItem as ContractItemView,
    ContractList as ContractListView,
    CostItem as CostItemView,
    CostList as CostListView,
    Dashboard as DashboardView,
    DepartmentItem as DepartmentItemView,
    DepartmentList as DepartmentListView,
    EmployeeItem as EmployeeItemView,
    EmployeeList as EmployeeListView,
    ExpenseList as ExpenseListView,
    FactoryLine as FactoryLineView,
    FactoryLineItem as FactoryLineItemView,
    FormulaItem as FormulaItemView,
    Formulas as FormulaView,
    Login as LoginView,
    NotFound as NotFoundView,
    OrgName as OrgNameView,
    ProductionDetails as ProductionDetailsView,
    ProductionList as ProductionListView,
    ProductItem as ProductItemView,
    Products as ProductsView,
    RawItem as RawItemView,
    Raws as RawsView,
    ReportContracts as ReportContractsView,
    ReportProduction as ReportProductionView,
    ReportSales as ReportSalesView,
    Setup as SetupView,
    StaffItem as StaffItemView,
    Staffs as StaffView,
    StoreProduct as StoreProductView,
    StoreRaw as StoreRawView,
    TareItem as TareItemView,
    Tares as TareView,
    UnitItem as UnitItemView,
    Units as UnitView,
    UserDetails as UserDetailsView,
    UserList as UserListView,
    WorkList as WorkListView,
    WorkItem as WorkItemView
} from './views'
import {AccessGroups} from "./utils/AppConst";

const Routes = () => {

    return (
        <Switch>
            <Redirect exact from="/" to="/dashboard"/>

            <RouteWithLayout component={LoginView} layout={MinimalLayout} path="/login" exact/>
            <AuthRouteWithLayout component={DashboardView} layout={MainLayout} path="/dashboard" access={[AccessGroups.ALL]} exact/>

            <AuthRouteWithLayout component={ClientListView} layout={MainLayout} path="/clients" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={ClientItemView} layout={MainLayout} path="/client/:id" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>

            <AuthRouteWithLayout component={ContractListView} layout={MainLayout} path="/contracts" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={ContractItemView} layout={MainLayout} path="/contracts/:id" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>

            //пользователи
            <AuthRouteWithLayout component={UserListView} layout={MainLayout} path="/admin/users" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={UserDetailsView} layout={MainLayout} path="/admin/users/:user" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={CostListView} layout={MainLayout} path="/catalogs/cost" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={CostItemView} layout={MainLayout} path="/catalogs/cost/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={ExpenseListView} layout={MainLayout} path="/expense" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={ProductsView} layout={MainLayout} path="/catalogs/product" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={ProductItemView} layout={MainLayout} path="/catalogs/product/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={FormulaView} layout={MainLayout} path="/catalogs/formula" access={[AccessGroups.ADMIN, AccessGroups.BOSS, AccessGroups.TECHNOLOGIST]} exact/>
            <AuthRouteWithLayout component={FormulaItemView} layout={MainLayout} path="/catalogs/formula/:id" access={[AccessGroups.ADMIN, AccessGroups.BOSS, AccessGroups.TECHNOLOGIST]} exact/>

            <AuthRouteWithLayout component={TareView} layout={MainLayout} path="/catalogs/tare" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={TareItemView} layout={MainLayout} path="/catalogs/tare/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={RawsView} layout={MainLayout} path="/catalogs/raw" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={RawItemView} layout={MainLayout} path="/catalogs/raw/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={UnitView} layout={MainLayout} path="/catalogs/units" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={UnitItemView} layout={MainLayout} path="/catalogs/units/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={WorkListView} layout={MainLayout} path="/catalogs/works" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={WorkItemView} layout={MainLayout} path="/catalogs/works/:id" access={[AccessGroups.ADMIN]} exact/>


            <AuthRouteWithLayout component={StaffView} layout={MainLayout} path="/org/staff" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={StaffItemView} layout={MainLayout} path="/org/staff/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={EmployeeListView} layout={MainLayout} path="/org/employee" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={EmployeeItemView} layout={MainLayout} path="/org/employee/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={OrgNameView} layout={MainLayout} path="/org/requisite" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={DepartmentListView} layout={MainLayout} path="/org/structure" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={DepartmentItemView} layout={MainLayout} path="/org/structure/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={FactoryLineView} layout={MainLayout} path="/catalogs/lines" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={FactoryLineItemView} layout={MainLayout} path="/catalogs/lines/:id" access={[AccessGroups.ADMIN]} exact/>

            //производство
            <AuthRouteWithLayout component={ProductionListView} layout={MainLayout} path="/factory" access={[AccessGroups.FACTORY, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={ProductionDetailsView} layout={MainLayout} path="/factory/:id" access={[AccessGroups.FACTORY, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>

            <AuthRouteWithLayout  component={StoreRawView} layout={MainLayout}  path="/store/raw" access={[AccessGroups.ALL]} exact/>
            <AuthRouteWithLayout component={StoreProductView} layout={MainLayout} path="/store/product" access={[AccessGroups.ALL]} exact/>

            //отчётность
            <AuthRouteWithLayout component={ReportContractsView} layout={MainLayout} path="/report/contracts" access={[AccessGroups.BOSS, AccessGroups.REPORT, AccessGroups.MANAGER]} exact/>
            <AuthRouteWithLayout component={ReportProductionView} layout={MainLayout} path="/report/production" access={[AccessGroups.BOSS, AccessGroups.REPORT, AccessGroups.FACTORY]} exact/>
            <AuthRouteWithLayout component={ReportSalesView} layout={MainLayout} path="/report/sales" access={[AccessGroups.BOSS, AccessGroups.REPORT, AccessGroups.MANAGER]} exact/>

            //о программе и настройки
            <RouteWithLayout component={AboutView} layout={MainLayout} path="/about"  exact/>
            <RouteWithLayout component={ChangelogView} layout={MainLayout} path="/changelog" exact/>
            <AuthRouteWithLayout component={SetupView} layout={MainLayout} path="/setup" access={[AccessGroups.ALL]} exact/>

            <RouteWithLayout component={NotFoundView} layout={MainLayout} path="/NotFound" exact/>

            <Redirect to="/NotFound" />
        </Switch>
    );
};

export default Routes;

