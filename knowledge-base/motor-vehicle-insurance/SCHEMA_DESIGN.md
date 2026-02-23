# Motor Vehicle Insurance - Modular Schema Overview

## 🚗 Vehicle Type Structure

### Shared Infrastructure
All vehicle types share:
- Mistral OCR extraction (Stage 1)
- Mistral Large analysis (Stage 2)  
- Coverage reconciliation (Layer 4)
- Risk flag system
- Database storage pattern

### Vehicle-Specific Schemas

---

## 🏍️ Two-Wheeler Insurance (MVP - Week 1-3)

**Vehicles**: Bikes, scooters, electric two-wheelers

**Core Fields** (15-20):
```typescript
{
  vehicle: {
    type: "motorcycle" | "scooter" | "electric",
    cc: number,              // Engine capacity
    make: string,
    model: string,
    year: number,
    registrationNumber: string,
    idv: number,
    marketValue: number
  },
  coverage: {
    ownDamage: boolean,
    thirdParty: boolean,
    ncbPercentage: number,   // 0, 20, 25, 35, 45, 50
    addOns: TwoWheelerAddOn[]
  }
}
```

**Two-Wheeler Specific Add-ons**:
- Zero Depreciation
- Engine Protection
- Roadside Assistance (24x7)
- Consumables Cover
- Return to Invoice (RTI)
- Personal Accident Cover

**Unique Rules**:
- NCB capping at 50% (two-wheeler specific)
- IDV typically 85-105% of market value
- Lower premiums (₹500-₹5000 range)

---

## 🚙 Four-Wheeler Insurance (Week 4-6)

**Vehicles**: Cars, SUVs, MUVs, hatchbacks

**Core Fields** (40-50):
```typescript
{
  vehicle: {
    type: "sedan" | "suv" | "hatchback" | "muv",
    cc: number,
    make: string,
    model: string,
    variant: string,          // NEW: Petrol/Diesel/Electric/Hybrid
    year: number,
    registrationNumber: string,
    idv: number,
    marketValue: number,
    cubicCapacity: number,    // NEW
    seatingCapacity: number,  // NEW
    fuelType: string          // NEW
  },
  coverage: {
    ownDamage: boolean,
    thirdParty: boolean,
    ncbPercentage: number,    // 0, 20, 25, 35, 45, 50
    addOns: FourWheelerAddOn[],
    accessories: Accessory[], // NEW: Stereo, CNG/LPG kit, etc.
    paCover: PACover          // NEW: Personal Accident Cover details
  }
}
```

**Four-Wheeler Specific Add-ons**:
- Zero Depreciation  
- Engine Protection
- Roadside Assistance
- Consumables Cover
- Return to Invoice (RTI)
- Key Replacement
- Loss of Personal Belongings
- Tyre Protection
- NCB Protection (NEW)
- Daily Allowance (NEW)
- Emergency Hotel/Travel (NEW)

**Unique Rules**:
- Accessories value tracked separately
- Higher IDV range (₹2L - ₹50L+)
- PA cover mandatory for owner-driver
- Depreciation % varies by part type

---

## Shared vs Unique Fields

### Shared Across All Vehicle Types
- Policy details (number, dates, insurer)
- Premium breakdown (base, add-ons, GST, total)
- NCB percentage
- Own Damage / Third Party coverage
- Common add-ons (Zero Dep, Engine Guard, Roadside)

### Two-Wheeler Unique
- Lower premium range
- Simpler accessory tracking
- Fixed depreciation schedules

### Four-Wheeler Unique
- Accessories tracking (stereo, CNG kit)
- PA cover details
- Variant/fuel type
- More complex depreciation
- Additional specialized add-ons

---

## Implementation Strategy

### Phase 1: Two-Wheeler (Weeks 1-3)
```
src/lib/insurance/
├── shared/
│   ├── base-schema.ts       # Common fields
│   ├── mistral-analyzer.ts  # OCR + extraction
│   └── rules-engine.ts      # Shared validation
└── two-wheeler/
    ├── schema.ts            # Two-wheeler specific
    ├── rules.ts             # NCB, IDV rules
    └── calculator.ts        # Premium calculations
```

### Phase 2: Four-Wheeler (Weeks 4-6)  
```
src/lib/insurance/
├── shared/                  # Reuse from Phase 1
└── four-wheeler/
    ├── schema.ts            # Extends base-schema
    ├── rules.ts             # Car-specific rules
    ├── calculator.ts        # Accessories, depreciation
    └── add-ons.ts           # Extended add-on catalog
```

### Code Reuse Example
```typescript
// shared/base-schema.ts
export interface BaseVehicleInsurance {
  insurerName: string;
  policyNumber: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    idv: number;
  };
  premium: PremiumBreakdown; // Shared
}

// two-wheeler/schema.ts
export interface TwoWheelerInsurance extends BaseVehicleInsurance {
  vehicle: BaseVehicleInsurance['vehicle'] & {
    type: "motorcycle" | "scooter";
    cc: number;
  };
  coverage: TwoWheelerCoverage;
}

// four-wheeler/schema.ts
export interface FourWheelerInsurance extends BaseVehicleInsurance {
  vehicle: BaseVehicleInsurance['vehicle'] & {
    type: "sedan" | "suv" | "hatchback";
    variant: string;
    fuelType: string;
  };
  coverage: FourWheelerCoverage;
  accessories: Accessory[];
}
```

---

## Database Design

### Shared Table
```sql
CREATE TABLE motor_vehicle_analyses (
  id UUID PRIMARY KEY,
  vehicle_type TEXT, -- 'two-wheeler' | 'four-wheeler'
  
  -- Shared fields
  insurer_name TEXT,
  policy_number TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_idv DECIMAL(10,2),
  
  -- Type-specific data stored as JSONB
  type_specific_data JSONB,
  
  -- Shared analysis
  overall_score INTEGER,
  risk_flags JSONB,
  mistral_raw_response JSONB
);
```

This modular design allows **70% code reuse** when extending from two-wheeler to four-wheeler!
