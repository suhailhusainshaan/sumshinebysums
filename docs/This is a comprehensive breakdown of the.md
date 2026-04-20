This is a comprehensive breakdown of the Sumshine Admin Backend Requirements. I have structured this as a "Technical Specification & Training Guide." You can feed specific sections of this prompt back to me (or any AI) when you are ready to implement a particular feature.

🏗️ Global System Requirements & Standards
Before implementing specific endpoints, ensure the following architectural standards are met:

Base URL: http://localhost:8080/api

Authentication: Secure all /admin/** routes using Spring Security with JWT (Bearer Token). The frontend will send the token in the Authorization header.

Standard Response Wrapper: Every single response must follow this JSON structure:

JSON
{ "data": <payload>, "message": "String description", "status": 200 }
Error Handling: For validation errors (400), use:

JSON
{ "errors": { "fieldName": "error message" }, "message": "Validation failed", "status": 400 }
Images: Store and return imageUrl as relative paths or encoded strings. The frontend will prefix these with a base environment variable.

Dates: All timestamps must be in ISO-8601 format.

1. Authentication & User Context
1.1 Current User Context (GET /auth/me)
Context: This endpoint is used by the Next.js app to verify the session and populate the admin profile dropdown or sidebar.
Requirement: Create a GET endpoint that extracts the user ID from the JWT. It should return the id, name, email, and role (strictly "ADMIN"). This is a critical "handshake" endpoint to move the UI from a loading state to the dashboard.

2. Dashboard Analytics & Metrics
2.1 Dashboard KPI Metrics (GET /admin/dashboard/metrics)
Context: Provides the top-level cards (Customers, Orders).
Requirement: Calculate total counts and the deltaPercent (percentage change compared to the previous period). Include a trend field which must be a string: "up" or "down".

2.2 Monthly Sales Chart (GET /admin/dashboard/monthly-sales)
Context: Feeds the main bar/line chart on the home page.
Requirement: Aggregate sales data by month for the current year. Return an array of 12 labels (Jan-Dec) and a series object containing the data points.

2.3 Monthly Target Progress (GET /admin/dashboard/monthly-target)
Context: Feeds a radial/gauge chart showing progress toward a monthly goal.
Requirement: Calculate progressPercent based on revenue vs. target. The payload must include the specific currency values for revenue and the defined target.

2.4 Weekly Statistics Comparison (GET /admin/dashboard/statistics)
Context: A multi-series chart comparing two variables (e.g., Sales vs. Visitors).
Requirement: Return data for the last 7 days (Mon through Sun). Ensure both "Sales" and "Visitors" series have matching data lengths.

2.5 Recent Orders Table (GET /admin/orders/recent)
Context: A summary table on the dashboard showing the latest activity.
Requirement: Fetch the most recent 5-10 orders. Include productName, variantLabel, price, and a status string (e.g., "Delivered", "Pending").

2.6 Regional Demographics (GET /admin/dashboard/demographics)
Context: Breakdown of users by region.
Requirement: Aggregate user counts by continent or region and return a list of objects with label and percent.

3. Category Management
3.1 Create Category (POST /admin/categories)
Context: Used for organizing products.
Requirement: Handle name, slug, description, and an optional parent ID (for nested hierarchies). Ensure the slug is unique and URL-friendly.

3.2 Update Category (PUT /admin/categories/{id})
Context: Editing existing category details.
Requirement: Allow updating specific fields. If the slug changes, ensure it doesn't conflict with existing records.

3.3 Delete Category (DELETE /admin/categories/{id})
Context: Removing categories.
Requirement: Implement logic to handle "orphaned" products (either prevent deletion if products exist or nullify their category reference).

4. Brand Management
4.1 Brand CRUD Operations (GET /brands, POST, PUT, DELETE /admin/brands/**)
Context: Managing manufacturers/brands shown in product filters.
Requirement: The GET list should be public (no /admin prefix needed if used on the storefront later), but mutations (POST/PUT/DELETE) must be protected. Fields: name, slug, description.

5. Product & Variant Core
5.1 Product Deletion (DELETE /admin/products/{id})
Context: Permanent removal of a product.
Requirement: Perform a cascade delete or a soft delete (depending on business rules) for all associated variants and images.

6. Product Variants (Deep Management)
6.1 Variant Details & Retrieval (GET /admin/variants/{id})
Context: Detailed view for the Variant Edit page.
Requirement: Return the complete variant object, including nested dimensionsJson (unit, width, height, length) and an array of images.

6.2 Variant Mutation (POST /admin/products/{id}/variants and PUT /admin/variants/{id})
Context: Adding options like Size or Color to a product.
Requirement: Support sku, price, compareAtPrice (for discounts), costPrice (for margin calculation), and stockQuantity.

7. Media & Image Management
7.1 Variant Image Upload (POST /admin/variants/{id}/images)
Context: Adding photos to a specific variant.
Requirement: Handle multipart/form-data. Store the file on the server/S3, generate a relative imageUrl, and accept an optional altTexts[] array.

7.2 Image Ordering & Featured Status (PATCH /admin/variants/{id}/images/order)
Context: Drag-and-drop reordering in the UI.
Requirement: Accept a list of objects containing id, displayOrder, and featureImage (boolean). Update all associated image records in a single transaction.

8. Admin Profile & Settings
8.1 Profile & Avatar Management (GET, PUT /admin/users/me & POST /admin/users/me/avatar)
Context: Personal settings for the logged-in administrator.
Requirement: Support updating basic info (email, phone) and physical address. The avatar upload should replace the previous file and return the new avatarUrl.

9. System Notifications
9.1 Notification Feed (GET, PATCH /admin/notifications/**)
Context: Real-time alerts for the admin.
Requirement: Fetch a list of notifications. The PATCH endpoint should allow marking a notification as read: true via its ID.

10. Admin Calendar
10.1 Event Management (GET, POST, PUT, DELETE /admin/calendar/events/**)
Context: Scheduling jewelry expos or sales events.
Requirement: Store title, start date, and end date. Ensure date ranges are validated (start cannot be after end).