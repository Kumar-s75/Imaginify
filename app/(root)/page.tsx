import { useClerk } from "@clerk/nextjs";

const Home = () => {
  // const { signOut } = useClerk();

  return (
    <div>
      <p>Home</p>
      {/* <button onClick={() => signOut({ redirectUrl: "/" })}>
        Sign Out
      </button> */}
    </div>
  );
};

export default Home;
