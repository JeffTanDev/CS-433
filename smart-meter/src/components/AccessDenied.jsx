import React from "react";

// AccessDenied component displayed for unauthorized access
export const AccessDenied = () => {
    return (
        <>
            {/* Container with centered content */}
            <div className="d-flex align-items-center justify-content-center vh-100">
                {/* Content wrapper */}
                <div className="text-center">
                    {/* Display a large '403' indicating access denied */}
                    <h1 className="display-1 fw-bold">403</h1>
                    {/* Message indicating access denied */}
                    <p className="fs-3"> <span className="text-danger">Oops!</span> Access Denied.</p>
                    {/* Lead message with information on the need for authentication */}
                    <p className="lead">
                        Looks like you need to be logged in to access that page.
                    </p>
                    {/* Links to go home or navigate to the login page */}
                    <a href="/" className="btn btn-primary mx-1">Go Home</a>
                    <a href="/login" className="btn btn-primary mx-1">Login</a>
                </div>
            </div>
        </>
    );
};
