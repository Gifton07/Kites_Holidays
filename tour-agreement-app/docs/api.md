# API Documentation

This document describes the REST API endpoints available in the **Tour Agreement App** backend server. All relative paths are based on the main API root (default: `http://localhost:5000`).

---

## 🔒 Authentication & Headers

Protected endpoints require a **Bearer JWT Token** in the authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Routes (`/api/auth`)

### Authenticate Admin
* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "adim@gmail.com",
    "password": "Admin123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "admin": {
      "id": "65ab12...",
      "name": "Admin",
      "email": "adim@gmail.com"
    }
  }
  ```

### Get Current Admin Info
* **URL:** `/api/auth/me`
* **Method:** `GET`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "id": "65ab12...",
    "name": "Admin",
    "email": "adim@gmail.com"
  }
  ```

---

## 2. Agreements Routes (`/api/agreements`)

### Create Agreement (Public Booking)
* **URL:** `/api/agreements`
* **Method:** `POST`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St, Kerala",
    "destination": "Goa Trip Package",
    "startDate": "2026-07-01",
    "startTime": "08:00",
    "endDate": "2026-07-05",
    "arrivalTime": "20:00",
    "passengers": 40,
    "pickupLocation": "College Campus Main Gate",
    "advancePayment": 10000,
    "vehicleName": "Luxury Traveler",
    "packageRate": 150000
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": "65abc3...",
      "trackingId": "TRK-20260701-XYZ",
      "name": "John Doe",
      "status": "pending",
      "createdAt": "2026-06-12T00:00:00.000Z"
    }
  }
  ```

### Track Agreement (Public)
* **URL:** `/api/agreements/track/:trackingId`
* **Method:** `GET`
* **Auth Required:** No
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "trackingId": "TRK-20260701-XYZ",
      "name": "John Doe",
      "destination": "Goa Trip Package",
      "status": "pending",
      "packageRate": 150000,
      "advancePayment": 10000
    }
  }
  ```

### Download Agreement PDF (Public)
* **URL:** `/api/agreements/track/:trackingId/pdf`
* **Method:** `GET`
* **Auth Required:** No
* **Description:** Generates and downloads the PDF for the agreement if it has been approved.
* **Success Response:** File download stream (`application/pdf`).

### Get All Agreements (Admin)
* **URL:** `/api/agreements`
* **Method:** `GET`
* **Auth Required:** Yes
* **Query Parameters:**
  * `status` (optional): `pending`, `approved`, or `rejected`.
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "65abc3...",
      "name": "John Doe",
      "trackingId": "TRK-20260701-XYZ",
      "status": "approved",
      "packageRate": 150000
    }
  ]
  ```

### Get Agreement by ID (Admin)
* **URL:** `/api/agreements/:id`
* **Method:** `GET`
* **Auth Required:** Yes
* **Success Response (200 OK):** Fully detailed agreement object.

### Approve Agreement (Admin)
* **URL:** `/api/agreements/:id/approve`
* **Method:** `PATCH`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "adminSignatureDataUrl": "data:image/png;base64,..."
  }
  ```
* **Description:** Approves the agreement, stamps it with the admin's signature, compiles the PDF using Puppeteer, and triggers upload to MEGA cloud storage.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Agreement approved, PDF generated and queued for upload."
  }
  ```

### Reject Agreement (Admin)
* **URL:** `/api/agreements/:id/reject`
* **Method:** `PATCH`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "remarks": "Incorrect package rate listed."
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Agreement rejected."
  }
  ```

### Update Finances (Admin)
* **URL:** `/api/agreements/:id/finances`
* **Method:** `PATCH`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "cashIn": 50000,
    "cashOut": 20000
  }
  ```
* **Success Response (200 OK):** Updated agreement object.

### Regenerate PDF & Retry Mega Upload (Admin)
* **URL:** `/api/agreements/:id/regenerate-pdf`
* **Method:** `POST`
* **Auth Required:** Yes
* **Description:** Manually forces Puppeteer to regenerate the PDF and attempts a re-upload to MEGA cloud storage (useful if initial network upload failed).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "PDF regenerated and upload re-attempted."
  }
  ```

### Delete Agreement (Admin)
* **URL:** `/api/agreements/:id`
* **Method:** `DELETE`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Agreement deleted."
  }
  ```

---

## 3. Analytics Routes (`/api/analytics`)

### Get Summary Statistics
* **URL:** `/api/analytics/summary`
* **Method:** `GET`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "totalAgreements": 150,
    "pendingCount": 12,
    "approvedCount": 130,
    "rejectedCount": 8,
    "totalRevenue": 2250000,
    "pendingBalance": 450000
  }
  ```

### Get Chart Data
* **URL:** `/api/analytics/charts`
* **Method:** `GET`
* **Auth Required:** Yes
* **Success Response (200 OK):** Historical chart data formatted for graphs (such as Recharts).

---

## 4. Visual Template Preview (`/preview`)

### HTML Sample Agreement Template Preview
* **URL:** `/preview/agreement-template`
* **Method:** `GET`
* **Auth Required:** No
* **Description:** Returns the raw HTML compiled with static sample data for checking layouts, styles, and format scaling.
* **Success Response (200 OK):** `text/html` response.
