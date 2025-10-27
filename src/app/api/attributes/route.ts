import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attributes, attributeValues } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET all attributes with their values
export async function GET() {
  try {
    const allAttributes = await db.select().from(attributes);

    // Fetch values for each attribute
    const attributesWithValues = await Promise.all(
      allAttributes.map(async (attr) => {
        const values = await db.select().from(attributeValues).where(eq(attributeValues.attributeId, attr.id));
        return { ...attr, values };
      })
    );

    return NextResponse.json(attributesWithValues);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на атрибутите' }, { status: 500 });
  }
}

// POST new attribute
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, position, isActive, values } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Име и тип са задължителни' }, { status: 400 });
    }

    // Create attribute
    const newAttribute = await db
      .insert(attributes)
      .values({
        name,
        type,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    // Create attribute values if provided
    if (values && Array.isArray(values) && values.length > 0) {
      await db.insert(attributeValues).values(
        values.map((val: any, index: number) => ({
          attributeId: newAttribute[0].id,
          value: val.value,
          colorCode: val.colorCode || null,
          position: val.position !== undefined ? val.position : index,
        }))
      );
    }

    return NextResponse.json(newAttribute[0], { status: 201 });
  } catch (error) {
    console.error('Error creating attribute:', error);
    return NextResponse.json({ error: 'Грешка при създаване на атрибут' }, { status: 500 });
  }
}
