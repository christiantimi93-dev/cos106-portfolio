# Student Portfolio & Academic Management Website

**COS 106 – Introduction to Web Technologies · Term Project**
**Student:** Undutimi Ayakoroma · BSc Software Engineering, 100 Level · MIVA Open University

- **Live site:** https://cos106-portfolio-zeta.vercel.app
- **Repository:** https://github.com/christiantimi93-dev/cos106-portfolio

A responsive, multi-page personal portfolio and academic management website built with **HTML5, CSS3 and vanilla JavaScript** (no frameworks).

## Pages

| Page | File | What it contains |
|------|------|------------------|
| Home | `index.html` | Name and photograph, welcome message, navigation menu, brief biography, animated stats, social links |
| About Me | `about.html` | Educational background (table), career aspirations, technical skills (animated bars), hobbies and interests, embedded video |
| Projects | `projects.html` | Four projects with descriptions, screenshots, live/simulated links and a JavaScript status filter |
| Academic Planner | `planner.html` | Interactive task manager: add, complete, delete, filter and clear tasks, with a progress bar and saved data; weekly timetable (table) |
| Contact | `contact.html` | Form with Name, Email, Phone and Message, validated with JavaScript |

## How the requirements are met

### HTML
- **Semantic elements:** `header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `figcaption`, `footer`, `blockquote`
- **Forms:** the planner's task form and the contact form
- **Tables:** the education table (About) and the weekly study timetable (Planner)
- **Images:** profile photo and project screenshots
- **Hyperlinks:** navigation, project links, GitHub and social links
- **Lists:** ordered (career steps) and unordered (navigation, skills, hobbies, tags, tasks)
- **Multimedia:** embedded YouTube video on the About page

### CSS (`css/style.css`, a single external stylesheet)
- Responsive design with media queries at 900px, 760px and 600px; tables turn into stacked cards on phones
- **CSS Grid** for the hero, stats, projects, planner and contact layouts; **Flexbox** for the navbar, buttons, task items and footer
- Styled navigation with animated underline and a mobile hamburger menu
- Animations and transitions: scroll reveal, glowing photo frame, hover lifts, typing cursor, skill-bar fill, task add/remove
- Consistent black-and-gold colour scheme defined with CSS custom properties
- Respects `prefers-reduced-motion`

### JavaScript
- **Event handling:** clicks, form submit, input/blur, change, keydown, scroll
- **DOM manipulation:** tasks rendered from a `<template>`; filters show and hide cards; live stats and progress bar
- **Form validation** (`js/contact.js`): no empty fields, valid email format (regex), digits-only phone number (7–15 digits)
- **Dynamic content updates:** typing effect, animated counters, success messages, footer year
- **Arrays and functions:** the tasks array uses `map`, `filter`, `forEach`, `find` and `every`
- **Interactive task management** (`js/planner.js`): add, complete, delete, filter and clear completed tasks, saved in `localStorage`

## Project structure

```
cos106-portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js       # navigation, scroll reveal, counters, typing effect
│   ├── projects.js   # project filter
│   ├── planner.js    # academic planner
│   └── contact.js    # contact form validation
└── assets/images/    # profile photo, project screenshots, favicon
```

## Run locally

No build step is needed. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deployment

Hosted on **Vercel** as a static site, deployed from this GitHub repository.
