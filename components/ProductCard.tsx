// created after db completed for product, and before userauth

import { Product } from "@/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";

interface Props {
  product: Product;
} //its too much complex in typescript

const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/product/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          width={200}
          height={200}
          alt={product.title}
          className="product-card_img"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">
            {product.category}
          </p>
          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
