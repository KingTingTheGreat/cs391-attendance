export default function CodeDisplay({ code }: { code: string }) {
  return (
    <div className="text-6xl font-bold tracking-wider bg-gray-200 p-4 m-2 rounded-lg">
      {code}
    </div>
  );
}
