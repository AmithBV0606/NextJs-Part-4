# Next-Js by Codevolution : Part-4

### Topics Covered :

- Rendering
- Client-side Rendering (CSR)
- Server-side Rendering (SSR)
- Suspense SSR
- React Server Components
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

**SEO :**

- When search engines crawl your site, they're mainly looking for HTML content. But with CSR, your initial HTML is basically just an empty div - not great for search engines trying to figure out what your page is about.

- When you have a lot of nested components making API calls, the meaningful content might load too slowly for search engines to even catch it.

**Performance :**

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

1. **Static Site Generation (SSG):**
SSG happens during build time when you deploy your application to the server. This results in pages that are already rendered and ready to serve. It's perfect for content that stays relatively stable, like blog posts

2. **Server-Side Rendering (SSR) :**
SSR, on the other hand, renders pages on-demand when users request them. It's ideal for personalized content like social media feeds where the HTML changes based on who's logged in.

### Drawbacks of SSR : 


1. You have to fetch everything before you can show anything

    - Components cannot start rendering and then pause or "wait" while data is still being loaded.

    - If a component needs to fetch data from a database or another source (like an API), this fetching must be completed before the server can begin rendering the page.

    - This can delay the server's response time to the browser, as the server must finish collecting all necessary data before any part of the page can be sent to the client.

2. You have to load everything before you can hydrate anything

    - For successful hydration, where React adds interactivity to the server-rendered HTML, the component tree in the browser must exactly match the server-generated component tree.

    - This means that all the JavaScript for the components must be loaded on the client before you can start hydrating any of them.

3. You have to hydrate everything before you can interact with anything

    - React hydrates the component tree in a single pass, meaning once it starts hydrating, it won’t stop until it’s finished with the entire tree.

    - As a consequence, all components must be hydrated before you can interact with any of them.

### Drawbacks of SSR - all or nothing waterfall

1. having to load the data for the entire page
2. loading the JavaScript for the entire page, and
3. hydrating the entire page

At once, create an "all or nothing" waterfall problem that spans from the server to the client, where each issue must be resolved before moving to the next one.

This becomes really inefficient when some parts of your app are slower than others, as is often the case in real-world apps.