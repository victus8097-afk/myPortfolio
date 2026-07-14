-- أضف تاريخ انتهاء العمل إلى جدول الأعمال الموجود مسبقاً
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS completed_at DATE;
