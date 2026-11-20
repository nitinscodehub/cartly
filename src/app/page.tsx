import Storefront from "@/components/Storefront";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  return <Storefront initialProducts={PRODUCTS} />;
}
