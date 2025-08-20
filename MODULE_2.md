behy awel chy 5anfeserlk 3lesh branch_ID mawjouda fil category , inventorymovement , InventoryStock



    NAME            MAJOUD/LE                  EXPLAINATION
InventoryStock	     MAWJOUD	     Stock physiquement lkolo marbout b branch
--------------------------------------------------------------------------------
InventoryMovement	 MAWJOUD	     il movement automatique tkoun wist branch specifique.
---------------------------------------------------------------------------------------
Supplier	         LE	     supplier maandoush 5atromarbout bil account lkol mch branch specifique.
---------------------------------------------------------------------------------
Unit	             LE	     Units logiquement universer donc mefemesh 3leh narbtouhom.
---------------------------------------------------------------------------------
InventoryItem	     LE         (but referenced)	il inventory ikoun golabl mais tracking specifique
---------------------------------------------------------------------------------


hhya nibdew ala barikt allah 
## Module 2 — Suppliers / Inventory Stock / Inventory Movements

This file documents the frontend API contract for three inventory-related entities: suppliers, inventory stock, and inventory movements.

Common response shapes
- Success: { data: ..., message?: string, success: true }
- Paginated: { data: [...], pagination: { current_page, per_page, total, last_page } }
- Error: { error: { message, code, details? }, success: false }
kima 5dimne 9bel nefs logic
---

## Suppliers
Entity (response)
{
  id: string,
  name: string,
  email?: string,
  phone?: string,
  address?: string,
  description?: string,
  created_at: string,
  updated_at: string,
}
Create / Update payload (li chnib3thholk)
{
  name: string,
  email?: string,
  phone?: string,
  address?: string,
  description?: string
}
Endpoints
- GET /api/suppliers — list (search/paginate)
- GET /api/suppliers/{id} — get
- POST /api/suppliers — create
- PUT /api/suppliers/{id} — update
- DELETE /api/suppliers/{id} — delete
Notes / validations
- name: required,
- email: optional, lezim ikoun s7i7 wle blesh asl 
- phone/address/description: optional
- Deleting: rodbelk t5ali il user ifasa5o wa9tili yibde aando des constrain , mithel marbout f reference maaa inventory stock

Example JSON responses:

List (GET /api/suppliers):
```json
{
  "data": [
    {
      "id": "1",
      "name": "Coffee Beans Co.",
      "email": "orders@coffeebeans.com",
      "phone": "+1-555-0101",
      "address": "123 Coffee Street, Bean City, BC 12345",
      "description": "Premium coffee beans from sustainable farms worldwide",
      "created_at": "2024-01-10T08:00:00Z",
      "updated_at": "2024-01-10T08:00:00Z"
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

Single (GET /api/suppliers/{id}):
```json
{
  "data": {
    "id": "1",
    "name": "Coffee Beans Co.",
    "email": "orders@coffeebeans.com",
    "phone": "+1-555-0101",
    "address": "123 Coffee Street, Bean City, BC 12345",
    "description": "Premium coffee beans from sustainable farms worldwide",
    "created_at": "2024-01-10T08:00:00Z",
    "updated_at": "2024-01-10T08:00:00Z"
  },
  "success": true
}
```

Create success (POST /api/suppliers):
```json
{
  "data": {
    "id": "generated-uuid",
    "name": "Coffee Beans Co.",
    "email": "orders@coffeebeans.com",
    "phone": "+1-555-0101",
    "address": "123 Coffee Street, Bean City, BC 12345",
    "description": "Premium coffee beans from sustainable farms worldwide",
    "created_at": "2024-01-10T08:00:00Z",
    "updated_at": "2024-01-10T08:00:00Z"
  },
  "message": "Supplier created successfully",
  "success": true
}
```

Validation error (POST /api/suppliers):
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "name": ["Supplier name is required"],
      "email": ["Please enter a valid email address"]
    }
  },
  "success": false
}
```

---

## InventoryStock
Entity (response)
{
  id: string,
  inventory_item_id: string,
  branch_id: string, 
  quantity: number,
  unit_purchase_price: number,
  expiration_date?: string,
  created_at: string,
  updated_at: string,
  inventory_item?: { id, name, threshold_quantity, ... } object kaml hedha
}
Create / Update actions (requests)
- GET /api/inventory-stock — list (filters)
- POST /api/inventory-stock/entries — add stock entry (creates movement + updates stock)
  payload:
  {
    inventory_item_id: string,
    transaction_type: 'IN'|'OUT'|'WASTE'|'TRANSFER',
    quantity: number (>0),
    unit_purchase_price?: number,
    supplier_id?: string,
    destination_branch_id?: string,
    waste_reason?: string,
    notes?: string,
    expiration_date?: string
  }
- DELETE /api/inventory-stock/{id} — delete ( RODBELK MIL CONTRAINS)
Behavior expected (frontend)
- Stock rows are branch-scoped.
- IN: create or increase stock row.
- OUT/WASTE: decrease stock; never negative on frontend (backend should reject or clamp).
- For IN the unit_purchase_price is expected and used for total value.
Backend guidance
- inventory_item_id must exist
- Quantity > 0
- unit_purchase_price required for IN
- expiration_date must be valid date if provided
- Deleting stock with movement history should be blocked (400) nefs li7keya maa supplier

Example JSON responses:

List (GET /api/inventory-stock):
```json
{
  "data": [
    {
      "id": "1",
      "inventory_item_id": "1",
      "branch_id": "branch-1",
      "quantity": 15.5,
      "unit_purchase_price": 12.5,
      "expiration_date": "2024-12-31",
      "created_at": "2024-01-20T10:00:00Z",
      "updated_at": "2024-02-15T14:30:00Z",
      "inventory_item": {
        "id": "1",
        "name": "Arabica Coffee Beans",
        "threshold_quantity": 5
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

Single (GET /api/inventory-stock/{id}):
```json
{
  "data": {
    "id": "1",
    "inventory_item_id": "1",
    "branch_id": "branch-1",
    "quantity": 15.5,
    "unit_purchase_price": 12.5,
    "expiration_date": "2024-12-31",
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-02-15T14:30:00Z",
    "inventory_item": {
      "id": "1",
      "name": "Arabica Coffee Beans",
      "threshold_quantity": 5
    }
  },
  "success": true
}
```

Create success (POST /api/inventory-stock/entries):
```json
{
  "data": {
    "id": "generated-uuid",
    "inventory_item_id": "1",
    "branch_id": "branch-1",
    "quantity": 35.5,
    "unit_purchase_price": 12.5,
    "expiration_date": "2024-12-31",
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-02-15T14:30:00Z",
    "inventory_item": {
      "id": "1",
      "name": "Arabica Coffee Beans",
      "threshold_quantity": 5
    }
  },
  "message": "Stock entry added successfully",
  "success": true
}
```

Validation error (POST /api/inventory-stock/entries):
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "inventory_item_id": ["Inventory item is required"],
      "quantity": ["Quantity must be greater than 0"]
    }
  },
  "success": false
}
```

---
hya chid ja3bk mli7 hedhi fiha barcha 3fatt 
## InventoryMovements (transactions)
Entity (response)
{
  id: string,
  inventory_item_id: string,
  branch_id: string,
  transaction_type: 'IN'|'OUT'|'WASTE'|'TRANSFER',
  quantity: number,
  unit_purchase_price?: number,
  supplier_id?: string,
  destination_branch_id?: string,
  waste_reason?: string,
  notes?: string,
  expiration_date?: string,
  created_at: string,
  updated_at: string,
  inventory_item?: {...}, object hedha
  supplier?: { id, name } object hedha zeda
}
Create payload
kima stock entry . Frontend expects backend to create a movement record and return it (201) and reflect updated stock.
Endpoints
- GET /api/inventory-movements — list (filters: transaction_type, category, date_range(all time - today - this month - this week ), search, paginate)
- GET /api/inventory-movements/{id} — get
- POST /api/inventory-movements — create (alias for stock entry)
- DELETE /api/inventory-movements/{id} — delete (prefer blocked; require adjustment entry)
Conditional validations (hw li chikarzik tarf )
- transaction_type === 'IN' => quanitie, supplier_id required, unit_purchase_price required
- transaction_type === 'WASTE' => quantie , waste_reason required
- transaction_type === 'TRANSFER' => quantitie , destination_branch_id required
- quantity must be > 0 , isma3ni il quantity rahi global fil all type of transactions
Edge cases & recommendations
- Prevent negative stock: reject OUT/WASTE that would go below 0 (422) or return a specific code.
- Deleting movements should be disallowed or require explicit reconciliation.
- Supplier is global (not branch-scoped).
- Use UUIDs for IDs and ISO8601 timestamps. rani na7kilk ala hedhi --> 2024-01-15T10:30:00Z
- Index searchable fields: inventory_item_id, branch_id, transaction_type, created_at.
Examples
- Stock entry (IN):
  {
    "inventory_item_id": "1",
    "transaction_type": "IN",
    "quantity": 20,
    "unit_purchase_price": 12.5,
    "supplier_id": "1",
    "expiration_date": "2024-12-31"
  }

Example JSON responses:

List (GET /api/inventory-movements):
```json
{
  "data": [
    {
      "id": "1",
      "inventory_item_id": "1",
      "branch_id": "branch-1",
      "transaction_type": "IN",
      "quantity": 20,
      "unit_purchase_price": 12.5,
      "supplier_id": "1",
      "notes": "Initial stock purchase",
      "expiration_date": "2024-12-31",
      "created_at": "2024-01-20T10:00:00Z",
      "updated_at": "2024-01-20T10:00:00Z",
      "inventory_item": {
        "id": "1",
        "name": "Arabica Coffee Beans"
      },
      "supplier": {
        "id": "1",
        "name": "Coffee Beans Co."
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

Single (GET /api/inventory-movements/{id}):
```json
{
  "data": {
    "id": "1",
    "inventory_item_id": "1",
    "branch_id": "branch-1",
    "transaction_type": "IN",
    "quantity": 20,
    "unit_purchase_price": 12.5,
    "supplier_id": "1",
    "notes": "Initial stock purchase",
    "expiration_date": "2024-12-31",
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z",
    "inventory_item": {
      "id": "1",
      "name": "Arabica Coffee Beans"
    },
    "supplier": {
      "id": "1",
      "name": "Coffee Beans Co."
    }
  },
  "success": true
}
```

Create success (POST /api/inventory-movements):
```json
{
  "data": {
    "id": "generated-uuid",
    "inventory_item_id": "1",
    "branch_id": "branch-1",
    "transaction_type": "IN",
    "quantity": 20,
    "unit_purchase_price": 12.5,
    "supplier_id": "1",
    "notes": "Initial stock purchase",
    "expiration_date": "2024-12-31",
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z",
    "inventory_item": {
      "id": "1",
      "name": "Arabica Coffee Beans"
    },
    "supplier": {
      "id": "1",
      "name": "Coffee Beans Co."
    }
  },
  "message": "Inventory movement created successfully",
  "success": true
}
```

Validation error (POST /api/inventory-movements):
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "transaction_type": ["Transaction type is required"],
      "quantity": ["Quantity must be greater than 0"]
    }
  },
  "success": false
}
```