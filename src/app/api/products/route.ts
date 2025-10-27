import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  products,
  productImages,
  productCategories,
  productFeatures,
  productStock,
  brands,
  suppliers,
  categories
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/products - Вземи всички продукти
export async function GET() {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        reference: products.reference,
        name: products.name,
        slug: products.slug,
        priceWithVat: products.priceWithVat,
        priceWithoutVat: products.priceWithoutVat,
        visibility: products.visibility,
        hasVariations: products.hasVariations,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brandName: brands.name,
        supplierName: suppliers.name,
        defaultCategoryName: categories.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .leftJoin(categories, eq(products.defaultCategoryId, categories.id))
      .orderBy(desc(products.createdAt));

    // За всеки продукт вземи основната снимка
    const productsWithImages = await Promise.all(
      allProducts.map(async (product) => {
        const images = await db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(desc(productImages.isPrimary));

        return {
          ...product,
          primaryImage: images[0]?.imageUrl || null,
        };
      })
    );

    return NextResponse.json(productsWithImages);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на продуктите' },
      { status: 500 }
    );
  }
}

// POST /api/products - Създай нов продукт
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reference,
      name,
      slug,
      shortDescription,
      longDescription,
      priceWithVat,
      priceWithoutVat,
      costPrice,
      width,
      height,
      depth,
      weight,
      deliveryTime,
      metaTitle,
      metaDescription,
      canonicalUrl,
      visibility,
      hasVariations,
      brandId,
      supplierId,
      defaultCategoryId,
      isActive,
      // Related data
      images,
      categoryIds,
      features,
      stockByWarehouse,
    } = body;

    // Валидация
    if (!reference || !name || !slug) {
      return NextResponse.json(
        { error: 'Референция, име и slug са задължителни' },
        { status: 400 }
      );
    }

    if (!priceWithVat || !priceWithoutVat) {
      return NextResponse.json(
        { error: 'Цените с и без ДДС са задължителни' },
        { status: 400 }
      );
    }

    // Създай продукта
    const [newProduct] = await db
      .insert(products)
      .values({
        reference,
        name,
        slug,
        shortDescription: shortDescription || null,
        longDescription: longDescription || null,
        priceWithVat: priceWithVat.toString(),
        priceWithoutVat: priceWithoutVat.toString(),
        costPrice: costPrice ? costPrice.toString() : null,
        width: width ? width.toString() : null,
        height: height ? height.toString() : null,
        depth: depth ? depth.toString() : null,
        weight: weight ? weight.toString() : null,
        deliveryTime: deliveryTime || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        visibility: visibility || 'visible',
        hasVariations: hasVariations || false,
        brandId: brandId || null,
        supplierId: supplierId || null,
        defaultCategoryId: defaultCategoryId || null,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    // Добави изображения
    if (images && images.length > 0) {
      await db.insert(productImages).values(
        images.map((img: any, index: number) => ({
          productId: newProduct.id,
          imageUrl: img.imageUrl,
          altText: img.altText || null,
          position: img.position !== undefined ? img.position : index,
          isPrimary: img.isPrimary || index === 0,
        }))
      );
    }

    // Добави категории
    if (categoryIds && categoryIds.length > 0) {
      await db.insert(productCategories).values(
        categoryIds.map((categoryId: number) => ({
          productId: newProduct.id,
          categoryId,
        }))
      );
    }

    // Добави характеристики
    if (features && features.length > 0) {
      await db.insert(productFeatures).values(
        features.map((feature: any) => ({
          productId: newProduct.id,
          featureId: feature.featureId,
          value: feature.value,
        }))
      );
    }

    // Добави наличности по складове
    if (stockByWarehouse && stockByWarehouse.length > 0) {
      await db.insert(productStock).values(
        stockByWarehouse.map((stock: any) => ({
          productId: newProduct.id,
          warehouseId: stock.warehouseId,
          quantity: stock.quantity,
        }))
      );
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Грешка при създаване на продукта' },
      { status: 500 }
    );
  }
}
