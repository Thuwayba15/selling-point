# 🚀 RBAC Quick Start Guide

## What's Now Working

Your application has a **complete RBAC system** with:  
✅ Role-based permissions  
✅ Route protection for admin pages  
✅ Sidebar menu that shows/hides items based on role  
✅ useRbac hook for checking permissions in components  
✅ Type-safe role checking throughout  

---

## How to Check User Permissions (4 Ways)

### **Way 1: Can They Perform an Action? (✅ Recommended)**
```typescript
import { useRbac } from "@/hooks/useRbac";

const { can } = useRbac();

if (can("approve:proposal")) {
  return <ApproveButton />;
}
```

### **Way 2: Check a Specific Role**
```typescript
const { isAdmin, isManager } = useRbac();

if (isAdmin) return <AdminPanel />;
if (isManager) return <ManagerPanel />;
```

### **Way 3: Check All Users' Roles (Array)**
```typescript
const { roles } = useRbac();

// User might have: ["SalesManager", "Admin"] (multiple roles!)
if (roles.includes("Admin")) { /* ... */ }
```

### **Way 4: Get Primary Role (Highest Privilege)**
```typescript
const { primaryRole } = useRbac();

console.log(primaryRole); // "Admin" or "SalesManager" etc
```

---

## Complete Permission List

### **What Each Role Can Do**

**Admin** = 50+ permissions including:
- manage:users
- manage:config
- view:reports
- approve:proposal
- delete:opportunity
- ... everything

**SalesManager** = Full team management:
- create:opportunity
- approve:proposal
- assign:opportunity
- view:reports
- ... but can't delete users or access config

**BusinessDevelopmentManager** = Create own records:
- create:opportunity
- create:proposal
- create:contract
- create:pricing-request
- ... but can't approve or manage others

**SalesRep** = Manage own work:
- view:my-opportunities
- update:assigned-opportunity
- create:pricing-request
- create:activity
- ... minimal permissions

---

## Using RBAC in Your Pages

### **Step 1: Import the Hook**
```typescript
import { useRbac } from "@/hooks/useRbac";
```

### **Step 2: Get Permission Helpers**
```typescript
const { 
  can,              // can("action:resource")?
  isAdmin,          // Is user admin?
  isManager,        // Is user manager+admin?
  primaryRole,      // "Admin", "SalesManager", etc
  roles,            // ["Admin", "SalesManager"]
  user,             // Full user object
} = useRbac();
```

### **Step 3: Use in Your Component**
```typescript
return (
  <div>
    {can("create:opportunity") && (
      <button>New Opportunity</button>
    )}
    
    {isManager && (
      <section>Team Performance</section>
    )}
    
    {isAdmin && (
      <button>Delete User</button>
    )}
  </div>
);
```

---

## Complete Examples by Use Case

### **Conditional Buttons**
```typescript
{can("approve:proposal") && <ApproveButton />}
{can("delete:opportunity") && <DeleteButton />}
{can("manage:users") && <UserManagementButton />}
```

### **Conditional Sections**
```typescript
{isManager && (
  <Card title="Team Dashboard">
    <TeamMetrics />
    <TeamPerformance />
  </Card>
)}
```

### **Conditional Pages**
```typescript
// admin/page.tsx
export default withAuthGuard(AdminPage, { 
  allowedRoles: ["Admin"] 
});

// Only admins can access /admin
// Others redirected to dashboard
```

### **Conditional Data Loading**
```typescript
const opportunities = allOpportunities.filter(opp => {
  if (isAdmin) return true;  // See all
  if (isManager) return true; // See all
  return opp.assignedTo === user?.id; // See only own
});
```

---

## The Three Security Layers

### **Layer 1: API Security (Server-Side) ⚡**
```
User clicks "Approve"
  → Browser sends API request
    → Server checks user's role
      → Has permission? Returns data
      → No permission? Returns 403 Forbidden
```
**✓ Always enforced** (even if UI is hacked)

### **Layer 2: Route Protection (Frontend) 🛑**
```
User visits /admin
  → withAuthGuard checks: Is user admin?
    → Yes? Shows page
    → No? Redirects to dashboard
```
**✓ Prevents unauthorized navigation**

### **Layer 3: UI Hiding (Frontend) 👁️**
```
Component checks: can("approve:proposal")?
  → Yes? Shows button
  → No? Hides button
```
**✓ Improves UX** (users don't see buttons they can't use)

---

## Testing Your RBAC

### **1. Test with Admin User**
```bash
npm run dev
# Login with role = ["Admin"]
✓ See Admin menu
✓ Can access /admin
✓ All buttons show
```

### **2. Test with Manager**
```bash
# Login with role = ["SalesManager"]
✓ See Reports menu
✗ Don't see Admin menu
✗ Redirected from /admin
```

### **3. Test with Rep**
```bash
# Login with role = ["SalesRep"]
✗ Don't see Reports menu
✗ Don't see Admin menu
✗ Redirected from /admin
```

---

## Key Points to Remember

1. **Roles is an ARRAY** - Users can have multiple roles
   ```typescript
   user.roles = ["Admin", "SalesManager"]  // ✓ Correct
   user.role = "Admin"                     // ✗ Wrong (doesn't exist)
   ```

2. **Always use `.includes()` or helper functions**
   ```typescript
   user.roles.includes("Admin")  // ✓
   can("approve:proposal")       // ✓ (even better)
   user.roles === "admin"        // ✗ Wrong
   ```

3. **API is the source of truth**  
   The API enforces permissions. UI checks are just for UX.

4. **Check permissions, not roles (usually)**
   ```typescript
   if (can("approve:proposal")) { }  // ✓ Better
   if (roles.includes("SalesManager")) { }  // ✓ Also fine
   ```

5. **Never trust the client**  
   Frontend checks are for UX. Backend MUST validate.

---

## All Available Permissions by Category

### **User Management**
- manage:users
- manage:config

### **Opportunities**
- create:opportunity
- update:opportunity
- delete:opportunity
- assign:opportunity
- view:all-opportunities

### **Proposals**
- create:proposal
- update:proposal
- delete:proposal
- approve:proposal
- reject:proposal

### **Pricing Requests**
- create:pricing-request
- update:pricing-request
- assign:pricing-request
- view:all-pricing-requests

### **Contracts**
- create:contract
- update:contract
- delete:contract
- activate:contract

### **Activities & Notes**
- create:activity
- update:activity
- delete:activity
- create:note
- update:note
- delete:note

### **Documents & Reports**
- delete:document
- view:reports

See `src/utils/rbac.ts` for the complete list!

---

## File Reference

| File | Purpose |
|------|---------|
| `src/utils/rbac.ts` | Permission system + helpers |
| `src/hooks/useRbac.ts` | Hook for components |
| `src/hoc/withAuthGuard.tsx` | Route protection |
| `src/components/layout/SideNav.tsx` | Sidebar with role check |
| `src/app/(protected)/admin/*` | Admin pages |
| `RBAC_GUIDE.md` | Detailed documentation |
| `RBAC_BEFORE_AFTER.md` | What changed |
| `RBAC_IMPLEMENTATION.md` | Full technical details |

---

## Need More Help?

### **See Working Examples**
```
src/components/examples/RbacExamples.tsx
```
Copy patterns from there!

### **Deep Dive**
Read `RBAC_GUIDE.md` for detailed docs

### **Understand Changes**
Read `RBAC_BEFORE_AFTER.md` for what was fixed

### **Technical Reference**
Read `RBAC_IMPLEMENTATION.md` for architecture

---

## Summary: Your RBAC is Ready! 🎉

```typescript
// Import the hook
import { useRbac } from "@/hooks/useRbac";

// Use in any component
const { can, isAdmin, isManager } = useRbac();

// Check permissions
if (can("approve:proposal")) show ApproveButton()
if (can("create:opportunity")) show NewButton()
if (isAdmin) show AdminPanel()

// Done! 🚀
```

**What you have:**
- ✅ Complete permission system
- ✅ Type-safe role checking
- ✅ Working admin pages
- ✅ Menu items that show/hide by role
- ✅ useRbac hook for components
- ✅ Route protection with withAuthGuard
- ✅ Three security layers

**Start building role-based features!**
