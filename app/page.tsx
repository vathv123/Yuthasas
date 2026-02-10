import Image from "next/image";
import Nav from "./components/nav";
import Hero from "./components/hero";
import Count from "./components/count";
import Steps from "./components/how";
import Dept from "./components/inDept";
import { Pricing } from "./components/bullets"
import Comment from "./components/comments";
import Footer from  "./components/footer"
export default function Home() {
  return (
    <>
      <div className="w-full relative max-w-[90vw] m-auto overflow-x-hidden">
        <Nav />
        <Hero />
        <Count />
        <Steps />
        <Dept />
        <Pricing />
        <Comment />
        <Footer />
      </div>
    </>
  );
}
