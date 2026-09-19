INSERT INTO users (full_name, email, password_hash, role, is_deleted)
VALUES (
  'Demo Super Admin',
  'demo@1410inc.xyz',
  '$2b$10$f95CVqecM6aw5bXv3hZgUuUsJfVj8sKb4ZCLQig84Qx8VuASspROy',
  'super',
  0
)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  role = VALUES(role),
  is_deleted = 0;

INSERT INTO items (code, name, unit_price, quantity, is_deleted)
VALUES
  ('SKU-001', 'Demo Item A', 100.00, 25, 0),
  ('SKU-002', 'Demo Item B', 59.50, 40, 0),
  ('SKU-003', 'Demo Item C', 250.00, 10, 0)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  unit_price = VALUES(unit_price),
  quantity = VALUES(quantity),
  is_deleted = 0;
