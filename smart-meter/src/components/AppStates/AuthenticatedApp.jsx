import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import components for different pages within the application
import { Layout } from "../Layout";
import { Landing } from "../Landing";
import { Homepage } from "../Homepage";
import { Login } from "../Login";
import { ResetPassword } from "../ResetPassword";
import { SignUp } from "../SignUp";
import { Profile } from "../Profile";
import { NotFound } from "../NotFound";
import UserBilling from "../Billing/UserBilling";
//import { EnterpriseBilling } from "../Billing/EnterpriseBilling";

// AuthenticatedApp component representing the main application for authenticated users
export const AuthenticatedApp = () => {
    return (
        <>
            <div className="App content-wrap">
                {/* Set up React Router for client-side navigation */}
                <Router>
                    <Routes>
                        {/* Route for the main layout */}
                        <Route path="/" element={<Layout />}>
                            {/* Index route for the landing page */}
                            <Route index element={<Landing />} />

                            {/* Routes for various pages in the authenticated application*/}
                            <Route path="/home" element={<Homepage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/reset" element={<ResetPassword />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* Add route for user's billing page */}
                            <Route path="/user/billing" element={<UserBilling />} />
                            {/* Add route for enterprise's billing page */}
                            {/*<Route path="/enterprise/billing" element={<EnterpriseBilling />} />*/}

                            {/* Route for handling 404 (Not Found) errors */}
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
        </>
    );
};
