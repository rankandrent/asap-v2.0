-- Create a materialized view for fast category and subcategory lookup
-- This view will be updated periodically and provides much faster queries

-- Create a function to get unique categories with subcategory counts (dynamic manufacturer)
CREATE OR REPLACE FUNCTION get_categories_summary(p_manufacturer_name TEXT DEFAULT 'Amatom')
RETURNS TABLE (
  category_name TEXT,
  subcategory_count BIGINT,
  total_parts BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.category AS category_name,
    COUNT(DISTINCT p.sub_category) AS subcategory_count,
    COUNT(*) AS total_parts
  FROM products_data p
  WHERE p.manufacturer = p_manufacturer_name
    AND p.category IS NOT NULL
    AND p.category != ''
    AND p.sub_category IS NOT NULL
    AND p.sub_category != ''
  GROUP BY p.category
  ORDER BY 
    CASE WHEN p.category = 'Standoffs' THEN 0 ELSE 1 END,
    p.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get subcategories for a category (dynamic manufacturer)
CREATE OR REPLACE FUNCTION get_subcategories_summary(
  p_category_name TEXT,
  p_manufacturer_name TEXT DEFAULT 'Amatom'
)
RETURNS TABLE (
  subcategory_name TEXT,
  part_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.sub_category AS subcategory_name,
    COUNT(*) AS part_count
  FROM products_data p
  WHERE p.manufacturer = p_manufacturer_name
    AND p.category = p_category_name
    AND p.sub_category IS NOT NULL
    AND p.sub_category != ''
  GROUP BY p.sub_category
  ORDER BY p.sub_category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anon role
GRANT EXECUTE ON FUNCTION get_categories_summary(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_categories_summary(TEXT) TO authenticated;

-- Grant execute permission to anon role
GRANT EXECUTE ON FUNCTION get_subcategories_summary(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_subcategories_summary(TEXT, TEXT) TO authenticated;

-- Create indexes for faster queries (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_products_manufacturer_category ON products_data(manufacturer, category);
CREATE INDEX IF NOT EXISTS idx_products_category_subcategory ON products_data(category, sub_category);
CREATE INDEX IF NOT EXISTS idx_products_manufacturer_category_subcategory ON products_data(manufacturer, category, sub_category);

