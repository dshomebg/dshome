import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Взима една категория по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Невалидно ID' }, { status: 400 });
    }

    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { error: 'Категорията не е намерена' },
        { status: 404 }
      );
    }

    return NextResponse.json(category[0]);
  } catch (error) {
    console.error('Грешка при зареждане на категория:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на категория' },
      { status: 500 }
    );
  }
}

// PUT - Обновява категория
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Невалидно ID' }, { status: 400 });
    }

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

    // Проверка дали slug вече съществува при друга категория
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== categoryId) {
      return NextResponse.json(
        { error: 'Категория с този slug вече съществува' },
        { status: 409 }
      );
    }

    const updated = await db
      .update(categories)
      .set({
        name,
        slug,
        parentId: parentId || null,
        description: description || null,
        imageUrl: imageUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Категорията не е намерена' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Грешка при обновяване на категория:', error);
    return NextResponse.json(
      { error: 'Грешка при обновяване на категория' },
      { status: 500 }
    );
  }
}

// DELETE - Изтрива категория
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Невалидно ID' }, { status: 400 });
    }

    const deleted = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Категорията не е намерена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (error) {
    console.error('Грешка при изтриване на категория:', error);
    return NextResponse.json(
      { error: 'Грешка при изтриване на категория' },
      { status: 500 }
    );
  }
}
