import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { UserService } from '@/types/userService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase URL or service role key in environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  global: {
    headers: {
      'x-ssr': '1',
    },
  },
});

const categories = [
  'Tutoring',
  'Babysitting',
  'Elderly Care',
  'Home Maintenance',
  'Pet Care',
  'Transportation',
  'Other',
] as const;

type Category = (typeof categories)[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.name || !body?.description || body?.price === undefined || !body?.location || !body?.category) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (typeof body.price !== 'number' || Number.isNaN(body.price) || body.price < 0) {
      return NextResponse.json({ message: 'Invalid price' }, { status: 400 });
    }

    if (!categories.includes(body.category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    const userprofile_id = body.userprofile_id
      ? String(body.userprofile_id).trim()
      : '05975042-38a2-47cc-b785-03716544c5cd';

    const newService: UserService = {
      services_id: randomUUID(),
      userprofile_id,
      name: String(body.name).trim(),
      description: String(body.description).trim(),
      price: body.price,
      location: String(body.location).trim(),
      category: body.category as Category,
      created_at: new Date().toISOString(),
      availability: ""
    };

    const { data, error } = await supabaseAdmin.from('services').insert([newService]).select().single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ message }, { status: 500 });
  }
}