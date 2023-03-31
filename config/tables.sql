CREATE TABLE tbl_users(
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(32) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)



CREATE tbl_banners(
  banner_id int INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(127) not null,
  image varchar(1023) not null,
  target varchar(1023) not null,
  order int default 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tbl_banners(name, image, target, `order`)
  VALUES( 'First banner', 'https://cdn.dsmcdn.com/ty803/pimWidgetApi/mobile_20230327121022_mavimobil2.jpg',
    'https://cdn.dsmcdn.com/ty803/pimWidgetApi/mobile_20230327121022_mavimobil2.jpg', 1);
