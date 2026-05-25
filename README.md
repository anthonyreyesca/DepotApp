[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gnmYDwc6)
# DepotApp

A mobile application for managing a container depot. Built with React Native (Expo) and Supabase.

---

## What does the app do?

DepotApp digitalizes the full process of container management in a depot — from a truck driver arriving at the gate, to the operator placing the container in the yard, the checker inspecting it, and the admin managing all bookings and releases.

---

## Roles

The app has 4 roles. Each role has its own access and only sees what it needs.

| Role | Description |
|---|---|
| `admin` | Manages all bookings, pre-registers containers, and has full overview of the depot |
| `operator` | Processes orders from the kiosk, assigns yard positions, and releases containers |
| `checker` | Inspects containers after arrival, takes photos, and marks their condition |
| `kiosk` | Self-service screen for truck drivers — no personal account needed |

After login, the app reads the user's role from the `profiles` table and redirects to the correct screen automatically.

---

## Container Statuses

Every container in the system has a status that reflects where it is in the process.

| Status | Meaning |
|---|---|
| `EXP` | Expected — container has been pre-registered by the admin but has not arrived yet |
| `AI` | Arrived In — container has been dropped off and assigned a yard position by the operator, pending inspection |
| `AV` | Available — container has been inspected and is available for pickup |
| `DAM` | Damaged — container has been inspected and marked as damaged |
| `OUT` | Out — container has been released and left the depot |

---

## Screens

### Kiosk
- Truck drivers register themselves on arrival
- They choose between **Drop Off** (delivering a container) or **Pick Up** (collecting a container)
- For a drop off: they fill in their truck plate, transport company, driver name, and container number
- For a pick up: they fill in the same details plus a booking reference
- The app validates the container or reference against the database before submitting
- After confirmation the driver waits for the operator

### Admin — Booking In
- The admin pre-registers a container that is expected to arrive
- Fills in prefix, number, container type, and customer
- The container is saved with status `EXP`
- A container that already exists in the system cannot be registered again

### Admin — Booking Out
- The admin creates a release reference for containers that need to leave the depot
- Fills in the reference code, required condition (AV or DAM), container type, customer, and quantity allowed
- When tapping a reference, the admin sees which containers have already been released with date and container number
- When the quantity limit is reached, `active` is automatically set to `false` via a database trigger
- A reference that already exists cannot be created again

### Admin — Info Containers
- Full overview of all containers in the depot
- Shows prefix, number, type, status, customer, and yard position
- Searchable by container number

### Operator — Orders
- Shows all pending kiosk submissions
- **Drop Off flow:** operator selects the order, presses Lift Off Truck, and assigns a yard position. The container status changes from `EXP` to `AI`
- **Pick Up flow:** operator selects the order, presses View Available Stock, sees all matching containers, selects one, and confirms the release. The container status changes to `OUT` and a record is inserted in `booking_deliveries`

### Operator — Inventory
- Overview of all containers with their yard position
- The operator can update the position of a container when it is moved in the yard

### Checker — Repairs
- Shows all containers with status `AI` that need to be inspected
- The checker taps a container to open it
- A photo must be taken before the AV or DAM buttons appear
- After the photo is taken, the GPS location is automatically captured
- The checker marks the container as `AV` or `DAM`
- The photo URL, latitude, and longitude are saved to the database

---

## Database

Built on Supabase (PostgreSQL).

### Tables

#### `containers`
The main table. Every container in the depot.

| Column | Type | Description |
|---|---|---|
| `id` | bigint | Primary key |
| `prefix` | text | Container prefix (e.g. MSCU) |
| `number` | text | Container number (7 digits) |
| `type` | text | Container type (e.g. 20DV, 40HC) |
| `customer` | text | Shipping line or customer |
| `status` | text | EXP / AI / AV / DAM / OUT |
| `location` | text | Yard position (e.g. A-12) |
| `inspection_photo_url` | text | URL of the inspection photo in Storage |
| `inspection_lat` | double precision | GPS latitude of the inspection |
| `inspection_lng` | double precision | GPS longitude of the inspection |

#### `booking_releases`
Release references created by the admin.

| Column | Type | Description |
|---|---|---|
| `id` | bigint | Primary key |
| `reference` | text | Booking reference code |
| `customer` | text | Customer or shipping line |
| `type` | text | Required container type |
| `status_required` | text | Required condition (AV or DAM) |
| `amount_requested` | integer | How many containers may leave |
| `amount_delivered` | integer | How many have already left (auto-updated by trigger) |
| `active` | boolean | False when limit is reached |
| `created_at` | timestamp | Creation date |

#### `booking_deliveries`
History of all released containers.

| Column | Type | Description |
|---|---|---|
| `id` | bigint | Primary key |
| `booking_id` | bigint | FK → booking_releases |
| `container_id` | bigint | FK → containers |
| `delivered_at` | timestamp | Release date and time |

#### `kiosk_submissions`
All driver registrations from the kiosk.

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `truck_plate` | text | Truck license plate |
| `transport_company` | text | Transport company name |
| `driver_name` | text | Driver name |
| `operation_type` | text | PICKUP or DROP OFF |
| `customer_id` | text | Customer linked to the operation |
| `reference_number` | text | Booking reference (for pickups) |
| `container_prefix` | text | Container prefix (for drop offs) |
| `container_number` | text | Container number (for drop offs) |
| `status` | text | pending / in_progress / completed |
| `created_at` | timestamp | Submission date and time |

#### `profiles`
User profiles linked to Supabase Auth.

| Column | Type | Description |
|---|---|---|
| `id` | uuid | FK → auth.users |
| `role` | text | admin / operator / checker / kiosk |

---

## Database Triggers

### `tr_update_delivery_count`
Fires after every insert on `booking_deliveries`. Automatically increments `amount_delivered` in `booking_releases` and sets `active` to `false` when the limit is reached.

---

## Expo Packages Used

| Package | Used for |
|---|---|
| `expo-image-picker` | Taking inspection photos with the camera |
| `expo-location` | Capturing GPS coordinates during inspection |
| `expo-router` | Navigation between screens |
| `expo-file-system` | File handling |

---

## Storage

Supabase Storage is used to store inspection photos.

- Bucket: `inspection-photos`
- Photos are uploaded as base64 decoded to Uint8Array
- Each photo has a unique filename based on container id and timestamp
- The public URL is saved in `containers.inspection_photo_url`

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native (Expo) | Mobile app framework |
| TypeScript | Type safety |
| Supabase | Database, Authentication, Storage |
| Expo Router | File-based navigation |
