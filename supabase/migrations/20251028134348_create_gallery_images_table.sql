/*
  # Create gallery images table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `title` (text) - Title/name of the image
      - `description` (text, optional) - Description of the pergola/project
      - `image_url` (text) - URL/path to the image file
      - `display_order` (integer) - Order for displaying images in gallery
      - `category` (text, optional) - Category like 'outdoor', 'modern', 'traditional'
      - `created_at` (timestamptz) - When the image was added
      - `updated_at` (timestamptz) - When the image was last updated

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public read access (anyone can view gallery)
    - Add policy for authenticated users to manage images

  3. Indexes
    - Index on `display_order` for efficient sorting
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  category text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view gallery images (public access)
CREATE POLICY "Anyone can view gallery images"
  ON gallery_images
  FOR SELECT
  USING (true);

-- Only authenticated users can insert images
CREATE POLICY "Authenticated users can insert images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update images
CREATE POLICY "Authenticated users can update images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete images
CREATE POLICY "Authenticated users can delete images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS gallery_images_display_order_idx ON gallery_images(display_order);