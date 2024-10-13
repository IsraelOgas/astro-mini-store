import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { db, eq, inArray, Product, ProductImage } from "astro:db";

export const loadProductsFromCart = defineAction({
  accept: "json",
  input: z.object({
    cookies: z.string()
  }),
  handler: async ({ cookies }) => {
    const cart = JSON.parse(cookies) as CartItem[]

    if (cart.length === 0) return [];

    const productIds = cart.map((item) => item.productId);

    const dbProducts = await db.select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productIds));

    // console.log({ dbProducts });
    return cart.map((item) => {
      const dbProduct = dbProducts.find((p) => p.Product.id === item.productId);

      if (!dbProduct) {
        throw new Error(`Product with id ${ item.productId } not found`);
      }

      const { title, price, slug } = dbProduct.Product;
      const { image } = dbProduct.ProductImage;

      return {
        productId: item.productId,
        title,
        size: item.size,
        price,
        quantity: item.quantity,
        image: image.startsWith('http') ? image : `${ import.meta.env.PUBLIC_URL }/images/products/${ image }`,
        slug: slug
      }
    });
  }
})