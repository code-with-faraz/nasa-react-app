import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Main from "./components/Main";
import SideBar from "./components/SideBar";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIdata() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url =
        "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`;

      const today = new Date().toDateString();
      const localKey = `nasaData-${today}`;
      if (localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey));
        setData(apiData);
        console.log("Fetched from cache today");
        return;
      }

      localStorage.clear();

      try {
        const res = await fetch(url);
        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log("Fetched from API today");
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchAPIdata();
  }, []);

  return (
    <>
      {data ? (
        <Main data={data} />
      ) : (
        <div className="loadingState">
          <div class="pyramid-loader">
            <div class="wrapper">
              <span class="side side1"></span>
              <span class="side side2"></span>
              <span class="side side3"></span>
              <span class="side side4"></span>
              <span class="shadow"></span>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && <Footer data={data} handleToggleModal={handleToggleModal} />}
    </>
  );
}

export default App;
