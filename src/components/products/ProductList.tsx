import type { ProductWithImages } from "@/interfaces"
import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithImages[];
}

const ProductList = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-4">
      { products.map((product) => (
        <ProductCard key={ product.id } product={ product } />
      )) }
    </div>
  )
}

export default ProductList