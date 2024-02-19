import { Link } from 'react-router-dom';

export function Homepage() {
    return (
        <>
            <div className="container">
                <section className="hero text-center py-5">
                    <div className="container">
                        <h2>Welcome to Electrico</h2>
                        <p>Power your home the smart way</p>
                        <Link to="/user/billing" className="btn btn-primary">Go to Billing</Link>
                    </div>
                </section>
            </div>
        </>
    );
}
