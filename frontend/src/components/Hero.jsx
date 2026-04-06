export default function Hero() {
    return (
        <div className="grid md:grid-cols-2 gap-6 mt-6">

            {/* Left */}
            <div className="bg-green-600 text-white p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-4">
                    Reach Local farmer near you,
                    faster and Smarter!
                </h2>

                <p className="mb-6">
                    Order fresh vegetables directly from local farms.
                </p>

                <div className="space-x-3">
                    <button className="bg-blue-500 px-4 py-2 rounded-lg">
                        Order Now
                    </button>
                    <button className="border px-4 py-2 rounded-lg">
                        Pre-Order
                    </button>
                </div>
            </div>

            {/* Right */}
            <div className="bg-green-200 rounded-2xl flex items-center justify-center">
                <p className="text-lg font-semibold">Farm Near You (Map)</p>
            </div>
        </div>
    );
}