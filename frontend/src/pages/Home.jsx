import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import DealsBanner from "../components/DealsBanner";
import Products from "../components/Products";
import WhyChooseUs from "../components/WhyChooseUs";
import Farmers from "../components/Farmers";
import Footer from "../components/Footer";
import ExploreMap from "../components/ExploreMap";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Render the self-sufficient Navbar */}
            <Navbar />

            {/* Render the rest of your original landing page components */}
            <div className="max-w-7xl mx-auto px-6 space-y-10 mt-6 md:mt-10">
                <Hero />
                <Categories />
                <DealsBanner />
                <Products />
                <WhyChooseUs />
                <Farmers />
            </div>

            <ExploreMap />
            <Footer />
        </div>
    );
}