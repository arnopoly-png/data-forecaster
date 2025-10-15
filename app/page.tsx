import dynamic from "next/dynamic";

const KratosDataForecaster = dynamic(
  () => import("../data-forecaster/components/KratosDataForecaster"),
  { ssr: false }
);

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-6">
      <KratosDataForecaster />
    </main>
  );
}
