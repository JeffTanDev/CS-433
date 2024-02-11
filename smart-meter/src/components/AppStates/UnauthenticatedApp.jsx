import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import components for different pages within the application
import { NotFound } from "../NotFound";
import { AccessDenied } from "../AccessDenied";
import { Landing } from "../Landing";
import { Login } from "../Login";
import { ResetPassword } from "../ResetPassword";
import { SignUp } from "../SignUp";
import { Layout } from "../Layout";
import UserBilling from "../Billing/UserBilling";
import EnterpriseBilling  from "../Billing/EnterpriseBilling";

// UnauthenticatedApp component representing the main application for unauthenticated users
export const UnauthenticatedApp = () => {
    return (
        <>
            <div className="App">
                {/* Set up React Router for client-side navigation */}
                <Router>
                    <Routes>
                        {/* Route for the main layout */}
                        <Route path="/" element={<Layout />}>
                            {/* Index route for the landing page */}
                            <Route index element={<Landing />} />

                            {/* Routes for various pages in the unauthenticated application ... add later <Route path="/profile" element={<accessDenied />} />*/}
                            <Route path="/home" element={<AccessDenied />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/reset" element={<ResetPassword />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/user/billing" element={<UserBilling />} />
                            <Route path="/enterprise/billing" element={<EnterpriseBilling />} />

                            {/* Route for handling 404 (Not Found) errors */}
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
        </>
    );
};
