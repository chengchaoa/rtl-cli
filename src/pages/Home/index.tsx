import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const onGoTest1 = () => {
    navigate("test1", { replace: true });
  };

  return (
    <div>
      Home
      <Link to={"test"}>go test</Link>
      <div onClick={onGoTest1}>go Test1</div>
    </div>
  );
};

export default Home;
