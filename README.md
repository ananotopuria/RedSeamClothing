# RedSeam Clothing

RedSeam Clothing is an e-commerce web application where users can browse and purchase clothing products.  
The project was built as a practice assignment with a focus on **core e-commerce functionalities** such as product listings, filtering, cart management, and checkout.

---

## 📌 Features

### 🔑 Authentication

- **Login Page**

  - Users can log in with email and password.
  - Fields:
    - Email (must be valid)
    - Password (minimum 3 characters)

- **Registration Page**
  - Users can register with:
    - Username (unique, min. 3 characters)
    - Email (unique, valid format)
    - Password (min. 3 characters)
    - Confirm Password (must match password)
    - Avatar (optional, with preview before submission)
  - Validation errors are handled from the backend API.

---

### 🛍 Product Listings

- Product list displayed in a **3x4 grid**.
- **Pagination** – 10 products per page, with page navigation via numbers and arrows.
- **Sorting and filtering**:
  - Sort dropdown
  - Price range filter with input fields
- Each product card shows:
  - Image
  - Price
  - Name
- Clicking a product card opens its **detail page**.

---

### 📄 Product Detail Page

- Shows detailed information:
  - Name
  - Images
  - Colors (switching color updates the image and vice versa)
  - Sizes
  - Description
  - Brand name and logo
- **Add to Cart** button
  - Adding the same product (same size & color) increases its quantity.

---

### 🛒 Cart Sidebar

- Opens from navigation.
- If empty: shows a friendly message (e.g., _"Uh-oh, you’ve got nothing in your cart yet!"_).
- If items are present:
  - Displays list of products with name, image, price, size, and quantity controls (+/-).
  - Shows **summary** with total quantity and total price.
  - Checkout button navigates to the **Order Page**.

---

### 📦 Checkout Page

- Displays list of items being purchased.
- Includes form with the following fields:
  - First name
  - Last name
  - Email (pre-filled from API, editable)
  - Zip code
  - Address
- On submission:
  - Shows a **congratulatory confirmation modal**.
  - Empties the cart.

---

## 🛠 Tech Stack

- [React](https://react.dev/) – Frontend library
- [React Router DOM](https://reactrouter.com/) – Routing
- [React Icons](https://react-icons.github.io/react-icons/) – Icons
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [Vite](https://vitejs.dev/) – Development and build tool

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/redseamclothing.git
cd redseamclothing
npm install
npm run dev
```
