# Homepage Slider Media Upload API

The current frontend can list and update existing static content/media assets, but it does not have a working API for creating a new media asset. `POST /admin/media-assets` and `POST /admin/static-content` are not supported by the backend at the time of this note.

## Required Endpoint

### Create Media Asset

`POST /api/admin/media-assets`

Requires JWT authentication.

Request: `multipart/form-data`

- `request`: JSON part
- `image`: image file part

Example `request` JSON:

```json
{
  "key": "homepage.slider.summer-collection",
  "type": "image",
  "altText": "Summer collection banner",
  "metadata": {
    "section": "homepage",
    "usage": "slider"
  },
  "isActive": true
}
```

Response:

```json
{
  "data": {
    "id": 15,
    "key": "homepage.slider.summer-collection",
    "url": "uploads/slider/summer-collection.jpg",
    "type": "image",
    "altText": "Summer collection banner",
    "metadata": {
      "section": "homepage",
      "usage": "slider"
    },
    "isActive": true,
    "createdAt": "2026-06-18T12:00:00Z",
    "updatedAt": "2026-06-18T12:00:00Z"
  },
  "message": "Media asset created successfully.",
  "status": 200
}
```

After this endpoint exists, the admin slider form can upload an image, read `data.id`, and create the slider with:

```json
{
  "mediaAssetId": 15,
  "redirectUrl": "/collections/summer",
  "displayOrder": 0,
  "isActive": true
}
```
