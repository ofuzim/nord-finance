-- Allow anonymous users to upload to application-documents bucket
-- (uploads happen client-side with the anon key during form submission)
create policy "Public can upload application documents"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'application-documents');

-- Allow authenticated admins to read objects (for signed URL generation via service role this is bypassed, but explicit is better)
create policy "Authenticated can read application documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'application-documents');

-- Allow authenticated admins to delete objects
create policy "Authenticated can delete application documents"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'application-documents');
