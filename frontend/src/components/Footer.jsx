export default function Footer() {
    return (
        <footer className="bg-green-600 text-white px-8 py-8 mt-10">

            <div className="grid md:grid-cols-5 gap-8">

                {/* LOGO + SOCIAL */}
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        🌱 Smart Farm
                    </h2>

                    <div className="flex gap-3 mt-4 text-sm">
                        <span>📸</span>
                        <span>❌</span>
                        <span>🔗</span>
                        <span>📘</span>
                    </div>

                    <p className="text-xs mt-4 opacity-80">
                        © Smart Farm Private Limited.
                    </p>
                </div>

                {/* CATEGORIES */}
                <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li>Fresh Vegetables</li>
                        <li>Fresh Fruits</li>
                        <li>Dairy & Farm Products</li>
                    </ul>
                </div>

                {/* QUICK LINKS */}
                <div>
                    <h3 className="font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li>Home</li>
                        <li>Browse Products</li>
                        <li>Track Order</li>
                        <li>Become a Seller</li>
                        <li>Offers and Discounts</li>
                    </ul>
                </div>

                {/* HELP */}
                <div>
                    <h3 className="font-semibold mb-3">Help & Support</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li>Contact us</li>
                        <li>FAQs</li>
                        <li>Return Policy</li>
                        <li>Terms & Condition</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                {/* DOWNLOAD APP */}
                <div>
                    <h3 className="font-semibold mb-3">Download App!</h3>

                    <div className="space-y-3">
                        <button className="bg-green-700 border border-white px-4 py-2 rounded-lg w-full flex items-center justify-start gap-3 hover:bg-green-800 transition">
                            <svg viewBox="0 0 512 512" className="w-[20px] h-[20px] shrink-0">
                                <path fill="#fbc02d" d="M110.8 19.3L409 190.2l-86.7 86.7-211.5-211.5z" />
                                <path fill="#f44336" d="M409 190.2l84.4 48.3c15.7 9 15.7 31.6 0 40.6l-84.4 48.3-86.7-86.7 86.7-86.5z" />
                                <path fill="#4caf50" d="M409 327.4L110.8 498.3c-15.3 8.8-34.6-2.3-34.6-19.9v-69.3l246.1-246.2z" />
                                <path fill="#2196f3" d="M76.2 409.1V108.5c0-18.7 21-29.4 35.8-18.2l210.3 210.3-246.1 108.5z" />
                            </svg>
                            <div className="text-left leading-none">
                                <span className="block text-[9px] uppercase tracking-wide opacity-90 mb-0.5">Get it on</span>
                                <span className="block font-semibold text-[13px]">Google Play</span>
                            </div>
                        </button>

                        <button className="bg-green-700 border border-white px-4 py-2 rounded-lg w-full flex items-center justify-start gap-3 hover:bg-green-800 transition">
                            <svg viewBox="0 0 384 512" fill="white" className="w-[20px] h-[20px] shrink-0">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                            </svg>
                            <div className="text-left leading-none">
                                <span className="block text-[9px] uppercase tracking-wide opacity-90 mb-0.5">Download on the</span>
                                <span className="block font-semibold text-[13px]">App Store</span>
                            </div>
                        </button>
                    </div>
                </div>

            </div>

        </footer>
    );
}