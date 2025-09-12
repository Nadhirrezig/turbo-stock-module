# Frontend API Endpoints Documentation

This document lists all API endpoints that the frontend sends to the backend, with simple explanations and data structures.

## Base URL
All endpoints are prefixed with the base API URL (e.g., `/api`)

---

//////////////////////////////////////////////// 1. BRANCHES ///////////////////////////////////////////////

### GET `/api/branches`
**Sending:**
```json
{
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "name",
  "sort_direction": "asc"
}
```
- **Returns:** List of all branches with pagination
- **Used for:** Loading branch dropdowns, branch management

### GET `/api/branches/{id}`
**Sending:**
```json
{
  "id": "branch-uuid"
}
```
- **Returns:** Single branch details
- **Used for:** Getting specific branch info

### POST `/api/branches`
**Sending:**
```json
{
  "name": "Main Branch",
  "description": "Primary location"
}
```
- **Returns:** Created branch
- **Used for:** Creating new branches

### PUT `/api/branches/{id}`
**Sending:**
```json
{
  "name": "Updated Branch",
  "description": "Updated description"
}
```
- **Returns:** Updated branch
- **Used for:** Editing branch details

### DELETE `/api/branches/{id}`
**Sending:**
```json
{
  "id": "branch-uuid"
}
```
- **Returns:** Success confirmation
- **Used for:** Removing branches

---

//////////////////////////////////////////////// 2. departments ///////////////////////////////////////////////

### GET `/api/departments`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "name",
  "sort_direction": "asc"
}
```
- **Returns:** List of departments filtered by branch
- **Used for:** Loading department dropdowns, department management

### GET `/api/departments/{id}`
**Sending:**
```json
{
  "id": "department-uuid"
}
```
- **Returns:** Single department details
- **Used for:** Getting specific department info

### POST `/api/departments`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Kitchen",
  "description": "Food preparation area"
}
```
- **Returns:** Created department
- **Used for:** Creating new departments

### PUT `/api/departments/{id}`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Updated Kitchen",
  "description": "Updated description"
}
```
- **Returns:** Updated department
- **Used for:** Editing department details

### DELETE `/api/departments/{id}`
**Sending:**
```json
{
  "id": "department-uuid"
}
```
- **Returns:** Success confirmation
- **Used for:** Removing departments

---

//////////////////////////////////////////////// 3. Units ///////////////////////////////////////////////


### GET `/api/units`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "department_id": "department-uuid",
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "name",
  "sort_direction": "asc"
}
```
- **Returns:** List of units filtered by department
- **Used for:** Loading unit dropdowns in forms

### GET `/api/units/{id}`
**Sending:**
```json
{
  "id": "unit-uuid"
}
```
- **Returns:** Single unit details
- **Used for:** Getting specific unit info

### POST `/api/units`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Kilogram",
  "symbol": "kg",
  "department_id": "department-uuid"
}
```
- **Returns:** Created unit
- **Used for:** Creating new measurement units

### PUT `/api/units/{id}`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Updated Kilogram",
  "symbol": "kg",
  "department_id": "department-uuid"
}
```
- **Returns:** Updated unit
- **Used for:** Editing unit details

### DELETE `/api/units/{id}`
**Sending:**
```json
{
  "id": "unit-uuid"
}
```
- **Returns:** Success confirmation
- **Used for:** Removing units

---

//////////////////////////////////////////////// 4. CATEGORIES ///////////////////////////////////////////////

### GET `/api/categories`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "department_id": "department-uuid",
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "name",
  "sort_direction": "asc"
}
```
- **Returns:** List of categories filtered by department
- **Used for:** Loading category dropdowns in forms

### GET `/api/categories/{id}`
**Sending:**
```json
{
  "id": "category-uuid"
}
```
- **Returns:** Single category details
- **Used for:** Getting specific category info

### POST `/api/categories`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Beverages",
  "department_id": "department-uuid"
}
```
- **Returns:** Created category
- **Used for:** Creating new item categories

### PUT `/api/categories/{id}`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Updated Beverages",
  "department_id": "department-uuid"
}
```
- **Returns:** Updated category
- **Used for:** Editing category details

### DELETE `/api/categories/{id}`
**Sending:**
```json
{
  "id": "category-uuid"
}
```
- **Returns:** Success confirmation
- **Used for:** Removing categories

---

//////////////////////////////////////////////// 5. INVENTORY ITEMSS ///////////////////////////////////////////////

### GET `/api/inventory-items`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "department_id": "department-uuid",
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "name",
  "sort_direction": "asc"
}
```
- **Returns:** List of inventory items filtered by department
- **Used for:** Loading item dropdowns in stock forms

### GET `/api/inventory-items/{id}`
**Sending:**
```json
{
  "id": "item-uuid"
}
```
- **Returns:** Single inventory item details
- **Used for:** Getting specific item info

### POST `/api/inventory-items`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Coffee Beans",
  "inventory_item_category_id": "category-uuid",
  "unit_id": "unit-uuid",
  "department_id": "department-uuid",
  "threshold_quantity": 10,
  "reorder_quantity": 50
}
```
- **Returns:** Created inventory item
- **Used for:** Creating new inventory items

### PUT `/api/inventory-items/{id}`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Updated Coffee Beans",
  "inventory_item_category_id": "category-uuid",
  "unit_id": "unit-uuid",
  "department_id": "department-uuid",
  "threshold_quantity": 15,
  "reorder_quantity": 60
}
```
- **Returns:** Updated inventory item
- **Used for:** Editing item details

### DELETE `/api/inventory-items/{id}`
**Sending:**
```json
{
  "id": "item-uuid"
}
```
- **Returns:** Success confirmation
- **Used for:** Removing inventory items

---

//////////////////////////////////////////////// 6. supplielse ///////////////////////////////////////////////

### GET `/api/suppliers`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "name",
  "sort_direction": "asc"
}
```
- **Returns:** List of suppliers
- **Used for:** Loading supplier dropdowns in forms

### GET `/api/suppliers/{id}`
**Sending:**
```json
{
  "id": "supplier-uuid"
}
```
- **Returns:** Single supplier details
- **Used for:** Getting specific supplier info

### POST `/api/suppliers`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Coffee Supplier Co.",
  "email": "contact@coffeesupplier.com",
  "phone": "+1234567890",
  "address": "123 Supplier St",
  "description": "Premium coffee supplier",
  "additional_info": {
    "finance": {
      "account_number": "123456789",
      "bank_name": "Bank Name",
      "currency": "USD"
    },
    "payment": {
      "preferred_method": "Bank Transfer",
      "terms": "Net 30"
    },
    "operations": {
      "lead_time_days": 7,
      "minimum_order_quantity": 100,
      "delivery_terms": "FOB",
      "active": true
    }
  }
}
```
- **Returns:** Created supplier
- **Used for:** Creating new suppliers with full details

### PUT `/api/suppliers/{id}`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "name": "Updated Coffee Supplier Co.",
  "email": "new@coffeesupplier.com",
  "phone": "+1234567890",
  "address": "456 New St",
  "description": "Updated description"
}
```
- **Returns:** Updated supplier
- **Used for:** Editing supplier details

### DELETE `/api/suppliers/{id}`
**Sending:**
```json
{
  "id": "supplier-uuid"
}
```
- **Returns:** Success confirmation
- **Used for:** Removing suppliers

---

//////////////////////////////////////////////// 7. inventory movement ///////////////////////////////////////////////

### GET `/api/inventory-movements`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "department_id": "department-uuid",
  "transaction_type": "IN|OUT|WASTE|TRANSFER",
  "category": "category-uuid",
  "date_range": "today|week|month",
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "created_at",
  "sort_direction": "desc"
}
```
- **Returns:** List of inventory movements with filters
- **Used for:** Loading movement history, reports

### GET `/api/inventory-movements/{id}`
**Sending:**
```json
{
  "id": "movement-uuid"
}
```
- **Returns:** Single movement details
- **Used for:** Getting specific movement info

### POST `/api/inventory-movements`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "inventory_item_id": "item-uuid",
  "transaction_type": "IN",
  "quantity": 100,
  "unit_purchase_price": 15.50,
  "supplier_id": "supplier-uuid",
  "destination_branch_id": "branch-uuid",
  "destination_department_id": "department-uuid",
  "waste_reason": "Expired",
  "notes": "Fresh delivery",
  "expiration_date": "2024-12-31"
}
```
- **Returns:** Created movement
- **Used for:** Recording stock transactions (IN/OUT/WASTE/TRANSFER)

### PUT `/api/inventory-movements/{id}`
**Sending:**
```json
{
  "quantity": 120,
  "unit_purchase_price": 16.00,
  "notes": "Updated notes"
}
```
- **Returns:** Updated movement
- **Used for:** Editing movement details

---

//////////////////////////////////////////////// 8. inventory stock ///////////////////////////////////////////////


### GET `/api/inventory-stock`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "department_id": "department-uuid",
  "search": "string",
  "page": 1,
  "per_page": 10,
  "sort_field": "quantity",
  "sort_direction": "asc"
}
```
- **Returns:** List of current stock levels
- **Used for:** Loading stock dashboard, low stock alerts

### GET `/api/inventory-stock/{id}`
**Sending:**
```json
{
  "id": "stock-uuid"
}
```
- **Returns:** Single stock item details
- **Used for:** Getting specific stock info

### POST `/api/inventory-stock/entries`
**Sending:**
```json
{
  "branch_id": "branch-uuid",
  "inventory_item_id": "item-uuid",
  "transaction_type": "IN",
  "quantity": 100,
  "unit_purchase_price": 15.50,
  "supplier_id": "supplier-uuid",
  "expiration_date": "2024-12-31"
}
```
- **Returns:** Updated stock entry
- **Used for:** Adding stock entries (creates movement + updates stock)

---

## Common Response Format

All endpoints return data in this format:

```json
{
  "data": {
    // Single item or array of items
  },
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "last_page": 10
  },
  "message": "Success message",
  "success": true
}
```

## Error Response Format

```json
{
  "message": "Error description",
  "success": false,
  "error_code": "ERROR_CODE",
  "status": 400
}
```

## Authentication

All API calls require authentication headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Notes

- All IDs are UUIDs
- All timestamps are ISO 8601 format
- Pagination is 1-based (page 1, 2, 3...)
- Search is case-insensitive
- All endpoints support CORS
- Rate limiting: 100 requests per minute per user
