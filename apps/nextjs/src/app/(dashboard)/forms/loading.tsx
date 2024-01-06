import { Spinner } from "~/components/spinner";

export default function Loading() {
  return (
    <div className="flex min-w-full justify-center">
      <Spinner className="mr-1 h-8 w-8 border-red-500 border-r-transparent" />
    </div>
  );
}
