## Application Structure

Pages and components: I created two pages, "HomePage" and "EntriesPage", src/pages.

Layers: React shows the user interface and handles user actions. Express receives API requests from the frontend and runs SQL queries against the database. MariaDB stores the entries permanently, so they remain after a page refresh.

/entries vs GET /api/entries: "/entries" is a frontend route. React Router uses it to decide which page to show in the browser. "GET /api/entries" is a backend API route.

 REST: The app only does simple things: get the entries, GET,  and add a new entry, POST. REST is a simple and common way to do it.