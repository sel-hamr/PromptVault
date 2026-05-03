import Navbar from "@/app/_components/landing/Navbar";
import Hero from "@/app/_components/landing/Hero";
import ProblemSolution from "@/app/_components/landing/ProblemSolution";
import Features from "@/app/_components/landing/Features";
import Demo from "@/app/_components/landing/Demo";
import UseCases from "@/app/_components/landing/UseCases";
import Footer from "@/app/_components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <Demo />
        <UseCases />
      </main>
      <Footer />
    </div>
  );
}
