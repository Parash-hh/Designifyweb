import Image from "next/image";

import Hero from "./_components/Hero";
import Categories from "./_components/Categories";
import PopularProducts from "./_components/PopularProducts";

export default function Home() {
  return (
   <div>

    {/* Hero */}
    <Hero/>

    {/* Category list*/}
    <Categories/>

    {/* Product list*/}
    <PopularProducts/>

    {/* Footer */}
   </div>
  );
}
