-- ============================================================
-- Supabase Storage — وسائط الأعمال
-- شغّل هذا الملف مرة واحدة في SQL Editor داخل Supabase
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can view project media"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-media');

CREATE POLICY "Authenticated users can upload project media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-media');

CREATE POLICY "Authenticated users can update project media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project-media')
WITH CHECK (bucket_id = 'project-media');

CREATE POLICY "Authenticated users can delete project media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project-media');
