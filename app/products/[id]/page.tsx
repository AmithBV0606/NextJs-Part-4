export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function ProductId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Product {id} details rendered at {new Date().toLocaleTimeString()}
      </h1>
    </div>
  );
}
