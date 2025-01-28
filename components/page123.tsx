// import { Suspense } from "react";
// import dynamic from "next/dynamic";
// import Loader from "@/components/ui/Loader";

// const HomePage = dynamic(
//   () => import("@/app/(pages)/(properties)/page"),
//   {
//     loading: () => <Loader />,
//     ssr: true
//   }
// );

// export default function Page() {
//   return (
//     <Suspense fallback={<Loader />}>
//       <HomePage />
//     </Suspense>
//   );
// }