# 🛒 Society Market

A full-stack e-commerce web application built with **Next.js** and **MongoDB**, where users can browse and search products, manage a wishlist and cart, checkout and place orders, and manage their profile — while admins get a dedicated dashboard to manage products, categories, and orders.

## 🚀 Features

### 👤 User Side
- 🔍 Search products
- 🗂️ View products by category
- ❤️ Add products to wishlist
- 🛒 Add products to cart
- 💳 Checkout and place orders
- 📦 View and track own orders
- 🙍 Update own profile
- 🔐 Login / Logout authentication (NextAuth)
- 🏠 Home page with banner, navbar, and about page

### 🛠️ Admin Side (Admin Dashboard)
- 🔐 Separate admin login / logout
- ➕ Add new products
- ✏️ Edit and delete products
- ➕ Add new categories
- ✏️ Edit and delete categories
- 🙍 Update admin profile
- 📦 Update order status (e.g., pending → shipped → delivered)


## 🛠️ Tech Stack

- **Framework:** Next.js (`next` v16.2.9)
- **UI Library:** React / React DOM (v19.2.4)
- **Database:** MongoDB with Mongoose (`mongoose` v9.7.0)
- **Authentication:** NextAuth (`next-auth`)
- **Styling:** Tailwind CSS (`tailwindcss` + `@tailwindcss/postcss`)
- **HTTP Client:** Axios
- **AI Integration:** OpenAI API client (`openai`)
- **Code Quality:** ESLint (`eslint`, `eslint-config-next`)

## 📂 Project Structure

```
society-market/
│
├── app/
│   ├── (auth)/            # Login / Register pages
│   ├── admin/              # Admin dashboard routes
│   │   ├── products/
│   │   ├── categories/
│   │   └── orders/
│   ├── api/                 # API routes (auth, products, orders, categories)
│   ├── cart/
│   ├── wishlist/
│   ├── checkout/
│   ├── profile/
│   ├── about/
│   └── page.js              # Home page
│
├── components/               # Navbar, Banner, ProductCard, etc.
├── models/                    # Mongoose schemas (User, Product, Category, Order)
├── lib/                        # DB connection, auth config, helpers
├── public/
├── .env.local
├── package.json
└── README.md
```

## ⚙️ How It Works

1. Users browse products by category or search directly by name.
2. Products can be added to a wishlist or cart.
3. During checkout, order details are saved and linked to the logged-in user.
4. Admins log in through a separate admin flow to manage products, categories, and incoming orders.
5. Order statuses are updated by the admin and reflected in the user's order history.


## 💡 Challenges Faced

- Structuring role-based access so admin routes and actions stay fully separate from the regular user flow.
- Keeping cart, wishlist, and order state consistent with the logged-in user session via NextAuth.
- Designing a clean Mongoose schema structure for products, categories, and orders that supports both the storefront and the admin dashboard without duplication.

## 📚 What I Learned

- Building full-stack apps with the Next.js App Router
- Implementing authentication and role-based access using NextAuth
- Designing MongoDB schemas with Mongoose for a real e-commerce data model
- Managing cart, wishlist, and checkout flows end-to-end
- Building an admin dashboard with full CRUD for products, categories, and orders
- Combining hand-written code with AI-assisted development to build and ship faster

## 🔮 Future Improvements

- 💳 Online payment gateway integration
- ⭐ Product reviews and ratings
- 📊 Sales analytics on the admin dashboard
- 🔔 Order status notifications (email)
- 🖼️ Multiple product images / image gallery
- 📱 Further mobile responsiveness improvements

## 🔗 Live Demo

👉 Live Website: https://ecommerce-mongodb-rde8r5shp-rahims-projects-82168372.vercel.app/

## 👨‍💻 Author

**Rahim**

If you found this project helpful or interesting, feel free to ⭐ the repository and share your feedback. Contributions, suggestions, and improvements are always welcome!
