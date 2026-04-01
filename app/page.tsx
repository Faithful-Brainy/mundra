import SectionHero from "./components/SectionHero";
import AboutSections from "./components/AboutSections";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <SectionHero />
        <AboutSections />
      </main>
    </div>
  );
}
