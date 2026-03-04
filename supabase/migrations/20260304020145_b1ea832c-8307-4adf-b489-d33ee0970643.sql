-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id TEXT NOT NULL,
  zone TEXT NOT NULL,
  table_number INTEGER NOT NULL,
  capacity TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  guests INTEGER,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public reservation form)
CREATE POLICY "Anyone can create reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read (to show booked tables)
CREATE POLICY "Anyone can view reservations"
  ON public.reservations FOR SELECT
  USING (true);