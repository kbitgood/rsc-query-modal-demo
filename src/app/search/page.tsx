import Link from "next/link";

import { CloseOverlayButton } from "@/Overlay/CloseOverlayButton";
import { OverlayPage } from "@/Overlay/OverlayPage";

export default function Search({
  params,
}: {
  params: { id: string | undefined };
}) {
  return (
    <OverlayPage
      sharedPath="/search"
      overlaySubPath="/property/[id]"
      params={params}
      overlayFallback={<Spinner />}
      overlayLoaderAction={propertyOverlayAction}
    >
      <div className="flex flex-col gap-4">
        <h1>Search Page</h1>
        <div className="flex gap-4">
          <Link href="/search/property/1" className="hover:underline">
            Property 1
          </Link>
          <Link href="/search/property/2" className="hover:underline">
            Property 2
          </Link>
        </div>
      </div>
    </OverlayPage>
  );
}

export function Spinner() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-current" />
    </div>
  );
}

export async function propertyOverlayAction(params: { id: string }) {
  "use server";

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const now = new Date();

  return (
    <div className="p-8 flex flex-col gap-4 items-start">
      <h2 className="font-bold">Property - {params.id}</h2>
      <p>
        Rendered at {now.getHours().toString().padStart(2, "0")}:
        {now.getMinutes().toString().padStart(2, "0")}:
        {now.getSeconds().toString().padStart(2, "0")}
      </p>
      <Link
        href={`/search/property/${params.id === "1" ? "2" : "1"}`}
        className="hover:underline"
      >
        Go to Property {params.id === "1" ? "2" : "1"}
      </Link>
      <CloseOverlayButton className="hover:underline">
        Close Overlay
      </CloseOverlayButton>
    </div>
  );
}
