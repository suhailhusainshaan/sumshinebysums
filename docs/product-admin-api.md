# Product Admin API Contract

**Purpose**: API request/response contract for Product List, Product View/Edit, Variant View/Edit, and Variant Images.

**Base URL**: `http://localhost:8080/api`

**Audience**: Java backend developer

**Last Updated**: 2026-03-29

---

## Conventions
- All responses wrap data in a top-level `data` field with `status` and `message`.
- Timestamps are ISO-8601 (`YYYY-MM-DDTHH:mm:ss.SSSZ`).
- `imageUrl` values are stored as a path or encoded path and should be resolved on the client with `NEXT_PUBLIC_IMG_URL`.

---

## 1) Product List
**GET** `/admin/products/list`

**Query Params**
- `page`: number (0-based)
- `size`: number
- `searchTerm`: string

**Response (200)**
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

---

## 2) Product Detail
**GET** `/admin/products/{productId}`

**Response (200)**
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
    "variants": [
      {
        "id": 41,
        "sku": "SLV-HOOP-001-MEEQ",
        "name": "Silver Hooks",
        "price": 100.00,
        "compareAtPrice": 10.00,
        "costPrice": null,
        "stockQuantity": 10,
        "displayOrder": 0,
        "weight": 0.00,
        "dimensionsJson": { "unit": "cm", "width": "", "height": "", "length": "" },
        "images": [
          {
            "id": 25,
            "imageUrl": "cHJvZHVjdHMvNDQvNDEvMS5qcGc=",
            "altText": "",
            "displayOrder": 0,
            "featureImage": true
          }
        ],
        "active": true
      }
    ]
  },
  "message": "Product details fetched successfully.",
  "status": 200
}
```

---

## 3) Categories
**GET** `/categories`

**Response (200)**
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

---

## 4) Brands (optional but recommended)
**GET** `/brands`

**Response (200)**
```json
{
  "data": [
    { "id": 1, "name": "Sumshine" }
  ],
  "message": "Brands fetched successfully.",
  "status": 200
}
```

---

## 5) Update Product
**PUT** `/admin/products/{productId}`

**Request Body**
```json
{
  "name": "Bangle",
  "slug": "bangle",
  "description": "Updated description",
  "brandId": 1,
  "categoryId": 1,
  "published": true,
  "displayOrder": 2,
  "features": {
    "material": "Silver",
    "finish": "Glossy",
    "hypoallergenic": false
  },
  "specifications": {
    "material": "Silver",
    "purity": "100%",
    "stone_type": "Diamond",
    "hypoallergenic": false
  }
}
```

**Response (200)**
```json
{
  "message": "Product updated successfully.",
  "status": 200
}
```

---

# Variant APIs (required to make Variant Edit fully dynamic)

## 6) Variant Detail
**GET** `/admin/variants/{variantId}`

**Response (200)**
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
    "dimensionsJson": {
      "unit": "cm",
      "width": "",
      "height": "",
      "length": ""
    },
    "images": [
      {
        "id": 25,
        "imageUrl": "cHJvZHVjdHMvNDQvNDEvMS5qcGc=",
        "altText": "",
        "displayOrder": 0,
        "featureImage": true
      }
    ],
    "active": true
  },
  "message": "Variant details fetched successfully.",
  "status": 200
}
```

---

## 7) Update Variant
**PUT** `/admin/variants/{variantId}`

**Request Body**
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
  "dimensionsJson": {
    "unit": "cm",
    "width": "",
    "height": "",
    "length": ""
  },
  "active": true
}
```

**Response (200)**
```json
{
  "message": "Variant updated successfully.",
  "status": 200
}
```

---

# Variant Image APIs (required for upload/delete/reorder)

## 8) Upload Variant Images
**POST** `/admin/variants/{variantId}/images`

**Request (multipart/form-data)**
- `images[]`: one or more image files
- Optional: `altTexts[]` (aligned to images)

**Response (200)**
```json
{
  "data": [
    {
      "id": 101,
      "imageUrl": "products/44/41/1.jpg",
      "altText": "Front view",
      "displayOrder": 1,
      "featureImage": false
    }
  ],
  "message": "Variant images uploaded successfully.",
  "status": 200
}
```

---

## 9) Delete Variant Image
**DELETE** `/admin/variants/{variantId}/images/{imageId}`

**Response (200)**
```json
{
  "message": "Variant image deleted successfully.",
  "status": 200
}
```

---

## 10) Reorder / Feature Image
**PATCH** `/admin/variants/{variantId}/images/order`

**Request Body**
```json
{
  "order": [
    { "id": 101, "displayOrder": 0, "featureImage": true },
    { "id": 102, "displayOrder": 1, "featureImage": false }
  ]
}
```

**Response (200)**
```json
{
  "message": "Variant image order updated successfully.",
  "status": 200
}
```

---

## 11) (Optional) Variant List by Product
**GET** `/admin/products/{productId}/variants`

**Response (200)**
```json
{
  "data": [
    {
      "id": 41,
      "name": "Silver Hooks",
      "sku": "SLV-HOOP-001-MEEQ",
      "price": 100.00,
      "active": true
    }
  ],
  "message": "Variants fetched successfully.",
  "status": 200
}
```
