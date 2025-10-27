import { pgTable, serial, text, timestamp, integer, boolean, decimal, primaryKey } from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

// Users table
export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
  role: text('role').default('customer'),
  createdAt: timestamp('created_at').defaultNow(),
});

// NextAuth accounts table
export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// NextAuth sessions table
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// NextAuth verification tokens
export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Products table (Продукти) - основна таблица
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  reference: text('reference').notNull().unique(), // Референция (задължително)
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description'), // Кратко описание (WYSIWYG)
  longDescription: text('long_description'), // Дълго описание (WYSIWYG)

  // Цени
  priceWithVat: decimal('price_with_vat', { precision: 10, scale: 2 }).notNull(),
  priceWithoutVat: decimal('price_without_vat', { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }), // Себестойност

  // Размери и тегло (Таб 3: Доставка)
  width: decimal('width', { precision: 10, scale: 2 }), // Ширина
  height: decimal('height', { precision: 10, scale: 2 }), // Височина
  depth: decimal('depth', { precision: 10, scale: 2 }), // Дълбочина
  weight: decimal('weight', { precision: 10, scale: 2 }), // Тегло
  deliveryTime: text('delivery_time'), // Срок за доставка

  // SEO (Таб 5)
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  canonicalUrl: text('canonical_url'),

  // Опции (Таб 6)
  visibility: text('visibility').default('visible'), // 'visible' | 'hidden'
  hasVariations: boolean('has_variations').default(false), // Обикновен продукт vs Продукт с комбинации

  // Връзки към други таблици
  brandId: integer('brand_id').references(() => brands.id, { onDelete: 'set null' }),
  supplierId: integer('supplier_id').references(() => suppliers.id, { onDelete: 'set null' }),
  defaultCategoryId: integer('default_category_id').references(() => categories.id, { onDelete: 'set null' }),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: integer('parent_id').references(() => categories.id, { onDelete: 'cascade' }),
  description: text('description'),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Brands table (Марки)
export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  description: text('description'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Suppliers table (Доставчици)
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  notes: text('notes'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Attributes table (Атрибути)
export const attributes = pgTable('attributes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'select', 'radio', 'color'
  position: integer('position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Attribute Values table (Стойности на атрибути)
export const attributeValues = pgTable('attribute_values', {
  id: serial('id').primaryKey(),
  attributeId: integer('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade' }),
  value: text('value').notNull(),
  colorCode: text('color_code'), // за type='color'
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Features table (Характеристики)
export const features = pgTable('features', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  position: integer('position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Warehouses table (Складове)
export const warehouses = pgTable('warehouses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  city: text('city'),
  phone: text('phone'),
  email: text('email'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product Images table (Продуктови изображения)
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'), // ALT текст
  position: integer('position').default(0),
  isPrimary: boolean('is_primary').default(false), // Основна снимка
  createdAt: timestamp('created_at').defaultNow(),
});

// Product Categories relation table (Продукт-Категории релация - many-to-many)
export const productCategories = pgTable('product_categories', {
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.categoryId] }),
}));

// Product Features relation table (Продукт-Характеристики релация с стойност)
export const productFeatures = pgTable('product_features', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  featureId: integer('feature_id').notNull().references(() => features.id, { onDelete: 'cascade' }),
  value: text('value').notNull(), // Стойност на характеристиката за този продукт
  createdAt: timestamp('created_at').defaultNow(),
});

// Product Variations table (Продуктови комбинации/вариации)
export const productVariations = pgTable('product_variations', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  reference: text('reference').notNull(), // Реф. номер на комбинацията (задължително)
  priceImpact: decimal('price_impact', { precision: 10, scale: 2 }).default('0'), // Влияние върху цената (+/-)
  weightImpact: decimal('weight_impact', { precision: 10, scale: 2 }).default('0'), // Влияние върху теглото (+/-)
  quantity: integer('quantity').default(0), // Количество за тази комбинация
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product Variation Attributes table (Атрибути на комбинациите)
export const productVariationAttributes = pgTable('product_variation_attributes', {
  id: serial('id').primaryKey(),
  variationId: integer('variation_id').notNull().references(() => productVariations.id, { onDelete: 'cascade' }),
  attributeId: integer('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade' }),
  attributeValueId: integer('attribute_value_id').notNull().references(() => attributeValues.id, { onDelete: 'cascade' }),
});

// Product Stock table (Наличности по складове)
export const productStock = pgTable('product_stock', {
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  warehouseId: integer('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.warehouseId] }),
}));

// Product Discounts table (Продуктови намаления)
export const productDiscounts = pgTable('product_discounts', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  discountType: text('discount_type').notNull(), // 'percentage' | 'fixed'
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
