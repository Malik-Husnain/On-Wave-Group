
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    type VARCHAR(50) DEFAULT 'user', 
    active BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
DELIMITER $$
CREATE PROCEDURE addUser(
  IN p_email    VARCHAR(255),
  IN p_password VARCHAR(255),
  IN p_type     VARCHAR(50),
  IN p_active   BOOLEAN
)
BEGIN
  INSERT INTO users (email, password, type, active)
  VALUES (p_email, p_password, p_type, p_active);
END $$
DELIMITER ;
