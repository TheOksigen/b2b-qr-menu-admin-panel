// "use client";

// import { api } from "@/trpc/react";
// import { Category } from "@prisma/client";
// import React, { Suspense } from "react";

// const page = () => {
//   const { data: categories, refetch } = api.category.getAll.useQuery();

//   const mutation = api.category.create.useMutation({
//     onSuccess: () => {
//       refetch();
//     },
//   });

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     mutation.mutate({ name: "Yashar" });
//   };

//   return (
//     <div>
//       {categories?.map((category) => (
//         <div key={category.id}>{category.name}</div>
//       ))}
//       <form onSubmit={handleSubmit}>{/* <ModeToggle /> */}</form>
//     </div>
//   );
// };

// export default function Page({ initialData }: { initialData: Category[] }) {
//   const {
//     data: categories,
//     fetchNextPage,
//     hasNextPage,
//   } = api.category.getAll.useInfiniteQuery(
//     { limit: 10 },
//     {
//       getNextPageParam: (lastPage) => lastPage.nextCursor,
//       initialData: {
//         pages: [
//           {
//             items: initialData.map((category) => ({
//               ...category,
//               items: [],
//             })),
//             nextCursor: undefined,
//           },
//         ],
//         pageParams: [],
//       },
//     },
//   );

//   return (
//     <div>
//       {categories?.pages
//         .flatMap((page) => page.items)
//         .map((category) => <div key={category.id}>{category.name}</div>)}

//       <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
//         Next
//       </button>
//     </div>
//   );
// }

// export default function Page() {
//   const { data: categories } = api.category.getById.useQuery(
//     {
//       id: "1",
//     },
//     {
//       refetchInterval: 15000,
//     },
//   );

//   return <div>{categories?.name}</div>;
// }
export default function Page() {
  return <div>Hello</div>;
}
