import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { warehouses } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET /api/warehouses
export async function GET() {
  try {
    const allWarehouses = await db.select().from(warehouses).orderBy(desc(warehouses.createdAt));
    return NextResponse.json(allWarehouses);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на складовете' },
      { status: 500 }
    );
  }
}

// POST /api/warehouses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, city, phone, email, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Името е задължително' }, { status: 400 });
    }

    const [newWarehouse] = await db
      .insert(warehouses)
      .values({
        name,
        address: address || null,
        city: city || null,
        phone: phone || null,
        email: email || null,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json(newWarehouse, { status: 201 });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json(
      { error: 'Грешка при създаване на склада' },
      { status: 500 }
    );
  }
}
