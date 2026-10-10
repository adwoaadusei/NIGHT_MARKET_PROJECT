# Night Market — Web Technologies Synthesis

A fictional five-page Ghanaian chop bar website built with HTML, CSS, and JavaScript.

## Open locally
Open dist/index.html in a browser. For consistent cart storage across pages, serve the dist directory with VS Code Live Server or `python3 -m http.server 8000 --directory dist`, then open http://localhost:8000.

## Pages and features
- Home: introduction and featured dishes.
- Menu: array of dish objects, live search, category filters, sorting, add-to-cart.
- Order: Order class, quantity updates, removal, total calculation, validated demo checkout.
- About: fictional restaurant story and semantic opening-hours table.
- Contact: labelled validated form and character counter.

## Lesson connections
Semantic HTML uses header, nav, main, section, article, aside, and footer. CSS includes grid, the box model, focus states, and responsive media queries. JavaScript uses arrays, objects, classes, functions, conditions, iteration, DOM updates, event handling, and browser-local storage. Text entered by visitors is rendered with textContent.

## Demo limitations
No real restaurant, payment, message delivery, server, PHP, database, or AJAX integration. Cart information stays in this browser only. Food artwork uses decorative emoji, whose appearance differs between devices. Hours and contact details are illustrative.

## Suggested presentation
Show navigation and narrow-screen layout. Search and filter the menu. Add 2 Jollof Rice and 3 Sobolo: total GHS 100.00. Change a quantity, remove an item, and demonstrate validation and checkout. Explain the menu objects, Order class, DOM updates, and media queries. Finally show the contact character counter and explain the demo boundaries.
