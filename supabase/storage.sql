-- ====================================================================
-- MOMEN CENTER - SUPABASE STORAGE BUCKET CONFIGURATION
-- ====================================================================

-- 1. Create product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view images
CREATE POLICY "Public Read Access on product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- 3. Allow authenticated admins to upload images
CREATE POLICY "Admin Upload Access on product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    public.is_admin()
  );

-- 4. Allow authenticated admins to update/delete images
CREATE POLICY "Admin Delete Access on product-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    public.is_admin()
  );
