import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function index() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState("1");
  const [limit, setLimit] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("LOADING");
  const [timer, setTimer] = useState(0);

  const router = useRouter();
  const { isReady } = router;
  const { page: qPage, limit: qLimit } = router.query;

  function refreshTimer() {
    setTimer(timer + 1);
  }

  async function getData(qPage, qLimit) {
    try {
      let url = `https://633530ca849edb52d6fceadf.mockapi.io/bl/v1/booking`;

      if (qPage && qLimit) {
        url = url + "?page=" + qPage;
        url = url + "&limit=" + qLimit;
      }
      console.log(url);

      const res = await axios({
        method: "get",
        url: url,
      });

      if (!res || (res && res.data && res.data.length === 0)) {
        throw Error();
      }

      setData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log({ router });
    setIsLoading(true);

    let runTimer;

    if (isReady && qPage && qLimit) {
      setPage(qPage);
      setLimit(qLimit);

      getData(qPage, qLimit);
    }

    if (isReady && !qPage && !qLimit) {
      runTimer = timer < 3 ? setInterval(refreshTimer, 1000) : "";
    }
    if (isReady && !qPage && !qLimit && timer >= 3) {
      getData(1, 10);
    }

    // console.log({ timer });
    // console.log({ qPage, qLimit });

    return () => {
      clearInterval(runTimer);
    };
  }, [qPage, qLimit, timer]);

  function getDotFormTimer() {
    let dot = "";

    for (let x = 0; x < timer; x++) {
      dot = dot + ".";
    }

    return dot;
  }

  useEffect(() => {
    console.log("router", router);
  }, []);

  return (
    <>
      {isLoading ? (
        <div>
          <h1>{loadingText + getDotFormTimer()}</h1>
        </div>
      ) : (
        <div>
          <p>BOOKING DATA</p>
          {data &&
            data.map((item) => {
              return (
                <div key={item.id}>
                  <span>{item.id + ".   "}</span>
                  <span>{item.name}</span>
                </div>
              );
            })}
          <div>
            <p>{`this is page ` + page}</p>
          </div>
        </div>
      )}

      <style jsx>{``}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
