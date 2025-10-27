import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  products,
  productImages,
  productCategories,
  productFeatures,
  productStock,
  productVariations,
  productVariationAttributes,
  brands,
  suppliers,
  categories,
  features,
  warehouses,
} from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/products/[id] - Вземи един продукт с всички връзки
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // Вземи основните данни на продукта
    const [product] = await db
      .select({
        id: products.id,
        reference: products.reference,
        name: products.name,
        slug: products.slug,
        shortDescription: products.shortDescription,
        longDescription: products.longDescription,
        priceWithVat: products.priceWithVat,
        priceWithoutVat: products.priceWithoutVat,
        costPrice: products.costPrice,
        width: products.width,
        height: products.height,
        depth: products.depth,
        weight: products.weight,
        deliveryTime: products.deliveryTime,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        canonicalUrl: products.canonicalUrl,
        visibility: products.visibility,
        hasVariations: products.hasVariations,
        brandId: products.brandId,
        supplierId: products.supplierId,
        defaultCategoryId: products.defaultCategoryId,
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
      .where(eq(products.id, productId));

    if (!product) {
      return NextResponse.json(
        { error: 'Продуктът не е намерен' },
        { status: 404 }
      );
    }

    // Вземи изображенията
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.position);

    // Вземи категориите
    const productCats = await db
      .select({
        categoryId: productCategories.categoryId,
        categoryName: categories.name,
      })
      .from(productCategories)
      .leftJoin(categories, eq(productCategories.categoryId, categories.id))
      .where(eq(productCategories.productId, productId));

    // Вземи характеристиките
    const productFeats = await db
      .select({
        id: productFeatures.id,
        featureId: productFeatures.featureId,
        featureName: features.name,
        value: productFeatures.value,
      })
      .from(productFeatures)
      .leftJoin(features, eq(productFeatures.featureId, features.id))
      .where(eq(productFeatures.productId, productId));

    // Вземи наличностите по складове
    const stock = await db
      .select({
        warehouseId: productStock.warehouseId,
        warehouseName: warehouses.name,
        quantity: productStock.quantity,
        updatedAt: productStock.updatedAt,
      })
      .from(productStock)
      .leftJoin(warehouses, eq(productStock.warehouseId, warehouses.id))
      .where(eq(productStock.productId, productId));

    // Вземи вариациите (ако има)
    const variations = await db
      .select()
      .from(productVariations)
      .where(eq(productVariations.productId, productId));

    // За всяка вариация вземи атрибутите й
    const variationsWithAttributes = await Promise.all(
      variations.map(async (variation) => {
        const attributes = await db
          .select()
          .from(productVariationAttributes)
          .where(eq(productVariationAttributes.variationId, variation.id));

        return {
          ...variation,
          attributes,
        };
      })
    );

    return NextResponse.json({
      ...product,
      images,
      categories: productCats,
      features: productFeats,
      stock,
      variations: variationsWithAttributes,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на продукта' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Обнови продукт
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
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

    // Обнови основните данни
    const [updatedProduct] = await db
      .update(products)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    // Обнови изображенията (изтрий старите, добави новите)
    if (images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, productId));
      if (images.length > 0) {
        await db.insert(productImages).values(
          images.map((img: any, index: number) => ({
            productId,
            imageUrl: img.imageUrl,
            altText: img.altText || null,
            position: img.position !== undefined ? img.position : index,
            isPrimary: img.isPrimary || index === 0,
          }))
        );
      }
    }

    // Обнови категориите
    if (categoryIds !== undefined) {
      await db.delete(productCategories).where(eq(productCategories.productId, productId));
      if (categoryIds.length > 0) {
        await db.insert(productCategories).values(
          categoryIds.map((categoryId: number) => ({
            productId,
            categoryId,
          }))
        );
      }
    }

    // Обнови характеристиките
    if (features !== undefined) {
      await db.delete(productFeatures).where(eq(productFeatures.productId, productId));
      if (features.length > 0) {
        await db.insert(productFeatures).values(
          features.map((feature: any) => ({
            productId,
            featureId: feature.featureId,
            value: feature.value,
          }))
        );
      }
    }

    // Обнови наличностите
    if (stockByWarehouse !== undefined) {
      await db.delete(productStock).where(eq(productStock.productId, productId));
      if (stockByWarehouse.length > 0) {
        await db.insert(productStock).values(
          stockByWarehouse.map((stock: any) => ({
            productId,
            warehouseId: stock.warehouseId,
            quantity: stock.quantity,
          }))
        );
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Грешка при обновяване на продукта' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Изтрий продукт
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // Изтрий продукта (CASCADE ще изтрие и всички свързани записи)
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Грешка при изтриване на продукта' },
      { status: 500 }
    );
  }
}
