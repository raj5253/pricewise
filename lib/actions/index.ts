"use server" //this file willbe server side

import { revalidatePath } from "next/cache";
import Product from "../models/product.models";
import { scrapeAmazonProduct } from "../scraper"
import { connectToDB } from "../scraper/mongoose"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../scraper/utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { NextResponse } from "next/server";

export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) return;
    try {
        connectToDB();

        const scrapedProduct = await scrapeAmazonProduct(productUrl)
        if (!scrapedProduct) return;

        let product = scrapedProduct

        // check if the product is already stored. In that record/document add current searched price
        const existingProduct = await Product.findOne({ url: scrapedProduct.url })

        if (existingProduct) {
            const updatePriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ]
            product = {
                ...scrapedProduct,
                priceHistory: updatePriceHistory, //Type 'any[]' is not assignable to type 'never[]'
                lowestPrice: getLowestPrice(updatePriceHistory),
                highestPrice: getHighestPrice(updatePriceHistory),
                averagePrice: getAveragePrice(updatePriceHistory),
            }
        }

        const newProduct = await Product.findOneAndUpdate({
            url: scrapedProduct.url
        }, product, { upsert: true, new: true }) //upsert => if not present,create one

        revalidatePath(`/products/${newProduct._id}`) //on update this page changes

        // return NextResponse.json({
        //     productId: newProduct._id  //Don't uncomment it! error
        // })                             //return id , to navigate to productDetail

    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

// get product details for the product page
export async function getProductById(productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({ _id: productId });

        if (!product) return null;
        return product;
    } catch (error: any) {
        console.log("error :: getproductbyId ::", error.message)
    }
}

// get all product to display on landing(home)page
export async function getAllProducts() {
    try {
        connectToDB();
        const products = await Product.find();
        return products;
    } catch (error: any) {
        console.log("error:: getAllProducts::", error.message)
    }
}

// get similar products do display on productDetails page
export async function getSimilarProducts(productId: string) {
    try {
        connectToDB();

        const currentProduct = await Product.findById(productId);

        if (!currentProduct) return null;

        const similarProducts = await Product.find({ _id: { $ne: productId } }).limit(3); //you need to update this

        return similarProducts;
    } catch (error) {

    }
}

// add user Email to product when he sends enters mail in modal
export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Product.findById(productId);
        if (!product) return;

        const userExists = product.users.some((user: User) => user.email === userEmail);

        if (!userExists) {
            product.users.push({ email: userEmail })
            await product.save();

            const emailContent = await generateEmailBody(product, "WELCOME");

            await sendEmail(emailContent, [userEmail]); //we send email to all users whose are added in this product
        }
        else {
            console.log("No email sent:: user already exists! ") //good 
        }

    } catch (error: any) {
        console.log("error in addUserEmailToProduct :: ", error.message)
    }
}