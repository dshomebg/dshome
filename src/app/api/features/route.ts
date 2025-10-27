import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { features } from '@/db/schema';

// GET all features
export async function GET() {
  try {
    const allFeatures = await db.select().from(features);
    return NextResponse.json(allFeatures);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на характеристиките' }, { status: 500 });
  }
}

// POST new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Името е задължително' }, { status: 400 });
    }

    const newFeature = await db
      .insert(features)
      .values({
        name,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json(newFeature[0], { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Грешка при създаване на характеристика' }, { status: 500 });
  }
}
