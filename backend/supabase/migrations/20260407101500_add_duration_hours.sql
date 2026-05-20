ALTER TABLE public.reservations
ADD COLUMN duration_hours INTEGER;

UPDATE public.reservations
SET duration_hours = 2
WHERE duration_hours IS NULL;

ALTER TABLE public.reservations
ALTER COLUMN duration_hours SET NOT NULL;
