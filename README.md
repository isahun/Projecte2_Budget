# BudgetApp | Reactive Angular Calculator Project 2)

A high-performance, reactive budget management system built with **Angular 21+**. This project demonstrates advanced state management using **Angular Signals**, seamless **Supabase** integration for real-time persistence, and a modern, accessible UI designed with a mobile-first approach.

---

## Key Features

- **Signal-Based Reactivity:** Full implementation of `signal`, `computed`, and `input.required()` to ensure a declarative and high-performance data flow without manual change detection.
- **Dynamic Web Customizer:** An interactive sub-menu for web projects that calculates additional costs based on the number of pages and languages using a custom stepper component.
- **Real-Time Persistence:** Integrated with **Supabase** (PostgreSQL) for reliable CRUD operations, ensuring budget history is synchronized across sessions.
- **Advanced Filtering & Sorting:**  
  - Real-time search by client name.  
  - Dynamic sorting by Date, Client Name, or Total Amount (Ascending/Descending).
- **Responsive Aquamarine UI:** A custom design system built from scratch using CSS Grid and Flexbox, featuring a "Sticky" history sidebar for desktop users.
- **Accessibility (A11y) First:**  
  - Semantic HTML5 elements (`<search>`, `<fieldset>`, `<legend>`).
  - Screen-reader support via `.sr-only` utility classes.
  - Interactive elements optimized for keyboard navigation and focus visibility.
- **Robust Testing Suite:** Configured with **Vitest** for modern, fast unit testing of components and services.

---

## Tech Stack & Architecture

- **Framework:** Angular 21+ (Standalone Architecture)
- **Backend-as-a-Service:** Supabase (Database & Auth)
- **Testing:** Vitest
- **Language:** TypeScript
- **Styling:** Modern CSS with Custom Properties (Design Tokens)
- **State Pattern:** Service-driven state (Smart Service) providing computed signals to presentational components.

### File Structure & Responsibilities

| Path | Responsibility |
| :--- | :--- |
| `src/app/components/header/` | Branding and main application header. |
| `src/app/components/budget-calculator/` | Main orchestration component for the budget creation logic. |
| `src/app/components/service-card/` | UI for selecting specific services (SEO, Ads, Web). |
| `src/app/components/web-customizer/` | Specialized panel for configuring web pages and languages. |
| `src/app/components/info-modal/` | Reusable modal for displaying detailed service information. |
| `src/app/components/budget-form/` | Client data capture form (Name, Email, Phone). |
| `src/app/components/budget-history/` | Section container for the saved budgets list and search controls. |
| `src/app/components/budget-search/` | Semantic filtering UI for searching and sorting the history. |
| `src/app/components/budget-list/` | Reactive container that loops through the filtered budget collection. |
| `src/app/components/budget-card/` | Display card for a single entry in the budget history list. |
| `src/app/services/` | **BudgetService**: The core logic provider; manages Signals and Supabase CRUD. |
| `src/app/core/data/` | Static data definitions (initial services, info texts). |
| `src/app/interfaces/` | TypeScript contracts and data models (Budget, Service). |
| `src/app/config/` | Infrastructure setup, including Supabase client initialization. |
| `src/styles.css` | Global design system, color tokens (Aquamarine), and A11y resets. |

---

## Getting Started

### 1. Prerequisites
- **Node.js:** v22.0.0 or higher
- **Angular CLI:** `npm install -g @angular/cli`

### 2. Installation
Clone the repository:
`git clone https://github.com/isahun/Project2_Budget.git`

Navigate to the project folder:
`cd budget-app`

Install dependencies:
`npm install`

### 3. Environment Setup
Create a configuration file to link your Supabase project:
`src/app/config/supabase.config.ts`

### 4. Development Server
Run the local dev server:
`ng serve`
Navigate to `http://localhost:4200/`.

---

## Styling Philosophy

The project follows a **Minimalist Design Token** approach:

* **Aquamarine Identity:** The UI is centered around a primary palette (`--clr-pri: #00c091`) used for borders, focus states, and interactive elements to provide a cohesive brand feel.
* **Layout Orchestration:** - **Mobile:** Single column flow for focused input.
  - **Desktop:** Two-column Grid layout with a `sticky` sidebar for the budget history to improve UX during long form completion.
* **Component Encapsulation:** Extensive use of the `:host` selector to manage component display types and internal spacing without leaking styles globally.
* **Micro-interactions:** Smooth transitions on hover states and card selections to provide instant visual feedback to the user.

---

## Accessibility Implementation

Accessibility is not an afterthought but a core technical requirement:

* **Semantic Search:** Utilization of the HTML5 `<search>` element and `type="search"` for native browser optimizations.
* **Logical Grouping:** Complex controls like sorting buttons are grouped within `<fieldset>` and described by `<legend>` for screen-reader clarity.
* **Visual Context:** Use of `aria-labelledby` and `aria-describedby` to link UI labels with their respective input groups.
* **Screen Reader Utilities:** A specialized `.sr-only` class ensures that descriptive text (like "Select SEO Service") is available for assistive technology while maintaining a clean visual interface.

---

##### Author: Irene V. Sahun - GitHub: isahun  
##### Created as part of the IT Academy Frontend BootCamp.
