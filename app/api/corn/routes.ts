import Product from "@/lib/models/product.models";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { connectToDB } from "@/lib/scraper/mongoose"
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/scraper/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();
        const products = await Product.find({});

        if (!products) throw new Error("No products found")

        // scrap latest product details & update db
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrapeProduct = await scrapeAmazonProduct(currentProduct.url)

                if (!scrapeProduct) throw new Error("No product found")
                const updatedPriceHistory = [
                    ...currentProduct.updatedPriceHistory, { price: scrapeProduct.currentPrice }]

                const product = {
                    ...scrapeProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory)
                }

                const updatedProduct = await Product.findOneAndUpdate({
                    url: scrapeProduct.url
                }, product); //don't create new id while updating the document

                // check each product price status and send email accordingly
                const emailNotifType = getEmailNotifType(scrapeProduct, currentProduct)

                if (emailNotifType && updatedProduct.users.length > 0) {
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url,
                    }
                    const emailContent = await generateEmailBody(productInfo, emailNotifType) //we are not sending the exact productPrice.
                    const userEmails = updatedProduct.users.map((user: any) => user.email);

                    await sendEmail(emailContent, userEmails);
                }
                return updatedProduct;
            }))

        return NextResponse.json({
            message: 'Ok', data: updatedProducts //NOTE: we dont use (req, res)
        })
    } catch (error) {
        throw new Error(`Error in GET: ${error}`)
    }
}