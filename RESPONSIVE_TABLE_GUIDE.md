# Responsive Table Component Guide

## Overview
A highly generic, super responsive table component that automatically adapts to different screen sizes. On desktop, it shows as a traditional table with horizontal scroll if needed. On mobile, it can display as cards for better readability.

## Component Location
`/frontend/src/components/ui/responsive-table.tsx`

## Features
✅ **Fully Responsive** - Works perfectly on all screen sizes
✅ **Mobile Card View** - Optional card layout for mobile devices
✅ **Generic/Reusable** - Works with any data type using TypeScript generics
✅ **Loading States** - Built-in loading and empty state handling
✅ **Column Control** - Hide specific columns on mobile
✅ **Custom Rendering** - Flexible render functions for each column
✅ **Click Handlers** - Optional row click functionality
✅ **Auto Overflow** - Handles horizontal scroll automatically

## Basic Usage

### 1. Import the Component
```typescript
import { ResponsiveTable, type Column } from '@/components/ui/responsive-table';
```

### 2. Define Your Data Type
```typescript
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}
```

### 3. Define Columns
```typescript
const columns: Column<Product>[] = [
  {
    key: 'name',
    label: 'Product Name',
    mobileLabel: 'Name', // Optional: custom label for mobile
    render: (product) => product.name,
  },
  {
    key: 'price',
    label: 'Price',
    render: (product) => `₹${product.price.toLocaleString()}`,
  },
  {
    key: 'stock',
    label: 'Stock',
    hideOnMobile: true, // Optional: hide on mobile
    render: (product) => (
      <Badge>{product.stock}</Badge>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    className: 'text-right', // Optional: custom CSS classes
    render: (product) => (
      <Button onClick={() => handleEdit(product._id)}>
        <Edit className="h-4 w-4" />
      </Button>
    ),
  },
];
```

### 4. Use the Component
```typescript
<ResponsiveTable
  data={products}
  columns={columns}
  keyExtractor={(product) => product._id}
  loading={isLoading}
  loadingMessage="Loading products..."
  emptyMessage="No products found"
  mobileCardView={true}
  onRowClick={(product) => router.push(`/products/${product._id}`)}
/>
```

## Props

### Required Props
| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data items to display |
| `columns` | `Column<T>[]` | Column definitions |
| `keyExtractor` | `(item: T) => string` | Function to extract unique key from each item |

### Optional Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mobileCardView` | `boolean` | `false` | Show as cards on mobile instead of table |
| `emptyMessage` | `string` | `"No data available"` | Message when data is empty |
| `loading` | `boolean` | `false` | Show loading state |
| `loadingMessage` | `string` | `"Loading..."` | Loading state message |
| `onRowClick` | `(item: T) => void` | `undefined` | Handler for row clicks |

## Column Configuration

### Column Interface
```typescript
interface Column<T> {
  key: string;              // Unique identifier
  label: string;            // Header label (desktop)
  className?: string;       // Custom CSS classes
  render?: (item: T) => ReactNode;  // Custom render function
  mobileLabel?: string;     // Custom label for mobile
  hideOnMobile?: boolean;   // Hide column on mobile
}
```

## Examples

### Example 1: Simple Table (Orders)
```typescript
const columns: Column<Order>[] = [
  {
    key: 'orderNumber',
    label: 'Order #',
    render: (order) => order.orderNumber,
  },
  {
    key: 'customer',
    label: 'Customer',
    render: (order) => order.user.fullName,
  },
  {
    key: 'total',
    label: 'Total',
    render: (order) => `₹${order.totalAmount.toLocaleString()}`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (order) => (
      <Badge className={getStatusColor(order.orderStatus)}>
        {order.orderStatus}
      </Badge>
    ),
  },
];

<ResponsiveTable
  data={orders}
  columns={columns}
  keyExtractor={(order) => order._id}
  mobileCardView={true}
/>
```

### Example 2: Table with Actions (Users)
```typescript
const columns: Column<User>[] = [
  {
    key: 'user',
    label: 'User',
    render: (user) => (
      <div>
        <p className="font-medium">{user.fullName}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    hideOnMobile: true,
    render: (user) => <Badge>{user.role}</Badge>,
  },
  {
    key: 'actions',
    label: 'Actions',
    className: 'text-right',
    render: (user) => (
      <div className="flex gap-2 justify-end">
        <Button size="sm" onClick={() => handleEdit(user._id)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={() => handleDelete(user._id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
```

### Example 3: With Images (Categories)
```typescript
const columns: Column<Category>[] = [
  {
    key: 'image',
    label: 'Image',
    hideOnMobile: true,
    render: (category) => (
      <Image
        src={category.image?.url}
        alt={category.name}
        width={48}
        height={48}
        className="rounded"
      />
    ),
  },
  {
    key: 'name',
    label: 'Category Name',
    render: (category) => category.name,
  },
  {
    key: 'status',
    label: 'Status',
    render: (category) => (
      <Badge variant={category.isActive ? 'default' : 'secondary'}>
        {category.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
```

## Migration Guide

### Before (Old Table Code)
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map((product) => (
      <TableRow key={product._id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>₹{product.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### After (New Responsive Table)
```typescript
const columns: Column<Product>[] = [
  { key: 'name', label: 'Name', render: (p) => p.name },
  { key: 'price', label: 'Price', render: (p) => `₹${p.price}` },
];

<ResponsiveTable
  data={products}
  columns={columns}
  keyExtractor={(p) => p._id}
  mobileCardView={true}
/>
```

## Best Practices

1. **Use TypeScript** - Define your data interface for type safety
2. **Provide Mobile Labels** - Use shorter labels for mobile when needed
3. **Hide Non-Essential Columns** - Use `hideOnMobile` for columns that aren't critical
4. **Enable Card View** - Set `mobileCardView={true}` for better mobile UX
5. **Handle Actions** - Use `e.stopPropagation()` in action buttons to prevent row clicks
6. **Keep Renders Simple** - Complex renders might slow down large tables

## Performance Tips

- Use `React.memo()` for custom render components
- Keep data arrays reasonably sized or implement pagination
- Use `keyExtractor` properly for React's reconciliation

## Component Already Implemented In
✅ Products Page - `/admin/products/page.tsx`

## To Be Migrated
- Orders Page
- Users Page  
- Categories Page
- Coupons Page
- Reviews Page
- Inventory Page
- Subcategories Page
- Customers Page
