import Modals from "@/components/Modals";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/scraper/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};
const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect("/");

  // get similar product, once whole skelton above similarProduct section is completed
  const similarProducts = await getSimilarProducts(id);

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row  flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto" //margin-xaxis : auto
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center  gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="red-heart"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#D46F77]">
                  {product.reviewsCount}
                </p>
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                ></Image>
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                ></Image>
              </div>
            </div>
          </div>
          {/*  product deatils */}
          <div className="product-info">
            {/* price */}
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[34px] text-black opacity-50 line-through font-bold">
                {product.currency} {formatNumber(product.originalPrice)}
              </p>
            </div>

            {/* rating and reviews and recommendation */}
            <div className="flex  flex-col gap-4">
              {/*  rating and reviews */}
              <div className="flex gap-3">
                {/* rating */}
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  ></Image>
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || "25"}
                  </p>
                </div>
                {/* reviews */}
                <div className="product-reviews">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comment"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm  text-secondary font-semibold">
                    {product.reviewsCount} Reviews
                  </p>
                </div>
              </div>
              {/* recomentation*/}
              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green fonts-semibold">93% </span>{" "}
                of buyers recommended it.
              </p>
            </div>
          </div>
          {/* end of product details */}
          {/* 4 price  details */}
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
                //wrap is used, so if  next element does not fit they will shift to new line below
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(
                  product.averagePrice
                )}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(
                  product.highestPrice
                )}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice
                )}`}
              />
            </div>
          </div>
          {/* end of 4 price details */}
          <Modals productId={id} />
        </div>
      </div>

      <div className="flex flex-col gap-16 ">
        {/* description */}
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product description
          </h3>

          <div className="flex flex-col gap-4">
            {product?.description?.split("\n")}
          </div>
        </div>
        {/* Buy button*/}
        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <Image
            src="/assets/icons/bag.svg"
            alt="check"
            width={22}
            height={22}
          />
          <Link href="/" className="text-base text-white">
            BUY NOW
          </Link>
        </button>
      </div>

      {/* similarProducts */}
      {similarProducts && similarProducts?.length > 0 && (
        <div className="py-14 flex flex-col  gap-0 w-full">
          {/*tailwind you should remember*/}
          <p className="section-text">Similar Products</p>
          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

// btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]  <= powerfull
