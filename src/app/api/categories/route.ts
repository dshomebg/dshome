import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Взима всички категории
export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Грешка при зареждане на категории:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на категории' },
      { status: 500 }
    );
  }
}

// POST - Създава нова категория
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      parentId,
      description,
      imageUrl,
      isActive,
      metaTitle,
      metaDescription
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Име и slug са задължителни' },
        { status: 400 }
      );
    }

    // Проверка дали slug вече съществува
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Категория с този slug вече съществува' },
        { status: 409 }
      );
    }

    const newCategory = await db
      .insert(categories)
      .values({
        name,
        slug,
        parentId: parentId || null,
        description: description || null,
        imageUrl: imageUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Грешка при създаване на категория:', error);
    return NextResponse.json(
      { error: 'Грешка при създаване на категория' },
      { status: 500 }
    );
  }
}
