"use client"; //this line is powerfull
import { scrapeAndStoreProduct } from "@/lib/actions";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmazonProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;

      if (
        hostname.includes("amazon.com") ||
        hostname.includes("amazon.") ||
        hostname.endsWith("amazon")
      )
        return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //e.preventDeafult()

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    // alert(isValidLink ? "Valid link" : "Invalid link");
    if (!isValidLink) return alert("Please provide a valid Amazon link");
    try {
      setIsLoading(true); // Scrap the product  page
      const productId = await scrapeAndStoreProduct(searchPrompt);
      console.log(productId);
      // const productId = await res?.json(); //extract from response//raj
      // const router = useRouter();
      // router.push(`/product/${productId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter product link"
        className="searchbar-input"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn"
        // disabled={isLoading ? true : false}
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
