-- Migration: Create orders table for clothes booking MVP
-- Run in Supabase SQL editor or apply via supabase CLI

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  notes TEXT,
  delivery_address TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own orders
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to insert orders
CREATE POLICY "Authenticated users can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX orders_created_at_idx ON public.orders(created_at DESC);
