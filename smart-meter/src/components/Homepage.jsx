import { Link } from 'react-router-dom';

export function Homepage() {
    return (
        <>
            <div className="container">
                <section className="hero text-center py-5">
                    <div className="container">
                        <h2>Welcome to Electrico</h2>
                        <p>Power your home the smart way</p>
                        <Link to="/usage" className="btn btn-primary">Go to usage</Link>
                        <Link to="/decryption" className="btn btn-primary">Company Billing</Link>
                        <Link to="/user/billing" className="btn btn-primary">Customer Billing</Link>
                    </div>
                </section>
            </div>
        </>
    );
}
