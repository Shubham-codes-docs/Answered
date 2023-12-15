import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/" />
      <h1>Home</h1>
    </div>
  );
};

export default Home;
