import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Categories from "./_components/Categories";
import PopularProducts from "./_components/PopularProducts";

export default function Home() {
  return (
   <div>
    {/* Header */}
    <Header/>
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
