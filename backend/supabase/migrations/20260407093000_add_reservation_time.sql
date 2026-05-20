ALTER TABLE public.reservations
ADD COLUMN reservation_time TIME;

UPDATE public.reservations
SET reservation_time = '19:00:00'
WHERE reservation_time IS NULL;

ALTER TABLE public.reservations
ALTER COLUMN reservation_time SET NOT NULL;
