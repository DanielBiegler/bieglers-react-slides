# Client-side routing only, no server framework

We use React Router in client-side mode rather than a server framework like Remix. The Build is a static folder that runs in a browser with no server — SSR, loaders, and actions are irrelevant to this use case. Remix was considered but targets server-rendered apps, which is the opposite of what this project needs.
