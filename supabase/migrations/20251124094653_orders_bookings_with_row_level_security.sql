------------------------------------------------------------
-- 1) Create orders table safely (won't error if exists)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_date TIMESTAMPTZ,
  price DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------
-- 2) Add assigned_to column safely (only if missing)
------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='orders' 
        AND column_name='assigned_to'
    ) THEN
        ALTER TABLE public.orders
        ADD COLUMN assigned_to UUID REFERENCES auth.users(id);
    END IF;
END $$;

------------------------------------------------------------
-- 3) Enable RLS (safe)
------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

------------------------------------------------------------
-- 4) Drop old policies (safe)
------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Technicians can view orders" ON public.orders;
DROP POLICY IF EXISTS "Technicians can view assigned orders" ON public.orders;

------------------------------------------------------------
-- 5) Recreate clean policies
------------------------------------------------------------

-- Users: view only their own
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Users: create only for themselves
CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users: update only their own
CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

-- Admins: view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Technicians: view only orders assigned to them
CREATE POLICY "Technicians can view assigned orders"
ON public.orders FOR SELECT
USING (assigned_to = auth.uid());


-- Create function to auto-update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


------------------------------------------------------------
-- 6) Create timestamp trigger safely
------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at'
    ) THEN
        CREATE TRIGGER update_orders_updated_at
        BEFORE UPDATE ON public.orders
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

