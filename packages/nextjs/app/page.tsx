export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Pet Information</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="petName" className="block text-gray-700 text-sm font-bold mb-2">
              Pet Name
            </label>
            <input
              type="text"
              id="petName"
              name="petName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="petOwner" className="block text-gray-700 text-sm font-bold mb-2">
              Pet Owner
            </label>
            <input
              type="text"
              id="petOwner"
              name="petOwner"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="petBirth" className="block text-gray-700 text-sm font-bold mb-2">
              Pet Birth
            </label>
            <input
              type="date"
              id="petBirth"
              name="petBirth"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
