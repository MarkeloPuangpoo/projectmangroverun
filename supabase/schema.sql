-- Create a table for registrations
create table if not exists registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name_th text not null,
  full_name_en text not null,
  national_id text not null,
  birth_date date not null,
  age integer not null,
  gender text not null,
  blood_type text not null,
  medical_conditions text,
  phone text not null,
  email text not null,
  race_category text not null,
  shirt_size text not null,
  shipping_method text not null,
  payment_slip_url text, -- URL to the uploaded slip
  status text default 'pending'
);

-- Enable Row Level Security (RLS) on table
alter table registrations enable row level security;

-- Policy: Allow anyone to insert (register)
create policy "Enable insert for everyone" on registrations
  for insert with check (true);

-- Policy: Only authenticated users (admins) can view
create policy "Enable select for authenticated users only" on registrations
  for select using (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update (approve/reject)
create policy "Enable update for authenticated users only" on registrations
  for update using (auth.role() = 'authenticated');

-- Create a table for global settings
create table if not exists settings (
    key text primary key,
    value text not null
);

-- RLS for settings
alter table settings enable row level security;

create policy "Enable read for everyone" on settings
    for select using (true);

create policy "Enable all for authenticated users" on settings
    for all using (auth.role() = 'authenticated');

-- Seed default data
insert into settings (key, value) values ('runner_goal', '1500') on conflict (key) do nothing;

-- ==========================================
-- STORAGE SETUP (Run this part carefully)
-- ==========================================

-- 1. Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('payment-slips', 'payment-slips', true)
on conflict (id) do nothing;

-- 2. Allow Public Uploads (INSERT)
create policy "Allow public uploads to payment-slips"
on storage.objects for insert
with check ( bucket_id = 'payment-slips' );

-- 3. Allow Public Downloads/View (SELECT)
create policy "Allow public viewing of payment-slips"
on storage.objects for select
using ( bucket_id = 'payment-slips' );

-- 1. เพิ่มคอลัมน์เช็คว่ารับเสื้อ/BIB แล้วหรือยัง
ALTER TABLE registrations 
ADD COLUMN kit_picked_up BOOLEAN DEFAULT FALSE;

-- 2. เพิ่มคอลัมน์บันทึกเวลาที่มารับของ
ALTER TABLE registrations 
ADD COLUMN checked_in_at TIMESTAMP WITH TIME ZONE;

-- 3. (Optional) เพิ่มคอลัมน์เลข BIB (ถ้ามีการระบุเลข BIB ตอนรับ)
ALTER TABLE registrations 
ADD COLUMN bib_number TEXT;

-- 4. (แนะนำ) สร้าง Index ให้ค้นหาด้วยเบอร์โทร และ เลขบัตรประชาชน เร็วขึ้น
-- เพราะหน้า Check-in เราค้นหาด้วย 2 ค่านี้เป็นหลัก
CREATE INDEX idx_registrations_phone ON registrations(phone);
CREATE INDEX idx_registrations_national_id ON registrations(national_id);