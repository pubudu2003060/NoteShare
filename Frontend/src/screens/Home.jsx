import { JWTAxios } from "../api/Axios";

const Home = () => {
  const test = () => {
    JWTAxios.get("/user/test")
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching test route:", error);
      });
  };

  return (
    <div>
      Home
      <button onClick={test}>Test</button>
    </div>
  );
};

export default Home;
