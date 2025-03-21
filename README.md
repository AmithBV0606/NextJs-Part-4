# Next-Js by Codevolution : Part-4

### Topics Covered :

- Rendering
- Client-side Rendering (CSR)
- Server-side Rendering (SSR)
- Suspense SSR
- React Server Components (RSCs)
- Server and Client Components
- Rendering Lifecycle in RSCs
- Static Rendering
- Dynamic Rendering
- generateStaticParams
- dynamicParams

## Rendering

### Introduction to Rendering : 

- Rendering is the process of transforming the component code you write into user interfaces that users can see and interact with.

- In Next.js, the tricky part is to building a performant application is figuring out when and where this transformation should happen.

- CSR, SSR and RSCs ?

- Rendering in React === Rendering in Next.js

## Client-side Rendering (CSR)

- To understand the rendering process, we need to look at how React's rendering has evolved over the time.

- We probably remember when React was primarily used for building Single Page Applications (SPAs).

<img src="./assets/Pic-1.png" />

- This whole approach - where your browser (the client) transforms React component into what you see on screen - that's what we call Client Side Rendering (CSR).

- CSR became super popular for SPAs and everyone was using it.

- It wasn't long before developers began noticing some inherent drwabacks to this approach.

### Drawbacks 

<ins>**SEO :**</ins>

- When search engines crawl your site, they're mainly looking for HTML content. But with CSR, your initial HTML is basically just an empty div - not great for search engines trying to figure out what your page is about.

- When you have a lot of nested components making API calls, the meaningful content might load too slowly for search engines to even catch it.

<ins>**Performance :**</ins>

- Your browser (the client) has to do everything: fetch data, build the UI, make everything interactive... that's a lot of work!

- Users often end up staring at a blank screen or a loading spinner while all this happens.

- Every time you add a new feature to your app, that JavaScript bundle gets bigger, making users wait even longer.

- This is especially frustrating for people with slower internet connections.

## Server-side Rendering (SSR)

<img src="./assets/Pic-2.png" />

- Search engines can now easily index the server-rendered content, solving our SEO problem.

- Users see actual HTML content right away instead of staring at a blank screen or loading spinner.

<img src="./assets/Pic-3.png" />

### Hydration : 

- During hydration, React takes control in the browser and reconstructs the component tree in memory, using the server-rendered HTML as a blueprint

- It carefully maps out where all the interactive elements should go, then hooks up the JavaScript logic

- This involves initializing application state, adding click and mouseover handlers, and setting up all the dynamic features needed for a full interactive user experience

### Categories of Server side solution : 

1. <ins>**Static Site Generation (SSG):**</ins>
SSG happens during build time when you deploy your application to the server. This results in pages that are already rendered and ready to serve. It's perfect for content that stays relatively stable, like blog posts

2. <ins>**Server-Side Rendering (SSR) :**</ins>
SSR, on the other hand, renders pages on-demand when users request them. It's ideal for personalized content like social media feeds where the HTML changes based on who's logged in.

### Drawbacks of SSR : 


1. You have to fetch everything before you can show anything(Data fetching must be completed before the server can begin rendering HTML)

    - Components cannot start rendering and then pause or "wait" while data is still being loaded.

    - If a component needs to fetch data from a database or another source (like an API), this fetching must be completed before the server can begin rendering the page.

    - This can delay the server's response time to the browser, as the server must finish collecting all necessary data before any part of the page can be sent to the client.

2. You have to load everything before you can hydrate anything(The JS required for the components needs to be fully loaded on the Client side befor the hydration process can start.)

    - For successful hydration, where React adds interactivity to the server-rendered HTML, the component tree in the browser must exactly match the server-generated component tree.

    - This means that all the JavaScript for the components must be loaded on the client before you can start hydrating any of them.

3. You have to hydrate everything before you can interact with anything(All components have to be hydrated before they become interactive.)

    - React hydrates the component tree in a single pass, meaning once it starts hydrating, it won’t stop until it’s finished with the entire tree.

    - As a consequence, all components must be hydrated before you can interact with any of them.

### Drawbacks of SSR - all or nothing waterfall

1. having to load the data for the entire page
2. loading the JavaScript for the entire page, and
3. hydrating the entire page

At once, create an "all or nothing" waterfall problem that spans from the server to the client, where each issue must be resolved before moving to the next one.

This becomes really inefficient when some parts of your app are slower than others, as is often the case in real-world apps.

## Suspense SSR (Improved SSR Architecture)

Use the `<Suspense>` component to unlock two major SSR features : 

1. <ins>**HTML streaming on the server**</ins>

<img src="./assets/Pic-4.png" />

- First you render all HTML, the client eventually receives it. Then you load all the code and hydrate the entire application.

- But React 18 gives us a better way.

<img src="./assets/Pic-5.png" />

- When you wrap your main content within the suspense component, you're telling React, "hey don't wait for this part, start streaming the rest of the page."

- React will show a loading spinner for that wrapped section while it works on the rest of the page.

- When the server finally has the data ready for that main section, react streams the additional HTML through the ongoing stream along with a tiny bit of JavaScript that knows exactly where to position that HTML.

**Summary :** You don’t have to fetch everything before you can show anything. If a particular section is slow and could potentially delay the initial HTML, no problem! It can be seamlessly integrated into the stream later when it's ready

**Problem :**

- Even with the faster HTML delivery, we can't start hydrating untill we've loaded all the JavaScript for the main section.

- If that's a big chunck of code, we're still keeping users waiting from being able to interact with the page.

**Solution :** Code splitting 

- It lets you tell your bundler, "These parts of the code aren't urgent - split them into separate scripts."

- Using `React.lazy` for code splitting separates your main section's code from the core JavaScript bundle.

- The browser can download React and most of your app's code independently, without getting stuck waiting for that main section's code.

2. <ins>**Selective hydration on the client**</ins>

- By wrapping your main section in a `<Suspense>` component, you're not just enabling streaming but also telling React it's okay to hydrate other parts of the page before everything's ready.

- This is what we call selective hydration

- It allows for the hydration of parts of the page as they become available, even before the rest of the HTML and the JavaScript code are fully downloaded.

- Thanks to selective hydration, a heavy chunck of JavaScript won't hold up the rest of your page from becoming interactive.

- Selective hydration also solves our third problem: the necessity to "hydrate everything to interact with anything"

- React starts hydrating as soon as it can, which means users can interact with things like the header and side navigation without waiting for the main content.

- This process is managed automatically by React.

- In scenarios where multiple components are awaiting hydration, React prioritizes hydration based on user interactions.

### Drawbacks of Suspense SSR : 

1. First, even though we're streaming JavaScript code to the browser bit by bit, eventually users still end up downloading the entire code for a webpage.

    - As we keep adding features to our apps, this code keeps growing.

    - This leads to an important question: do users really need to download so much data?

2. Right now, every React component gets hydrated on the client side, whether it needs interactivity or not

    - This means we're using up resources and slowing down load times and time to interactivity by hydrating components that might just be static content

    - This leads to another question: should all components be hydrated, even those that don’t need interactivity?

3. Third, even though servers are way better at handling heavy processing, we're still making users' devices do bulk of the JavaScript work

    - This can really slow things down, especially on less powerful devices

    - This leads to another important question: Shouldn't we be leveraging our servers more?

## React Server Components (RSCs)

### The evolution of React

CSR --> SSR --> Suspense for SSR

- Suspense for SSR brought us closer to a seamless rendering experience.

**Challenges :**

- Large bundles sizes causing excessive downloads for users.

- Unnecessary hydration delaying interactivity.

- Heavy client-side processing leading to poorer performance.

### React Server Components (RSC) : 

- React Server Components (RSC) represent a new architecture designed by the React team

- This approach leverages the strengths of both server and client environments to optimize efficiency, load times, and interactivity

- The architecture introduces a dual-component model

   - Client Components
   - Server Components

- This distinction is based not on the components' functionality but rather on their execution environment and the specific systems they are designed to interact with.

### Client Components : 

- Client Components are the familiar React components we've been using.

- They are typically rendered on the client-side (CSR) but, they can also be rendered to HTML on the server (SSR), allowing users to immediately see the page's HTML content rather than a blank screen.

- "client components" can render on the server? It's an Optimization strategy.

- Client components primarily operate on the client but can (and should) also run `once` on the server for better performance.

- Client components have full access to the client environment, such as the browser, allowing them to use state, effects and event listeners for handling interactivity.

- They can also access browser-exclusive APIs like geolocation or localstorage, allowing you to build UI for specific use cases.

- In fact, the term "Client Component" doesn't signify anything new, it simply helps differentiate these components from the newly introduced server components.

### Server Components : 

- Server components represent a new type of React component specifically designed to operate exclusively on the server.

- And unlike client components, their code stays on the server and is never downloaded to the client.

- This design choice offers multiple benefits to React applications.

### Benefits of Server Components : 

1. <ins>**Smaller bundle Size**</ins>

- Since server components stay on the server, all their dependency stays there too.

- This is fantastic for users with slower connections or less powerfull devices since they don't need to download, parse and execute that JavaScript.

- Plus, there's no hydration step, making your app load and become interactive faster.

2. <ins>**Direct access to server-side resources**</ins>

- Server components can talk directly to databases and file systems, making data fetching super efficient without any client-side processing.

- They use the server's power and proximity to data sources to manage compute-intensive rendering tasks.

3. <ins>**Enhanced Security**</ins>

- Since server components run only on the server, sensitive data and logic -like API keys and tokens - never leave the serever.

4. <ins>**improved data fetching**</ins>

- Server components allow you to move data fetching to the server, closer to your data source.

- This can improve the performance by reducing the time it takes to fetch the data needed for rendering, and the number of requests the client needs to make.

5. <ins>**Caching**</ins>

- When you render on the server, you can cache the results and reuse them for different users and requests.

- This means better performance and lower costs since you're not re-rendering and re-fetching data all the time.

6. <ins>**Faster initial page load and first contentful paint**</ins>

- By generating HTML on the server, users see your content immediately - no waiting for JavaScript to download and execute.

7. <ins>**Improved SEO**</ins>

- Search engines bot can easily read the server-rendered HTML, making your pages more indexable.

8. <ins>**Efficient streaming**</ins>

- Server Components can split the rendering process into chunks that stream to the client as they're ready.

- This means users start seeing content faster instead of waiting for the entire page to render on the server.

### RSC continued : 

- Server Components handle data fetching and static rendering, while Client Components take care of rendering the interactive elements.

- The beauty of this setup is that you get the best of both server and client rendering while using a single language, framework, and set of APIs.

### Summary : 

- React Server Components offer a new approach to building React apps by separating components into two: Server Components and Client Components

- Server Components run exclusively on the server - they fetch data and prepare content without sending code to the browser

- This makes your app faster because users download less code

- However, they can't handle any interactions

- Client Components, on the other hand, run in the browser and manage all the interactive parts like clicks and typing

- They can also get an initial server render for faster page loads.

<ins>**NOTE :**</ins> The app router in next.js is built entirely on the RSC architecture.

## Server and Client Components (Practical)

### RSC + Next.js 

- In the RSC architecture and by extension it the next.js app router, Every component in a Next.js app defaults to being a server components.

- Running components on the server brings several advantages : zero-bundle size, direct access to server-side resources, improved security and better SEO.

- Server components can't interact with browser APIs or handle user interactions.

- To create a client component, add "use client" directive at the top of the file.

- Server components are rendered exclusively on the server and client components are rendered once on the server and then on the client.

## Rendering Lifecycle in RSCs 

- We're going to learn about the rendering lifecycle of server and client components.

- In simpler terms, we'll explore how they come to life on your screen.

- When we talk about React Server Components (RSC), we're dealing with 3 key player : 

    - Your browser(the client)
    - Next.js (Our framework)
    - React (Our Library)

### RSC Initial loading sequence

<img src="./assets/Pic-6.png" />

### RSC Update sequence
<img src="./assets/Pic-7.png" />

### Server rendering strategies : 

1. Static rendering
2. Dynamic rendering
3. Streaming

## Static Rendering

- Static rendering is a server rendering strategy where we generate HTML pages when building our application.

- Think of it as preparing all your content in advance - before any user visits your site.

- Once built, these pages can be cached by CDNs and served instantly to users.

- With this approach, the same pre-rendered page can be shared among different users, giving your app a significant performance boost.

- Static rendering is perfect for things like blog posts, e-commerce product listings, documentation, and marketing pages.

### <ins>How to statically render?</ins>

- Static rendering is the default strategy in the app router.

- All routes are automatically prepared at build time without any additional setup.

- But the question is we haven't really built our application yet, right? We're just running it in development mode.

### <ins>Production Server</ins> Vs <ins>Development Server</ins>

- In production, we create one optimized build and deploy it - no on-the-fly changes after deployment.

- A deployment server, on the other hand, focuses on the developer experience.

- We need to see our changes immediately in the browser without rebuilding the app every time.

- In production, pages are pre-rendered once during the build.

- In development, pages are pre-rendered on every request.

**NOTE :** 

1. Next.js also displays a static route indicator during development to help you identify the static routes.

2. To see the indicator, run "npm run build".

<img src="./assets/Pic-8.png" />

3. Route is route itself, "Size" shows how much data needs to be downloaded while navigating to that corresponding page client side in the browser and finally "First Load JS" tlls us how much gets downloaded when initially loading a page from the server.

4. rsc files are essential for building the UI on the client side, when we navigate to different routes.

### Prefetching

- Prefetching is a technique that preloads routes in the background as their links become visible.

- For static routes like ours, Next.js automatically prefetches and caches the whole route.

- When our home page loads, Next.js is already prefetching about and dashboard routes for instant navigation.

### Static rendering summary

- Static rendering is a strategy where the HTML is generated at build time.
- Along with the HTML, RSC payloads for components and JavaScript chunks for client-side hydration are created.
- Direct route visits serve HTML files.
- Client-side navigation uses RSC payloads and JavaScript chunks without additional server requests.
- Static rendering is great for performance, especially in blogs, documentation, and marketing pages.

## Dynamic Rendering

- Dynamic rendering is a server rendering strategy where routes are rendered uniquely for each user when they make a request.

- It is useful when you need to show personalized data or information that's only available at request time(and not ahead of time during pre-rendering) - things like cookies or URL search parameters.

- News websites, personalized shopping pages, and social media feeds are some examples where dynamic rendering is beneficial.

### <ins>How to dynamically render</ins>

- Next.js automatically switches to dynamic rendering for an entire route when it detects what we call a "dynamic function" or "dynamic API".

- In Next.js, these dynamic functions are:

    - `cookies()`
    - `headers()`
    - `connection()`
    - `draftMode()`
    - `searchParams prop`
    - `after()`

- Using any of these automatically opts your entire route into dynamic rendering at request time.

<img src="./assets/Pic-9.png" />

- Dynamically rendered pages aren't generated during the build time.

### <ins>Dynamic rendering summary</ins>

- Dynamic rendering is a strategy where the HTML is generated at request time.
- - Next.js automatically enables it when it encounters dynamic functions like cookies, headers, connection, draftMode, after or searchParams prop.
- It's great for personalized content like social media feeds.
- You don't have to stress about choosing between static and dynamic rendering.
- Next.js automatically selects the optimal rendering strategy for each route based on the features and APIs you're using.
- But if you want to force a route to be dynamically rendered, you can use the following config at the top of your page.

```js
const dynamic = 'force-dynamic';
```

**NOTE :**

    ○  (Static)   prerendered as static content
    ƒ  (Dynamic)  server-rendered on demand

## generateStaticParams

- generateStaticParams is a function that :

    - Works alongside dynamic route segments.
    - To generate static routes during the build time.
    - Instead of on demand at request time.
    - Giving us a nice performance boost.

### Demo 

- Create a folder named `products` and create a `page.tsx` file inside it.

```js
// products/page.tsx
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
```

- Inside `products` folder, create another dynamic folder named `[id]` and create a `page.tsx` file inside it.

```js
// products/[id]/page.tsx
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
```

- Now run `npm run build`

<img src="./assets/Pic-10.png" />

- If you notice carefully, Next.js handles `/products`(Product list page) and `products/[id]`(Product details page) routes differently.

- `/products` gets statically rendered and `/products/[id]` gets dynamically rendered.

- But from our previous learnings we know that static rendering gives us better performance. 

- It would be great if we could tell next.js to pre-render at least our featured products details page(`/products/[id]`) i.e Product 1, Product 2 and Product 3.

- That is what exactly `generateStaticParams` helps us with. 

- Add the following code, above the `ProductId` function inside the `products/[id]/page.tsx`.

```js
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

// Each object represents a route we want to pre-render with the object key corresponding to a route's dynamic segment.
```

- This function runs during build time and will pre-renders the product details pages for all 3 featured products.

<img src="./assets/Pic-11.png" />

### Multiple dynamic route segments

- Suppose we have a product catalog with categories and products

```js
// /products/[category]/[product]/page.tsx

export async function generateStaticParams() {
  return [
    { category: "electronics", product: "smartphone" },
    { category: "electronics", product: "laptop" },
    { category: "books", product: "science-fiction" },
    { category: "books", product: "biography" },
  ];
}
```

- `generateStaticParams` is a powerfull feature in Next.js, that lets you pre-render static routes for dynamic segments.

## dynamicParams

- Control what happens when a dynamic segment is visited that was not generated with `generateStaticParams()`.

```js
export const dynamicParams = false;
```

- by default `dynamicParams` is set to true - Next.js will statically render pages on demand for any dynamic segments that are not included in `generateStaticParams()`.

- false - Next.js will return a 404 error for any dynamic segments not included in our pre-rendered list.

### Use cases : 

<ins>**true :**</ins>

- If you're building an e-commerce site, you'll probably want to keep dynamicParams set to true.

- This way, you can pre-render your most popular product pages for better performance, but still allow access to all your other products – they'll just be rendered on demand.

<ins>**false :**</ins>

- If you're working with something like a blog where you have a smaller, more fixed number of pages, you can pre-render all of them and set dynamicParams to false.

- If someone tries to access a blog post that doesn't exist, they'll get a clean 404 error instead of waiting for a page that will never exist.