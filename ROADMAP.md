# DSHOME E-commerce Platform - Development Roadmap

## Технологичен Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 3.4
- **Backend:** Next.js API Routes (Server Components)
- **Database:** PostgreSQL 16
- **ORM:** Drizzle ORM
- **Rich Text:** TipTap (React 19 compatible)
- **Forms:** React Hook Form (планирано)

---

## ✅ Фаза 1: Основна инфраструктура (ЗАВЪРШЕНА)

### 1.1 Проектна настройка
- [x] Next.js 15 + React 19 setup
- [x] Tailwind CSS конфигурация
- [x] PostgreSQL база данни setup
- [x] Drizzle ORM интеграция
- [x] Environment variables (.env.local)
- [x] TypeScript конфигурация

### 1.2 Admin Layout & Navigation
- [x] Sidebar навигация
- [x] Header компонент
- [x] Responsive layout
- [x] Dark mode support (готова инфраструктура)

---

## ✅ Фаза 2: Каталогов модул (ЗАВЪРШЕНА)

### 2.1 Категории (Categories) ✅
- [x] **База данни:**
  - Таблица `categories` с йерархична структура (parentId)
  - Полета: name, slug, description, image, metaTitle, metaDescription, isActive
- [x] **API Endpoints:**
  - GET /api/categories - всички категории
  - POST /api/categories - създаване
  - GET /api/categories/[id] - една категория
  - PUT /api/categories/[id] - обновяване
  - DELETE /api/categories/[id] - изтриване
- [x] **UI Компоненти:**
  - CategoryForm с WYSIWYG editor за описание
  - CategoriesTable със свиваема йерархия
  - Кирилско-латинско транслитериране за slug
- [x] **Страници:**
  - /admin/categories - listing
  - /admin/categories/new - създаване
  - /admin/categories/edit/[id] - редактиране

### 2.2 Марки (Brands) ✅
- [x] **База данни:**
  - Таблица `brands`
  - Полета: name, slug, logoUrl, description, metaTitle, metaDescription, isActive
- [x] **API Endpoints:** Пълен CRUD
- [x] **UI Компоненти:**
  - BrandForm с logo upload и WYSIWYG описание
  - BrandsTable с лого thumbnails
- [x] **Страници:** Listing, New, Edit

### 2.3 Доставчици (Suppliers) ✅
- [x] **База данни:**
  - Таблица `suppliers`
  - Полета: name, contactPerson, email, phone, address, isActive
- [x] **API Endpoints:** Пълен CRUD
- [x] **UI Компоненти:**
  - SupplierForm (проста форма)
  - SuppliersTable с clickable email/phone links
- [x] **Страници:** Listing, New, Edit

### 2.4 Атрибути (Attributes) ✅
- [x] **База данни:**
  - Таблица `attributes` с type поле ('select', 'radio', 'color')
  - Таблица `attributeValues` с colorCode за цветове
- [x] **API Endpoints:**
  - GET с вложени values
  - POST/PUT/DELETE с управление на values
- [x] **UI Компоненти:**
  - AttributeForm с динамично добавяне/премахване на стойности
  - Color picker за цветни атрибути
  - AttributesTable със показване на тип и стойности
- [x] **Страници:** Listing, New, Edit

### 2.5 Характеристики (Features) ✅
- [x] **База данни:**
  - Таблица `features`
  - Полета: name, position, isActive
- [x] **API Endpoints:** Пълен CRUD
- [x] **UI Компоненти:**
  - FeatureForm (проста форма)
  - FeaturesTable
- [x] **Страници:** Listing, New, Edit

### 2.6 Складове (Warehouses) ✅
- [x] **База данни:**
  - Таблица `warehouses`
  - Полета: name, address, city, phone, email, isActive
- [x] **API Endpoints:** GET (за products quantity tab)
- [ ] **UI Компоненти:** (Планирано за Фаза 3)
- [ ] **Страници:** (Планирано за Фаза 3)

---

## ✅ Фаза 3: Продуктов модул (ЗАВЪРШЕНА)

### 3.1 Продукти - База данни ✅
- [x] **Основна таблица `products`:**
  - reference (unique, required)
  - name, slug
  - shortDescription, longDescription (WYSIWYG)
  - priceWithVat, priceWithoutVat, costPrice
  - width, height, depth, weight, deliveryTime
  - metaTitle, metaDescription, canonicalUrl
  - visibility, hasVariations
  - brandId, supplierId, defaultCategoryId (foreign keys)
  - isActive, createdAt, updatedAt

- [x] **Свързани таблици:**
  - `productImages` - множество изображения с isPrimary, altText, position
  - `productCategories` - many-to-many връзка (composite PK)
  - `productFeatures` - характеристики със стойности
  - `productVariations` - комбинации с price/weight impact
  - `productVariationAttributes` - атрибути на комбинациите
  - `productStock` - наличности по складове (composite PK: productId + warehouseId)
  - `productDiscounts` - отстъпки с дати и тип (percentage/fixed)

### 3.2 Продукти - API ✅
- [x] **GET /api/products:**
  - Всички продукти с primary image
  - Join с brands, suppliers, categories
  - Сортиране по createdAt DESC

- [x] **POST /api/products:**
  - Създаване на продукт
  - Добавяне на images, categories, features, stock
  - Валидация (reference, name, slug, prices)

- [x] **GET /api/products/[id]:**
  - Един продукт с всички връзки
  - Images, categories, features, stock, variations

- [x] **PUT /api/products/[id]:**
  - Обновяване на основни данни
  - Replace на images, categories, features, stock

- [x] **DELETE /api/products/[id]:**
  - Изтриване (CASCADE на всички връзки)

### 3.3 Продукти - UI Компоненти ✅

#### ProductForm (6 таба) ✅
- [x] **Таб 1 - Основни настройки:**
  - Референция (required, unique)
  - Име + auto slug с кирилско транслитериране
  - ProductImageUploader - множество изображения с:
    - Позиция (drag & drop или ↑↓)
    - isPrimary флаг
    - ALT текст за SEO
    - Preview thumbnails
  - Кратко описание (WYSIWYG - TipTap)
  - Дълго описание (WYSIWYG - TipTap)
  - Марка (dropdown от brands)
  - Категории (многоизборен checkbox list)
  - Основна категория (dropdown от избраните категории)
  - ProductFeaturesSelector - динамичен списък feature + value
  - Toggle "Продукт с комбинации"

- [x] **Таб 2 - Количества:**
  - Списък със складове
  - Input за количество за всеки склад
  - Обща наличност (сума)
  - Визуална карта на наличностите

- [x] **Таб 3 - Доставка:**
  - Размери: ширина, височина, дълбочина (cm)
  - Тегло (kg)
  - Срок за доставка (текстово поле)
  - Auto-calc на обем (m³)

- [x] **Таб 4 - Ценообразуване:**
  - Цена с ДДС (auto-calc от без ДДС)
  - Цена без ДДС (auto-calc от с ДДС)
  - Себестойност
  - Auto-calc на:
    - Печалба (price - cost)
    - Марж % ((price - cost) / cost * 100)
    - ДДС сума
  - Визуална карта на рентабилността

- [x] **Таб 5 - SEO:**
  - Meta Title (character count 50-60)
  - Meta Description (character count 120-160)
  - Canonical URL
  - Google Preview визуализация
  - SEO Checklist със статус индикатори:
    - ✓ Име попълнено
    - ✓ Slug генериран
    - ✓ Meta title оптимален
    - ✓ Meta description оптимална
    - ✓ Има изображения

- [x] **Таб 6 - Опции:**
  - Видимост (visible/hidden)
  - Доставчик (dropdown)
  - Активен статус (toggle)
  - Предупреждение при неактивен продукт

#### Помощни компоненти ✅
- [x] ProductImageUploader - управление на множество изображения
- [x] ProductCategoriesSelector - checkbox списък
- [x] ProductFeaturesSelector - динамичен списък

#### ProductsTable ✅
- [x] Изображение (thumbnail 64x64)
- [x] Референция
- [x] Име (с бадж "С вариации" ако hasVariations)
- [x] Цена (с ДДС + без ДДС)
- [x] Марка
- [x] Статус (Активен/Неактивен + Скрит бадж)
- [x] Действия (Редактирай, Изтрий)
- [x] Филтри:
  - Search по име/референция
  - Filter по статус (всички/активни/неактивни)

### 3.4 Продукти - Страници ✅
- [x] **/admin/products** - listing с ProductsTable
- [x] **/admin/products/new** - създаване с ProductForm
- [x] **/admin/products/edit/[id]** - редактиране с ProductForm

---

## 🚧 Фаза 4: Складов модул (ПЛАНИРАНА)

### 4.1 Warehouse Management UI
- [ ] WarehouseForm компонент
- [ ] WarehousesTable компонент
- [ ] Admin страници (listing, new, edit)

### 4.2 Stock Management
- [ ] Bulk stock import/export
- [ ] Stock history tracking
- [ ] Low stock alerts
- [ ] Stock transfer between warehouses

---

## 📋 Фаза 5: Поръчки (ПЛАНИРАНА)

### 5.1 Order Management
- [ ] База данни:
  - orders таблица
  - orderItems таблица
  - orderStatus history
- [ ] API endpoints
- [ ] OrderForm компонент
- [ ] OrdersTable с филтри
- [ ] Order details страница
- [ ] Status workflow (pending → processing → shipped → delivered)

### 5.2 Payment Integration
- [ ] Payment gateway integration
- [ ] Payment status tracking
- [ ] Refunds management

---

## 👥 Фаза 6: Клиенти (ПЛАНИРАНА)

### 6.1 Customer Management
- [ ] База данни: customers, addresses
- [ ] API endpoints
- [ ] CustomerForm
- [ ] CustomersTable
- [ ] Customer details с история на поръчки

### 6.2 Customer Features
- [ ] Registration/Login
- [ ] Profile management
- [ ] Address book
- [ ] Order history
- [ ] Wishlist

---

## 🛍️ Фаза 7: Фронтенд (ПЛАНИРАНА)

### 7.1 Public Pages
- [ ] Home page
- [ ] Product listing page (с филтри)
- [ ] Product details page
- [ ] Category pages
- [ ] Brand pages
- [ ] Search functionality

### 7.2 Shopping Experience
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Payment integration
- [ ] Order confirmation
- [ ] Email notifications

---

## ⚙️ Фаза 8: Настройки и Оптимизация (ПЛАНИРАНА)

### 8.1 System Settings
- [ ] General settings (site name, logo, etc.)
- [ ] Email settings
- [ ] Payment settings
- [ ] Shipping settings
- [ ] Tax settings

### 8.2 Performance & SEO
- [ ] Image optimization
- [ ] Caching strategy
- [ ] Sitemap generation
- [ ] Robots.txt
- [ ] Meta tags optimization
- [ ] Schema.org markup

### 8.3 Analytics & Reporting
- [ ] Sales reports
- [ ] Inventory reports
- [ ] Customer reports
- [ ] Google Analytics integration

---

## 🔒 Фаза 9: Сигурност и Auth (ПЛАНИРАНА)

### 9.1 Authentication
- [ ] NextAuth.js setup
- [ ] Admin login
- [ ] Customer login
- [ ] Role-based access control (RBAC)
- [ ] Password reset

### 9.2 Security
- [ ] CSRF protection
- [ ] XSS protection
- [ ] SQL injection prevention
- [ ] Rate limiting
- [ ] Security headers

---

## 📊 Статус на прогреса

### Общо завършени модули: 8/30+ (27%)

#### ✅ Завършени:
1. Categories (с йерархия)
2. Brands
3. Suppliers
4. Attributes (с типове)
5. Features
6. Warehouses (база данни + API)
7. Products (пълен модул с 6 таба)
8. Product Images (управление)

#### 🚧 В прогрес:
- Няма

#### 📋 Планирани:
- Warehouse UI
- Stock Management
- Orders
- Customers
- Frontend
- Settings
- Auth & Security

---

## 🎯 Следващи стъпки

1. **Warehouse UI** - довършване на складовия модул (UI + админ страници)
2. **Product Variations** - генератор на комбинации
3. **Orders Module** - система за поръчки
4. **Customers Module** - управление на клиенти
5. **Frontend** - публична част на магазина

---

## 📝 Бележки

- Всички модули използват кирилско-латинско транслитериране за slug генериране
- WYSIWYG редакторът (TipTap) е React 19 compatible
- Всички форми включват валидация
- Composite primary keys се използват за many-to-many връзки
- CASCADE DELETE за автоматично изчистване на свързани записи
- Timestamps (createdAt, updatedAt) на всички основни таблици
