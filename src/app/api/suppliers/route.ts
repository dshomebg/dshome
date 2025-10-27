import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { suppliers } from '@/db/schema';

// GET all suppliers
export async function GET() {
  try {
    const allSuppliers = await db.select().from(suppliers);
    return NextResponse.json(allSuppliers);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на доставчиците' }, { status: 500 });
  }
}

// POST new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contactPerson, email, phone, address, notes, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Името е задължително' }, { status: 400 });
    }

    const newSupplier = await db
      .insert(suppliers)
      .values({
        name,
        contactPerson: contactPerson || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json(newSupplier[0], { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Грешка при създаване на доставчик' }, { status: 500 });
  }
}
