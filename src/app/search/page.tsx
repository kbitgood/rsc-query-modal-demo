import Link from "next/link";

export default function Search({ params }: { params: { id?: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h1>Search Page</h1>
      <div className="flex gap-4">
        <Link
          href="/search/property/1"
          className={params.id === "1" ? "font-bold" : ""}
        >
          Property 1
        </Link>
        <Link
          href="/search/property/2"
          className={params.id === "2" ? "font-bold" : ""}
        >
          Property 2
        </Link>
      </div>
      {!!params.id && (
        <div className="px-4">
          <h2>Property - {params.id}</h2>
        </div>
      )}
    </div>
  );
}
