import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attributes, attributeValues } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET single attribute by ID with values
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attribute = await db.select().from(attributes).where(eq(attributes.id, parseInt(id)));

    if (attribute.length === 0) {
      return NextResponse.json({ error: 'Атрибутът не е намерен' }, { status: 404 });
    }

    // Fetch values for this attribute
    const values = await db.select().from(attributeValues).where(eq(attributeValues.attributeId, parseInt(id)));

    return NextResponse.json({ ...attribute[0], values });
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на атрибут' }, { status: 500 });
  }
}

// PUT update attribute by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, position, isActive, values } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Име и тип са задължителни' }, { status: 400 });
    }

    // Update attribute
    const updatedAttribute = await db
      .update(attributes)
      .set({
        name,
        type,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(attributes.id, parseInt(id)))
      .returning();

    if (updatedAttribute.length === 0) {
      return NextResponse.json({ error: 'Атрибутът не е намерен' }, { status: 404 });
    }

    // Delete existing values and create new ones
    if (values && Array.isArray(values)) {
      await db.delete(attributeValues).where(eq(attributeValues.attributeId, parseInt(id)));

      if (values.length > 0) {
        await db.insert(attributeValues).values(
          values.map((val: any, index: number) => ({
            attributeId: parseInt(id),
            value: val.value,
            colorCode: val.colorCode || null,
            position: val.position !== undefined ? val.position : index,
          }))
        );
      }
    }

    return NextResponse.json(updatedAttribute[0]);
  } catch (error) {
    console.error('Error updating attribute:', error);
    return NextResponse.json({ error: 'Грешка при обновяване на атрибут' }, { status: 500 });
  }
}

// DELETE attribute by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedAttribute = await db
      .delete(attributes)
      .where(eq(attributes.id, parseInt(id)))
      .returning();

    if (deletedAttribute.length === 0) {
      return NextResponse.json({ error: 'Атрибутът не е намерен' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Атрибутът е изтрит успешно' });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return NextResponse.json({ error: 'Грешка при изтриване на атрибут' }, { status: 500 });
  }
}
