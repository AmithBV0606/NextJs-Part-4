import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold underline">Featured Products</h1>

      <Link href={"/products/1"} className="underline">
        Product 1
      </Link>
      <Link href={"/products/2"} className="underline">
        Product 2
      </Link>
      <Link href={"/products/3"} className="underline">
        Product 3
      </Link>
    </div>
  );
}
