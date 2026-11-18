import BannerCreator from "./components/BannerCreator";

/** App is intentionally thin: all behaviour lives in BannerCreator. */
export default function App() {
  return (
    <main className="page">
      <BannerCreator />
    </main>
  );
}
