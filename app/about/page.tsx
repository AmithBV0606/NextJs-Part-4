// import { useState } from "react";

export default function AboutPage() {
  //   const [name, setName] = useState("");

  console.log("About server component!!");

  return (
    <div>
      <h1 className="text-2xl font-bold underline">
        About Page it is!! Time : {new Date().toLocaleTimeString()}
      </h1>
    </div>
  );
}

// import { cookies } from "next/headers";

// export default async function AboutPage() {
//   const cookieStore = await cookies();
//   const theme = cookieStore.get("theme");
//   console.log(theme);

//   return (
//     <div>
//       <h1>About Page, Time : {new Date().toLocaleTimeString()}</h1>
//     </div>
//   );
// }