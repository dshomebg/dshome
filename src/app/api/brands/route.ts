import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';

// GET all brands
export async function GET() {
  try {
    const allBrands = await db.select().from(brands);
    return NextResponse.json(allBrands);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на марките' }, { status: 500 });
  }
}

// POST new brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, logoUrl, description, metaTitle, metaDescription, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Име и slug са задължителни' }, { status: 400 });
    }

    const newBrand = await db
      .insert(brands)
      .values({
        name,
        slug,
        logoUrl: logoUrl || null,
        description: description || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json(newBrand[0], { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Грешка при създаване на марка' }, { status: 500 });
  }
}
