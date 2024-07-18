This is a demo project for this [tweet thread](https://x.com/kbitgood/status/1813697515906355677). 

It's just a demo of a little RSC + Server Actions + TanStack Query overlay/modal thing I made inside a Next.js app.

### Demo Instructions

Click on the "Property" links on the search page to see the overlay. Refresh the page, navigate to a different overlay, navigate back, close the overlay, open it again. Just try to break it.

For a bonus, change what is rendered by `propertyOverlayAction` in `src/app/search/page.tsx` after the overlay is open. It keeps the stale overlay until the new one loads rather than showing the spinner/fallback again. Nice 😎

Also check out the network tab of your dev tools to see that the overlay page is properly SSR'd on refresh and client loaded on client side navigation.

### Install

```sh
bun install
bun run dev
```

### Usage
It's not a library, but it kind of is. To make another page with an overlay like the search page:
1. Wrap your page in `<OverlayPage>`
2. Give it the path definitions (Next.js style) and params
3. Give it a fallback
4. Give it a server action that renders your RSC payload for the overlay

### Disclaimer

All the code under `src` besides `src/app` is hastily copied and pasted from my main project, so it might not be complete. 