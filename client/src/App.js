import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./routes/Pages";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[linear-gradient(180deg,#3b3b3b,#111112)] text-black dark:text-white">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </>
  )
}

export default App;