

const MainContent = () => {
    const handleClick = () => {
        console.log("Button clicked!");
    }
    
    return (
    <main className="flex-1 flex items-center justify-center py-12">
      <div className="max-w-6xl w-full px-6">
        <div className="text-left mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-4">
            it's not therapy.
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
            just a place to think out loud.
          </h2>

          <p className="text-xl text-gray-700 mb-8 max-w-lg">
            meet core, your friendly AI companion designed to listen, reflect, and help you make sense of your thoughts and feelings.
          </p>

          <button onClick={handleClick} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-md border border-black font-medium text-lg transition-colors mb-6">
            start yapping — it's free
          </button>

          <p className="text-gray-500 text-sm">
            be heard. be understood. be better.
          </p>
        </div>
      </div>
    </main>
  );
}

export default MainContent
