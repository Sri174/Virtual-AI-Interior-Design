import Navbar from '../components/Navbar';
import StyleQuiz from '../components/StyleQuiz';
import MoodBoard from '../components/MoodBoard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design Your Dream Space
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI helps you visualize perfect interiors tailored to your style
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <StyleQuiz />
          <MoodBoard />
        </div>
      </main>
    </div>
  );
}