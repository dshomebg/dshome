import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { features } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET single feature by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feature = await db.select().from(features).where(eq(features.id, parseInt(id)));

    if (feature.length === 0) {
      return NextResponse.json({ error: 'Характеристиката не е намерена' }, { status: 404 });
    }

    return NextResponse.json(feature[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на характеристика' }, { status: 500 });
  }
}

// PUT update feature by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, position, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Името е задължително' }, { status: 400 });
    }

    const updatedFeature = await db
      .update(features)
      .set({
        name,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(features.id, parseInt(id)))
      .returning();

    if (updatedFeature.length === 0) {
      return NextResponse.json({ error: 'Характеристиката не е намерена' }, { status: 404 });
    }

    return NextResponse.json(updatedFeature[0]);
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Грешка при обновяване на характеристика' }, { status: 500 });
  }
}

// DELETE feature by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedFeature = await db
      .delete(features)
      .where(eq(features.id, parseInt(id)))
      .returning();

    if (deletedFeature.length === 0) {
      return NextResponse.json({ error: 'Характеристиката не е намерена' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Характеристиката е изтрита успешно' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Грешка при изтриване на характеристика' }, { status: 500 });
  }
}
