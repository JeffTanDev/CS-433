export function Landing() {
    return (
        <>
            {/* Main container */}
            <div className="container">
                {/* Hero section */}
                <section className="hero text-center py-5">
                    <div className="container">
                        <h2>Welcome to Electrico</h2>
                        <p>Where your energy matters.</p>
                        <a href="/login" className="btn btn-primary">Join Now</a>
                    </div>
                </section>
            </div>
        </>
    );
}
