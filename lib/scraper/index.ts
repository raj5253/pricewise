import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice, extractCurrency, extractDescription } from "./utils";

export async function scrapeAmazonProduct(url:string) {
    if(!url)return;

    // Bright data poxy configuration
    const  username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const session_id = (1000000*Math.random()) |0;

    const options ={
        auth: {
            username :`${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port, 
        rejectUnauthorized: false,
    }
    
    try {
        // Fetch the product page
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);
        // console.log(response); //this very lengthy response.you know what is in res, req
        
        // Extract the product title
        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice( $('.priceToPay span.a-price-whole'),
        $('a.size.base.a-color-price'),
        $('.a-button-selected .a-color-base'),
        $('.a-price.a-text-price'));

        const originalPrice = extractPrice($('#priceblock_ourprice'),$('.a-price.a-text-price span.a-offscreen') , $('#listPrice'), $('#priceblock_dealprice'), $('.a-size-base.a-color-price'))

        const outOfStock = $('#availability span').text().trim().toLocaleLowerCase() === 'currently unavilable';
        
        const  image= $('#imgBlkFront').attr('data-a-dynamic-image')|| $('#landingImage').attr('data-a-dynamic-image') || '{}'
        
        const imageUrls = Object.keys(JSON.parse(image)) //convert to object
        
        const currency = extractCurrency($('.a-price-symbol'))

        const discountRate =  $('.savingsPercentage').text().replace(/[-%]/g, '');

        console.log({title, currentPrice, originalPrice, outOfStock, imageUrls, currency, discountRate});

        // construct data object  with scraped information

        const description = extractDescription($)
        console.log({description});

        const data = {
            url, currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice : Number(currentPrice) || Number(originalPrice),
            originalPrice : Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category:'category',
            reviewsCount:100,
            stars: 4.5,
            isOutOfStock:outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        }
        // console.log(data);
        return data;
    } catch (error :any) {
        throw new Error(`Failed to scrape product: ${error.message}`)
    }
}