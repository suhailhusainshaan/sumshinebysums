# Backend API Notes (Java) – Sumshine Admin

**Goal**: Provide a comprehensive API checklist to make the Next.js admin app fully dynamic.

**Response Pattern** (required across all endpoints):
```json
{ "data": <payload>, "message": "...", "status": 200 }
```

**Base URL**: `http://localhost:8080/api`

**Auth**: Bearer token via `Authorization: Bearer <token>` (frontend axios adds token from `localStorage`).

---

## 1) Auth & User

### 1.1 Login
**POST** `/auth/login`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Request**
```json
{ "email": "admin@sumshine.com", "password": "secret" }
```

**Response**
```json
{
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "name": "Admin", "email": "admin@sumshine.com", "role": "ADMIN" }
  },
  "message": "Login successful",
  "status": 200
}
```

### 1.2 Register (optional UI: Sign Up)
**POST** `/auth/register`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Request**
```json
{ "name": "Admin", "email": "admin@sumshine.com", "password": "secret" }
```

**Response**
```json
{ "data": { "id": 1 }, "message": "User registered", "status": 200 }
```

### 1.3 Current User (optional UI: profile, dropdown)
**GET** `/auth/me`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Response**
```json
{
  "data": { "id": 1, "name": "Admin", "email": "admin@sumshine.com", "role": "ADMIN" },
  "message": "Current user",
  "status": 200
}
```

### 1.5 Refresh Token (optional)
**POST** `/auth/refresh`

**Status**: ⬜ Not integrated yet

**Request**
```json
{ "refreshToken": "<refresh-token>" }
```

**Response**
```json
{ "data": { "token": "<jwt>" }, "message": "Token refreshed", "status": 200 }
```

---

## 2) Dashboard (Admin Home)
Pages under `/admin` currently use **static data**.

### 2.1 Dashboard Metrics
**GET** `/admin/dashboard/metrics`

**Status**: ⬜ Not integrated yet

**Response**
```json
{
  "data": {
    "customers": { "value": 3782, "deltaPercent": 11.01, "trend": "up" },
    "orders": { "value": 5359, "deltaPercent": 9.05, "trend": "down" }
  },
  "message": "Dashboard metrics",
  "status": 200
}
```

### 2.2 Monthly Sales Chart
**GET** `/admin/dashboard/monthly-sales`

**Status**: ⬜ Not integrated yet

**Response**
```json
{
  "data": {
    "labels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    "series": [{ "name": "Sales", "data": [168,385,201,298,187,195,291,110,215,390,280,112] }]
  },
  "message": "Monthly sales",
  "status": 200
}
```

### 2.3 Monthly Target (Radial)
**GET** `/admin/dashboard/monthly-target`

**Status**: ⬜ Not integrated yet

**Response**
```json
{
  "data": {
    "progressPercent": 75.55,
    "deltaPercent": 10,
    "target": 20000,
    "revenue": 20000,
    "today": 20000
  },
  "message": "Monthly target",
  "status": 200
}
```

### 2.4 Statistics Chart
**GET** `/admin/dashboard/statistics`

**Status**: ⬜ Not integrated yet

**Response**
```json
{
  "data": {
    "labels": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    "series": [
      { "name": "Sales", "data": [12, 22, 20, 28, 16, 20, 26] },
      { "name": "Visitors", "data": [8, 12, 10, 18, 10, 16, 14] }
    ]
  },
  "message": "Weekly statistics",
  "status": 200
}
```

### 2.5 Recent Orders (table)
**GET** `/admin/orders/recent`

**Status**: ⬜ Not integrated yet

**Response**
```json
{
  "data": [
    {
      "id": 1,
      "productName": "MacBook Pro 13",
      "variantLabel": "2 Variants",
      "category": "Laptop",
      "price": 2399.00,
      "status": "Delivered",
      "imageUrl": "products/1.jpg"
    }
  ],
  "message": "Recent orders",
  "status": 200
}
```

### 2.6 Demographics (optional cards)
**GET** `/admin/dashboard/demographics`

**Status**: ⬜ Not integrated yet

**Response**
```json
{
  "data": {
    "regions": [
      { "label": "Asia", "percent": 45 },
      { "label": "Europe", "percent": 30 }
    ]
  },
  "message": "Demographic data",
  "status": 200
}
```

### 2.7 Country Map (optional)
**GET** `/admin/dashboard/country-map`

**Status**: ⬜ Not integrated yet

**Response**
```json
{ "data": { "countries": [] }, "message": "Country map", "status": 200 }
```

---

## 3) Categories
Currently used in `/admin/category` and product forms.

### 3.1 List Categories
**GET** `/categories`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Response**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Ear Rings",
      "slug": "earrings",
      "description": "Best silver ear rings in the market",
      "parent": null,
      "createdAt": "2026-03-12T13:05:08.677815",
      "updatedAt": "2026-03-12T13:05:08.677822",
      "logoUrl": null,
      "active": true
    }
  ],
  "message": "Filtered categories fetched successfully.",
  "status": 200
}
```

### 3.2 Create Category
**POST** `/admin/categories`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Request**
```json
{ "name": "Bracelets", "slug": "bracelets", "description": "All bracelets", "parent": null }
```

**Response**
```json
{ "data": { "id": 2 }, "message": "Category created", "status": 200 }
```

### 3.3 Update Category
**PUT** `/admin/categories/{categoryId}`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Request**
```json
{ "name": "Bracelets", "slug": "bracelets", "description": "Updated" }
```

**Response**
```json
{ "data": { "id": 2 }, "message": "Category updated", "status": 200 }
```

### 3.4 Delete Category
**DELETE** `/admin/categories/{categoryId}`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Response**
```json
{ "data": null, "message": "Category deleted", "status": 200 }
```

---

## 4) Brands
Used in product form (currently static).

### 4.1 List Brands
**GET** `/brands`

**Status**: ⬜ Not integrated yet

**Response**
```json
{ "data": [ { "id": 1, "name": "Sumshine" } ], "message": "Brands fetched", "status": 200 }
```

### 4.2 Create Brand
**POST** `/admin/brands`

**Request**
```json
{ "name": "Sumshine", "slug": "sumshine", "description": "First brand" }
```

**Response**
```json
{ "data": { "id": 1 }, "message": "Brand created", "status": 200 }
```

### 4.3 Update Brand
**PUT** `/admin/brands/{brandId}`

**Request**
```json
{ "name": "Sumshine", "description": "Updated" }
```

**Response**
```json
{ "data": { "id": 1 }, "message": "Brand updated", "status": 200 }
```

### 4.4 Delete Brand
**DELETE** `/admin/brands/{brandId}`

**Response**
```json
{ "data": null, "message": "Brand deleted", "status": 200 }
```

---

## 5) Products

### 5.1 Product List
**GET** `/admin/products/list?page=0&size=10&searchTerm=foo`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Response**
```json
{
  "data": {
    "content": [
      {
        "id": 44,
        "name": "Bangle",
        "slug": "bangle",
        "published": false,
        "createdAt": "2026-03-20T12:00:40.285335Z",
        "category": { "id": 1, "name": "Ear Rings" },
        "images": [
          { "id": 25, "imageUrl": "cHJvZHVjdHMvNDQvNDEvMS5qcGc=", "featureImage": true }
        ]
      }
    ],
    "totalPages": 4
  },
  "message": "Products fetched successfully.",
  "status": 200
}
```

### 5.2 Product Detail
**GET** `/admin/products/{productId}`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Response**
```json
{
  "data": {
    "id": 44,
    "name": "Bangle",
    "slug": "bangle",
    "description": "New bangles",
    "displayOrder": null,
    "published": false,
    "createdAt": "2026-03-20T12:00:40.285335Z",
    "updatedAt": "2026-03-20T12:00:40.285341Z",
    "brand": { "id": 1, "name": "Sumshine" },
    "category": { "id": 1, "name": "Ear Rings" },
    "features": { "finish": "", "material": "", "hypoallergenic": false },
    "specifications": {
      "purity": "100%",
      "material": "Silver",
      "stone_type": "Diamond",
      "hypoallergenic": false
    },
    "variants": []
  },
  "message": "Product details fetched successfully.",
  "status": 200
}
```

### 5.3 Create Product (used in Add Product)
**POST** `/admin/products`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Request** (multipart/form-data)
- `request` (JSON string)
- `image` (file)

Example JSON body in `request` part:
```json
{
  "name": "Bangle",
  "slug": "bangle",
  "description": "New bangles",
  "brandId": 1,
  "categoryId": 1,
  "features": { "material": "", "finish": "", "hypoallergenic": false },
  "specifications": { "material": "Silver", "purity": "100%", "stone_type": "Diamond" },
  "sku": "SKU-001",
  "variantName": "Default",
  "price": 100,
  "compareAtPrice": 120,
  "costPrice": 60,
  "stockQuantity": 10,
  "weight": 0,
  "dimensions": { "length": "", "width": "", "height": "", "unit": "cm" },
  "altText": ""
}
```

**Response**
```json
{ "data": { "id": 44 }, "message": "Product created", "status": 200 }
```

### 5.4 Update Product
**PUT** `/admin/products/{productId}`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Request**
```json
{
  "name": "Bangle",
  "slug": "bangle",
  "description": "Updated description",
  "brandId": 1,
  "categoryId": 1,
  "published": true,
  "displayOrder": 2,
  "features": { "material": "Silver", "finish": "Glossy", "hypoallergenic": false },
  "specifications": { "material": "Silver", "purity": "100%", "stone_type": "Diamond" }
}
```

**Response**
```json
{ "data": { "id": 44 }, "message": "Product updated", "status": 200 }
```

### 5.5 Delete Product (optional)
**DELETE** `/admin/products/{productId}`

**Status**: ✅ Developed in java

**Status**: ✅ Integrated in Next.js

**Response**
```json
{ "data": null, "message": "Product deleted", "status": 200 }
```

---

## 6) Variants

### 6.1 Variant Detail
**GET** `/admin/variants/{variantId}`

**Status**: ⬜ Not integrated yet

**Response**
```json
{
  "data": {
    "id": 41,
    "sku": "SLV-HOOP-001-MEEQ",
    "name": "Silver Hooks",
    "price": 100.00,
    "compareAtPrice": 10.00,
    "costPrice": 60.00,
    "stockQuantity": 10,
    "displayOrder": 0,
    "weight": 0.00,
    "dimensionsJson": { "unit": "cm", "width": "", "height": "", "length": "" },
    "images": [
      { "id": 25, "imageUrl": "cHJvZHVjdHMvNDQvNDEvMS5qcGc=", "altText": "", "displayOrder": 0, "featureImage": true }
    ],
    "active": true
  },
  "message": "Variant details fetched successfully.",
  "status": 200
}
```

### 6.2 Update Variant
**PUT** `/admin/variants/{variantId}`

**Status**: ⬜ Not integrated yet

**Request**
```json
{
  "name": "Silver Hooks",
  "sku": "SLV-HOOP-001-MEEQ",
  "price": 100.00,
  "compareAtPrice": 120.00,
  "costPrice": 60.00,
  "stockQuantity": 10,
  "displayOrder": 0,
  "weight": 0.00,
  "dimensionsJson": { "unit": "cm", "width": "", "height": "", "length": "" },
  "active": true
}
```

**Response**
```json
{ "data": { "id": 41 }, "message": "Variant updated", "status": 200 }
```

### 6.3 Create Variant (optional)
**POST** `/admin/products/{productId}/variants`

**Status**: ⬜ Not integrated yet

**Request**
```json
{ "name": "Small", "sku": "SKU-S", "price": 99.0, "stockQuantity": 10 }
```

**Response**
```json
{ "data": { "id": 41 }, "message": "Variant created", "status": 200 }
```

### 6.4 Delete Variant (optional)
**DELETE** `/admin/variants/{variantId}`

**Response**
```json
{ "data": null, "message": "Variant deleted", "status": 200 }
```

---

## 7) Variant Images
Used in Variant Edit page (upload/remove/reorder).

### 7.1 Upload Images
**POST** `/admin/variants/{variantId}/images`

**Status**: ⬜ Not integrated yet

**Request** (multipart/form-data)
- `images[]`: one or more files
- optional `altTexts[]`

**Response**
```json
{
  "data": [
    { "id": 101, "imageUrl": "products/44/41/1.jpg", "altText": "Front", "displayOrder": 0, "featureImage": true }
  ],
  "message": "Variant images uploaded",
  "status": 200
}
```

### 7.2 Delete Image
**DELETE** `/admin/variants/{variantId}/images/{imageId}`

**Response**
```json
{ "data": null, "message": "Variant image deleted", "status": 200 }
```

### 7.3 Reorder / Set Featured
**PATCH** `/admin/variants/{variantId}/images/order`

**Request**
```json
{
  "order": [
    { "id": 101, "displayOrder": 0, "featureImage": true },
    { "id": 102, "displayOrder": 1, "featureImage": false }
  ]
}
```

**Response**
```json
{ "data": null, "message": "Image order updated", "status": 200 }
```

---

## 8) User Profile (optional UI pages)
These are currently static but likely needed for a complete admin.

### 8.1 Get Profile
**GET** `/admin/users/me`

**Response**
```json
{
  "data": { "id": 1, "name": "Admin", "email": "admin@sumshine.com", "phone": "+91-9999999999" },
  "message": "Profile fetched",
  "status": 200
}
```

### 8.2 Update Profile
**PUT** `/admin/users/me`

**Request**
```json
{ "name": "Admin", "email": "admin@sumshine.com", "phone": "+91-9999999999" }
```

**Response**
```json
{ "data": { "id": 1 }, "message": "Profile updated", "status": 200 }
```

### 8.3 Update Address
**PUT** `/admin/users/me/address`

**Request**
```json
{ "line1": "Address 1", "line2": "Address 2", "city": "Mumbai", "state": "MH", "zip": "400001" }
```

**Response**
```json
{ "data": null, "message": "Address updated", "status": 200 }
```

### 8.4 Upload Avatar
**POST** `/admin/users/me/avatar`

**Request** (multipart/form-data)
- `avatar` (file)

**Response**
```json
{ "data": { "avatarUrl": "users/1/avatar.jpg" }, "message": "Avatar updated", "status": 200 }
```

---

## 9) Notifications (optional)
Used in the header dropdown (currently static).

### 9.1 List Notifications
**GET** `/admin/notifications`

**Response**
```json
{
  "data": [
    { "id": 1, "title": "New order", "body": "Order #1234", "read": false, "createdAt": "2026-03-30T08:00:00Z" }
  ],
  "message": "Notifications fetched",
  "status": 200
}
```

### 9.2 Mark as Read
**PATCH** `/admin/notifications/{notificationId}`

**Request**
```json
{ "read": true }
```

**Response**
```json
{ "data": null, "message": "Notification updated", "status": 200 }
```

---

## 10) Calendar (optional)
Used in `/admin/calendar` page.

### 10.1 List Events
**GET** `/admin/calendar/events`

**Response**
```json
{
  "data": [
    { "id": 1, "title": "Jewelry Expo", "start": "2026-04-02", "end": "2026-04-03" }
  ],
  "message": "Events fetched",
  "status": 200
}
```

### 10.2 Create Event
**POST** `/admin/calendar/events`

**Request**
```json
{ "title": "Jewelry Expo", "start": "2026-04-02", "end": "2026-04-03" }
```

**Response**
```json
{ "data": { "id": 1 }, "message": "Event created", "status": 200 }
```

### 10.3 Update Event
**PUT** `/admin/calendar/events/{eventId}`

**Request**
```json
{ "title": "Jewelry Expo", "start": "2026-04-02", "end": "2026-04-03" }
```

**Response**
```json
{ "data": { "id": 1 }, "message": "Event updated", "status": 200 }
```

### 10.4 Delete Event
**DELETE** `/admin/calendar/events/{eventId}`

**Response**
```json
{ "data": null, "message": "Event deleted", "status": 200 }
```

---

## 11) Media Base URL
The frontend resolves images as:
```
${NEXT_PUBLIC_IMG_URL}${imageUrl}
```
Ensure backend returns `imageUrl` as a relative path or encoded path.

---

## Notes for Java Backend
- Use consistent response wrapper: `{ data, message, status }`.
- Prefer `status` as numeric HTTP status (200, 400, etc.).
- For validation errors, return:
```json
{ "errors": { "field": "message" }, "message": "Validation failed", "status": 400 }
```
- All timestamps should be ISO-8601 strings.
- For images, store and return both `imageUrl` and `displayOrder`.

