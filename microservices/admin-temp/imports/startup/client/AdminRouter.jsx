import React from "react";
// import { Route, Switch } from 'react-router-dom';

import BaseRouter, { Route, Switch } from "core/components/BaseRouter";
import NotFound from "core/components/NotFound";

import { getUserLocale, getFormats } from "core/utils/localization";
import {
    AdminLayout,
    AdminDashboardPage,
    UsersPage,
    LoansPage,
    // OfferPage,
    // SingleLoanPage,
    SingleUserPage
    // VerifyPage,
    // ContactLendersPage,
} from "core/containers/AdminContainers";
import AdminLoanContainer from "core/containers/AdminLoanContainer";

import messagesFR from "../../../lang/fr.json";

import SingleLoanPage from "../../ui/pages/SingleLoanPage";
import ContactLendersPage from "../../ui/pages/ContactLendersPage";
import OfferPage from "../../ui/pages/OfferPage";
import VerifyPage from "../../ui/pages/VerifyPage";
import AdminDevPage from "../../ui/pages/AdminDevPage";
import DevPage from "../../ui/pages/DevPage";
import LoansPageContainer from "../../ui/pages/LoansPage/LoansPageContainer";

const AdminRouter = props => (
    <BaseRouter
        locale={getUserLocale()}
        messages={messagesFR}
        formats={getFormats()}
    >
        <AdminLayout
            {...props}
            type="admin"
            render={layoutProps => (
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => <AdminDashboardPage {...layoutProps} />}
                    />
                    <Route
                        exact
                        path="/users"
                        render={() => <UsersPage {...layoutProps} />}
                    />
                    <Route
                        exact
                        path="/loans"
                        render={() => <LoansPageContainer {...layoutProps} />}
                    />
                    <Route
                        path="/loans/:loanId/verify"
                        component={AdminLoanContainer(VerifyPage)}
                    />
                    <Route
                        path="/loans/:loanId/contactlenders"
                        component={AdminLoanContainer(ContactLendersPage)}
                    />
                    <Route
                        path="/loans/:loanId/offers/:offerId"
                        component={AdminLoanContainer(OfferPage)}
                    />
                    <Route
                        path="/loans/:loanId"
                        component={AdminLoanContainer(SingleLoanPage)}
                    />
                    <Route path="/users/:userId" component={SingleUserPage} />
                    <Route
                        exact
                        path="/dev"
                        render={() => <AdminDevPage {...layoutProps} />}
                    />
                    <Route
                        path="/dev2"
                        render={() => <DevPage {...layoutProps} />}
                    />
                    <Route component={NotFound} />
                </Switch>
            )}
        />
    </BaseRouter>
);

export default AdminRouter;
