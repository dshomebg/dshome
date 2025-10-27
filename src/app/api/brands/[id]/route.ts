import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET single brand by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = await db.select().from(brands).where(eq(brands.id, parseInt(id)));

    if (brand.length === 0) {
      return NextResponse.json({ error: 'Марката не е намерена' }, { status: 404 });
    }

    return NextResponse.json(brand[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на марка' }, { status: 500 });
  }
}

// PUT update brand by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, logoUrl, description, metaTitle, metaDescription, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Име и slug са задължителни' }, { status: 400 });
    }

    const updatedBrand = await db
      .update(brands)
      .set({
        name,
        slug,
        logoUrl: logoUrl || null,
        description: description || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, parseInt(id)))
      .returning();

    if (updatedBrand.length === 0) {
      return NextResponse.json({ error: 'Марката не е намерена' }, { status: 404 });
    }

    return NextResponse.json(updatedBrand[0]);
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: 'Грешка при обновяване на марка' }, { status: 500 });
  }
}

// DELETE brand by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedBrand = await db
      .delete(brands)
      .where(eq(brands.id, parseInt(id)))
      .returning();

    if (deletedBrand.length === 0) {
      return NextResponse.json({ error: 'Марката не е намерена' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Марката е изтрита успешно' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Грешка при изтриване на марка' }, { status: 500 });
  }
}
