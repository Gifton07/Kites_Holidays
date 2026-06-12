# Database Schema Documentation

This document describes the Mongoose (MongoDB) database collections and schemas used in the **Tour Agreement App**.

---

## 1. Admin Collection (`admins`)
Stores administrator accounts that can log in, review, approve, and track tour agreements.

| Field | Type | Required | Unique | Select | Description |
|---|---|---|---|---|---|
| `name` | `String` | Yes | No | Yes | The admin's full display name. |
| `email` | `String` | Yes | Yes | Yes | Log in email address (stored lowercase). |
| `password` | `String` | Yes | No | No (hidden by default) | Bcrypt hashed password. |
| `createdAt` | `Date` | Auto | No | Yes | Timestamp when the admin account was created. |
| `updatedAt` | `Date` | Auto | No | Yes | Timestamp when the admin account was last updated. |

---

## 2. Agreement Collection (`agreements`)
Stores booking agreements, client details, transaction status, financial records, and PDF file references.

### Client Booking Fields (Submitted by User)
These fields are filled out by the client during the initial tour booking.

* **`name`** (`String`, Required): Client's name.
* **`phone`** (`String`, Required): Contact telephone number.
* **`email`** (`String`): Email address of the client (optional).
* **`address`** (`String`, Required): Physical/postal address.
* **`destination`** (`String`, Required): Destination name or package package details.
* **`startDate`** (`Date`, Required): Departure date.
* **`startTime`** (`String`): Departure time (e.g. `"08:00 AM"`).
* **`endDate`** (`Date`, Required): Return/arrival date.
* **`arrivalTime`** (`String`): Return/arrival time (e.g. `"06:00 PM"`).
* **`passengers`** (`Number`, Required): Number of passengers.
* **`pickupLocation`** (`String`, Required): Departure/pickup point.
* **`signatureDataUrl`** (`String`): Base64 PNG signature string of the client.

### System Fields (Auto-Generated)
* **`orderNumber`** (`Number`): Sequential order number used in PDFs (starts at 500).
* **`trackingId`** (`String`, Unique): Unique alphanumeric code for public tracking.
* **`status`** (`String`, default: `"pending"`): Current state of the agreement. Must be one of:
  - `"pending"` - Awaiting admin review and approval.
  - `"approved"` - Signed by admin, PDF compiled, uploaded to MEGA.
  - `"rejected"` - Declined by administrator.
* **`pdfUrl`** (`String`): Public download URL of the generated PDF document stored on MEGA.

### Admin Approval Fields (Submitted on Approval)
* **`advancePayment`** (`Number`): Advance booking fee paid by the client.
* **`packageRate`** (`Number`): Total agreed contract rate (Rs).
* **`vehicleName`** (`String`): Vehicle name / fleet model details.
* **`vehicleNo`** (`String`): Vehicle registration license plate number.
* **`adminSignatureDataUrl`** (`String`): Base64 PNG signature of the approving admin.
* **`signDate`** (`Date`): Timestamp when the agreement was approved.
* **`notes`** (`String`): Custom inner-office remarks or notes.

### Cash Tracking & Ledger Fields (Admin Only)
* **`cashIn`** (`Number`): Additional cash received from the client (excludes booking advance).
* **`cashOut`** (`Number`): Outbound expenses incurred (driver pay, fuel, permits, etc.).
* **`pendingCash`** (`Number`): Remaining balance due from the client (`packageRate - advancePayment - cashIn`).

### Timestamps
* **`createdAt`** (`Date`): Timestamp when the booking request was submitted.
* **`updatedAt`** (`Date`): Timestamp when any field was last modified.
