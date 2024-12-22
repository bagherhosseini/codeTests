ALTER TABLE properties RENAME COLUMN weight TO atomic_mass;
ALTER TABLE properties RENAME COLUMN melting_point TO melting_point_celsius;
ALTER TABLE properties RENAME COLUMN boiling_point TO boiling_point_celsius;

ALTER TABLE properties 
  ALTER COLUMN melting_point_celsius SET NOT NULL,
  ALTER COLUMN boiling_point_celsius SET NOT NULL;

ALTER TABLE elements 
  ADD UNIQUE (symbol),
  ADD UNIQUE (name),
  ALTER COLUMN symbol SET NOT NULL,
  ALTER COLUMN name SET NOT NULL;

CREATE TABLE types (
  type_id SERIAL PRIMARY KEY,
  type VARCHAR(30) NOT NULL
);

INSERT INTO types (type) VALUES ('metal'), ('nonmetal'), ('metalloid');

ALTER TABLE properties 
  ADD COLUMN type_id INT NOT NULL;

ALTER TABLE properties 
  ADD FOREIGN KEY (atomic_number) REFERENCES elements(atomic_number);

ALTER TABLE properties 
  ADD FOREIGN KEY (type_id) REFERENCES types(type_id);

UPDATE properties SET type_id = (
  SELECT type_id FROM types WHERE types.type = properties.type
);

ALTER TABLE properties DROP COLUMN type;

UPDATE elements 
SET symbol = UPPER(LEFT(symbol, 1)) || RIGHT(symbol, -1);

ALTER TABLE properties 
ALTER COLUMN atomic_mass TYPE DECIMAL;

INSERT INTO elements (atomic_number, symbol, name) 
VALUES (9, 'F', 'Fluorine');

INSERT INTO properties (atomic_number, atomic_mass, melting_point_celsius, boiling_point_celsius, type_id)
VALUES (9, 18.998, -220, -188.1, (SELECT type_id FROM types WHERE type = 'nonmetal'));

INSERT INTO elements (atomic_number, symbol, name)
VALUES (10, 'Ne', 'Neon');

INSERT INTO properties (atomic_number, atomic_mass, melting_point_celsius, boiling_point_celsius, type_id)
VALUES (10, 20.18, -248.6, -246.1, (SELECT type_id FROM types WHERE type = 'nonmetal'));

DELETE FROM properties WHERE atomic_number = 1000;
DELETE FROM elements WHERE atomic_number = 1000;