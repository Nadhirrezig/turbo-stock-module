# Inventory Management API Documentation
rayen matloumnich blh ken fema 7aja heka wle hka wlh 5ouk mbayel monek ken fema 7aja ghalta 9oli 3liha 
hedhi ta7ki aal les contract li 3malthom maa l backend 
questions you will find anwsers about ya rayen :
what am i expecting from you 
what are you expecting from me 
mili5R chnuwa chnib3thlk ou chnuwa lezmo ijini 
## Overview

This document details the HTTP endpoints and data contracts for the core inventory management entities. The API follows RESTful conventions and is designed for Spring Boot backend integration.

**Base URL:** `http://localhost:8080/api`

**Authentication:** Bearer token (implementation pending)

**Content-Type:** `application/json`

## Common Response Formats

### Success Response Structure
```json
{
  "data": {}, // Entity data or array of entities
  "message": "Operation successful",
  "success": true
}
```

### Paginated Response Structure
```json
{
  "data": [], // Array of entities
  "pagination": {
    "current_page": 1,
    "per_page": 5,
    "total": 50,
    "last_page": 5
  }
}
```

### Error Response Structure
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  },
  "success": false
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | OK - Request successful |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid request data |
| 404  | Not Found - Resource not found |
| 422  | Unprocessable Entity - Validation errors |
| 500  | Internal Server Error - Server error |

---

## Units API

Units represent measurement units for inventory items (kg, pieces, liters, etc.).

### Data Structure

**Unit Entity:**
```json
{
  "id": "string",
  "name": "string",
  "symbol": "string", 
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Create/Update Data:**
```json
{
  "name": "string",    // Required, max 255 chars
  "symbol": "string"   // Required, max 10 chars
}
```

### Endpoints

#### GET /api/units
Get all units with filtering and pagination.

**Query Parameters:**
- `search` (string, optional) - Search in name and symbol fields
- `page` (integer, optional, default: 1) - Page number
- `per_page` (integer, optional, default: 5) - Items per page
- `sort_field` (string, optional, default: "created_at") - Field to sort by
- `sort_direction` (string, optional, default: "desc") - Sort direction (asc/desc)

**Example Request:**
```
GET /api/units?search=kg&page=1&per_page=10&sort_field=name&sort_direction=asc
```

**Example Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Kilogram",
      "symbol": "kg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 5,
    "total": 1,
    "last_page": 1
  }
}
```

#### GET /api/units/{id}
Get a specific unit by ID.

**Path Parameters:**
- `id` (string, required) - Unit ID

**Example Response (200):**
```json
{
  "data": {
    "id": "1",
    "name": "Kilogram",
    "symbol": "kg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "success": true
}
```

**Error Response (404):**
```json
{
  "error": {
    "message": "Unit not found",
    "code": "UNIT_NOT_FOUND"
  },
  "success": false
}
```

#### POST /api/units
Create a new unit.

**Request Body:**
```json
{
  "name": "Kilogram",
  "symbol": "kg"
}
```

**Validation Rules:**
- `name`: Required, string, max 255 characters
- `symbol`: Required, string, max 10 characters

**Example Response (201):**
```json
{
  "data": {
    "id": "generated-uuid",
    "name": "Kilogram",
    "symbol": "kg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "Unit created successfully",
  "success": true
}
```

**Validation Error Response (422):**
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "name": ["Unit name is required"],
      "symbol": ["Unit symbol must not exceed 10 characters"]
    }
  },
  "success": false
}
```

#### PUT /api/units/{id}
Update an existing unit.

**Path Parameters:**
- `id` (string, required) - Unit ID

**Request Body:**
```json
{
  "name": "Updated Kilogram",
  "symbol": "kg"
}
```

**Example Response (200):**
```json
{
  "data": {
    "id": "1",
    "name": "Updated Kilogram", 
    "symbol": "kg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:30:00Z"
  },
  "message": "Unit updated successfully",
  "success": true
}
```

#### DELETE /api/units/{id}
Delete a unit.

**Path Parameters:**
- `id` (string, required) - Unit ID

**Example Response (200):**
```json
{
  "message": "Unit deleted successfully",
  "success": true
}
```

**Cascade Rules:**
- Cannot delete units that are referenced by inventory items
- Returns 400 error if unit is in use

---

## Categories API

Categories represent inventory item categories (Meat & Poultry, Dairy, etc.).

### Data Structure

**Category Entity:**
```json
{
  "id": "string",
  "name": "string",
  "branch_id": "string",
  "created_at": "2024-01-15T10:30:00Z", 
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Create/Update Data:**
```json
{
  "name": "string"    // Required, max 255 chars
}
```

### Endpoints

#### GET /api/categories
Get all categories with filtering and pagination.

**Query Parameters:** Same as Units API

**Example Request:**
```
GET /api/categories?search=meat&page=1&per_page=5
```

**Example Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Meat & Poultry",
      "branch_id": "branch-1",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 5,
    "total": 1,
    "last_page": 1
  }
}
```

#### GET /api/categories/{id}
Get a specific category by ID.

**Example Response (200):**
```json
{
  "data": {
    "id": "1",
    "name": "Meat & Poultry",
    "branch_id": "branch-1", 
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "success": true
}
```

#### POST /api/categories
Create a new category.

**Request Body:**
```json
{
  "name": "Meat & Poultry"
}
```

**Validation Rules:**
- `name`: Required, string, max 255 characters

#### PUT /api/categories/{id}
Update an existing category.

#### DELETE /api/categories/{id}
Delete a category.

**Cascade Rules:**
- Cannot delete categories that are referenced by inventory items
- Returns 400 error if category is in use

---

## Inventory Items API

Inventory items represent products/items in the inventory system.

### Data Structure

**Inventory Item Entity:**
```json
{
  "id": "string",
  "name": "string",
  "inventory_item_category_id": "string",
  "unit_id": "string",
  "threshold_quantity": 10,
  "reorder_quantity": 50,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "category": {
    "id": "string",
    "name": "string",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "unit": {
    "id": "string",
    "name": "string",
    "symbol": "string",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Create/Update Data:**
```json
{
  "name": "string",                        // Required, max 255 chars
  "inventory_item_category_id": "string",  // Required, valid category ID
  "unit_id": "string",                     // Required, valid unit ID
  "threshold_quantity": 10,                // Required, positive number
  "reorder_quantity": 50                   // Required, positive number
}
```

### Endpoints

#### GET /api/inventory-items
Get all inventory items with filtering and pagination.

**Query Parameters:** Same as Units API

**Example Request:**
```
GET /api/inventory-items?search=chicken&page=1&per_page=5&sort_field=name&sort_direction=asc
```

**Example Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Chicken Breast",
      "inventory_item_category_id": "1",
      "unit_id": "1",
      "threshold_quantity": 5,
      "reorder_quantity": 20,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "category": {
        "id": "1",
        "name": "Meat & Poultry",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      },
      "unit": {
        "id": "1",
        "name": "Kilogram",
        "symbol": "kg",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 5,
    "total": 1,
    "last_page": 1
  }
}
```

#### GET /api/inventory-items/{id}
Get a specific inventory item by ID.

**Example Response (200):**
```json
{
  "data": {
    "id": "1",
    "name": "Chicken Breast",
    "inventory_item_category_id": "1",
    "unit_id": "1",
    "threshold_quantity": 5,
    "reorder_quantity": 20,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "category": {
      "id": "1",
      "name": "Meat & Poultry",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "unit": {
      "id": "1",
      "name": "Kilogram",
      "symbol": "kg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "success": true
}
```

#### POST /api/inventory-items
Create a new inventory item.

**Request Body:**
```json
{
  "name": "Chicken Breast",
  "inventory_item_category_id": "1",
  "unit_id": "1",
  "threshold_quantity": 5,
  "reorder_quantity": 20
}
```

**Validation Rules:**
- `name`: Required, string, max 255 characters
- `inventory_item_category_id`: Required, must exist in categories table
- `unit_id`: Required, must exist in units table
- `threshold_quantity`: Required, positive number
- `reorder_quantity`: Required, positive number

**Example Response (201):**
```json
{
  "data": {
    "id": "generated-uuid",
    "name": "Chicken Breast",
    "inventory_item_category_id": "1",
    "unit_id": "1",
    "threshold_quantity": 5,
    "reorder_quantity": 20,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "category": {
      "id": "1",
      "name": "Meat & Poultry",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "unit": {
      "id": "1",
      "name": "Kilogram",
      "symbol": "kg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Inventory item created successfully",
  "success": true
}
```

**Foreign Key Validation Error (422):**
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "inventory_item_category_id": ["Selected category does not exist"],
      "unit_id": ["Selected unit does not exist"]
    }
  },
  "success": false
}
```

#### PUT /api/inventory-items/{id}
Update an existing inventory item.

**Request Body:** Same as POST

**Example Response (200):**
```json
{
  "data": {
    "id": "1",
    "name": "Updated Chicken Breast",
    "inventory_item_category_id": "1",
    "unit_id": "1",
    "threshold_quantity": 10,
    "reorder_quantity": 30,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:30:00Z",
    "category": {
      "id": "1",
      "name": "Meat & Poultry",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "unit": {
      "id": "1",
      "name": "Kilogram",
      "symbol": "kg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Inventory item updated successfully",
  "success": true
}
```

#### DELETE /api/inventory-items/{id}
Delete an inventory item.

**Example Response (200):**
```json
{
  "message": "Inventory item deleted successfully",
  "success": true
}
```

**Cascade Rules:**
- Cannot delete inventory items that have stock records
- Cannot delete inventory items that have movement history
- Returns 400 error if item is referenced by other entities

---

## Entity Relationships

### Database Schema Overview

```
Units (1) ←→ (Many) Inventory Items
Categories (1) ←→ (Many) Inventory Items
Inventory Items (1) ←→ (Many) Inventory Stock
Inventory Items (1) ←→ (Many) Inventory Movements
```

### Relationship Details

1. **Units → Inventory Items**
   - One unit can be used by many inventory items
   - Unit deletion blocked if referenced by inventory items

2. **Categories → Inventory Items**
   - One category can contain many inventory items
   - Category deletion blocked if referenced by inventory items

3. **Inventory Items → Stock/Movements**
   - One inventory item can have multiple stock records
   - One inventory item can have multiple movement records
   - Inventory item deletion blocked if has stock or movements

---

## Search and Filtering

### Search Behavior

**Units:**
- Searches in: `name`, `symbol`
- Case-insensitive partial matching

**Categories:**
- Searches in: `name`
- Case-insensitive partial matching

**Inventory Items:**
- Searches in: `name`
- Case-insensitive partial matching
- Future: May include category and unit names

### Sorting Options

**Available Sort Fields:**
- `id` - Entity ID
- `name` - Entity name
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Sort Directions:**
- `asc` - Ascending order
- `desc` - Descending order (default)

### Pagination

**Default Values:**
- `page`: 1
- `per_page`: 5

**Limits:**
- Maximum `per_page`: 100
- Minimum `per_page`: 1

---

## Error Handling

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNIT_NOT_FOUND` | Unit with specified ID not found |
| `CATEGORY_NOT_FOUND` | Category with specified ID not found |
| `INVENTORY_ITEM_NOT_FOUND` | Inventory item with specified ID not found |
| `FOREIGN_KEY_CONSTRAINT` | Referenced entity does not exist |
| `DELETE_CONSTRAINT` | Cannot delete entity due to references |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

### Validation Error Format

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field_name": [
        "First validation error message",
        "Second validation error message"
      ],
      "another_field": [
        "Error message for another field"
      ]
    }
  },
  "success": false
}
```

---

## Spring Boot Implementation Notes

### Controller Structure
```java
@RestController
@RequestMapping("/api/units")
public class UnitsController {

    @GetMapping
    public ResponseEntity<PaginatedResponse<Unit>> getAllUnits(
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "5") int per_page,
        @RequestParam(defaultValue = "created_at") String sort_field,
        @RequestParam(defaultValue = "desc") String sort_direction
    ) {
        // Implementation
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Unit>> getUnit(@PathVariable String id) {
        // Implementation
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Unit>> createUnit(@Valid @RequestBody CreateUnitRequest request) {
        // Implementation
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Unit>> updateUnit(
        @PathVariable String id,
        @Valid @RequestBody CreateUnitRequest request
    ) {
        // Implementation
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUnit(@PathVariable String id) {
        // Implementation
    }
}
```

### Request/Response DTOs
```java
// Request DTOs
public class CreateUnitRequest {
    @NotBlank(message = "Unit name is required")
    @Size(max = 255, message = "Unit name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Unit symbol is required")
    @Size(max = 10, message = "Unit symbol must not exceed 10 characters")
    private String symbol;
}

// Response DTOs
public class ApiResponse<T> {
    private T data;
    private String message;
    private boolean success;
}

public class PaginatedResponse<T> {
    private List<T> data;
    private PaginationInfo pagination;
}
```

### Database Considerations
- Use UUID for entity IDs
- Add proper indexes on searchable fields
- Implement soft deletes for audit trail
- Add foreign key constraints with appropriate cascade rules
- Consider adding `branch_id` to all entities for multi-tenancy

---

## Frontend Integration

The frontend services are already implemented and ready for backend integration:

- `unitsService` - `/src/lib/api/units-service.ts`
- `categoriesService` - `/src/lib/api/categories-service.ts`
- `inventoryItemsService` - `/src/lib/api/inventory-items-service.ts`

**Environment Configuration:**
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

The services automatically switch between mock data and real API calls based on the `NEXT_PUBLIC_USE_MOCK_DATA` environment variable.
