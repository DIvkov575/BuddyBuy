CREATE TABLE public.items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  rating smallint,
  image_url text
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own items"
  ON public.items 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON public.items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON public.items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item-images', 'item-images', true);

-- Set up access control for the storage bucket
CREATE POLICY "Anyone can view item images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'item-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'item-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'item-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );