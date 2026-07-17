import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Blog } from "@/components/sections/blog";
import { Contact } from "@/components/sections/contact";
import PixelSnowLoader from "@/components/three/pixel-snow-loader";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Pixel snow background behind all non-hero sections */}
      <div className="relative">
        <PixelSnowLoader />
        <div className="relative z-10">
          <About />
          <Skills />
          <Projects />
          <Blog />
          <Contact />
        </div>
      </div>
    </>
  );
}
