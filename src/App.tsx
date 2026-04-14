import GreetingWidget from './components/GreetingWidget';
import SearchBar from './components/SearchBar';
import QuickLinks from './components/QuickLinks';

function App() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col justify-center items-center">
        <div className="w-full">
          <GreetingWidget />
          <SearchBar />
          <QuickLinks />
        </div>
      </main>
    </div>
  );
}

export default App;
