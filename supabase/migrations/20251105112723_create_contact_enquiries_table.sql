/*
  # Create contact enquiries table

  1. New Tables
    - `contact_enquiries`
      - `id` (uuid, primary key) - Unique identifier for each enquiry
      - `name` (text) - Customer's full name
      - `phone` (text) - Customer's phone number
      - `suburb` (text) - Customer's suburb/location
      - `email` (text) - Customer's email address (optional)
      - `project_type` (text) - Type of project (pergola, decking, weatherboard, other)
      - `message` (text) - Customer's message/enquiry details
      - `created_at` (timestamptz) - When the enquiry was submitted
      - `status` (text) - Status of enquiry (new, contacted, quoted, completed)
  
  2. Security
    - Enable RLS on `contact_enquiries` table
    - Add policy for authenticated users (admin) to read all enquiries
    - Add policy for anyone to insert enquiries (public form submission)
  
  3. Notes
    - This table stores all contact form submissions
    - Status field allows tracking of enquiry progress
    - Email is optional as some customers prefer phone contact
*/

CREATE TABLE IF NOT EXISTS contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  suburb text NOT NULL,
  email text,
  project_type text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit enquiries (public form)
CREATE POLICY "Anyone can submit enquiries"
  ON contact_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all enquiries
CREATE POLICY "Authenticated users can view all enquiries"
  ON contact_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update enquiry status
CREATE POLICY "Authenticated users can update enquiries"
  ON contact_enquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);