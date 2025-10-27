import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { suppliers } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET single supplier by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplier = await db.select().from(suppliers).where(eq(suppliers.id, parseInt(id)));

    if (supplier.length === 0) {
      return NextResponse.json({ error: 'Доставчикът не е намерен' }, { status: 404 });
    }

    return NextResponse.json(supplier[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на доставчик' }, { status: 500 });
  }
}

// PUT update supplier by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, contactPerson, email, phone, address, notes, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Името е задължително' }, { status: 400 });
    }

    const updatedSupplier = await db
      .update(suppliers)
      .set({
        name,
        contactPerson: contactPerson || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(suppliers.id, parseInt(id)))
      .returning();

    if (updatedSupplier.length === 0) {
      return NextResponse.json({ error: 'Доставчикът не е намерен' }, { status: 404 });
    }

    return NextResponse.json(updatedSupplier[0]);
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json({ error: 'Грешка при обновяване на доставчик' }, { status: 500 });
  }
}

// DELETE supplier by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedSupplier = await db
      .delete(suppliers)
      .where(eq(suppliers.id, parseInt(id)))
      .returning();

    if (deletedSupplier.length === 0) {
      return NextResponse.json({ error: 'Доставчикът не е намерен' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Доставчикът е изтрит успешно' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json({ error: 'Грешка при изтриване на доставчик' }, { status: 500 });
  }
}
