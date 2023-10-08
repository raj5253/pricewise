import Image from "next/image";
import React from "react";
import Searchbar from "@/components/Searchbar";
import HeroCarousel from "@/components/HeroCarousel";
import { getAllProducts } from "@/lib/actions";
import ProductCard from "@/components/ProductCard";

const Home = async () => {
  const allProducts = await getAllProducts(); //this added after db done for products
  return (
    <>
      <section className="px-6 md:px-20 border-2 py-24 border-red-500">
        <div className="flex max-xl:flex-col gap-16">
          {/* divices with maxwidth to xl(1200px): flex-col. 1unit in tailwind = 4px = (1/4)rem=  0.25rem*/}
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="➡️"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text">
              Unleash the Power of{" "}
              <span className="text-primary">PriceWise</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more!
            </p>
            {/* searchbar */}
            <Searchbar />
          </div>
          {/* HeroCarousel */}
          <HeroCarousel />
        </div>
      </section>

      {/* trending  items section */}
      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {/* {["Apple Iphone 16", "Book", "Sneakers"].map((product) => (
            <div>{product}</div>
          ))} */}
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
