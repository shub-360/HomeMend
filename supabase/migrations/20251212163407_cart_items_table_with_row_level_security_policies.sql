
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  preferred_time TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cart_items
CREATE POLICY "Users can view their own cart items"
  ON public.cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart items"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON public.cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON public.cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add DELETE policy for orders table
CREATE POLICY "Users can delete their own orders"
  ON public.orders
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow admins to delete orders
CREATE POLICY "Admins can delete all orders"
  ON public.orders
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
