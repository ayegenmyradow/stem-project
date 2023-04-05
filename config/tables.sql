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


CREATE TABLE tbl_events(
  event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255),
  description varchar(255),
  start_time timestamp,
  end_time timestamp,
  created_at timestamp default current_timestamp,
  theme varchar(255),
  image varchar(1023),
  capacity int,
  is_online boolean,
  link varchar(1023)
);

CREATE TABLE tbl_event_tags(
  tag varchar(255)
);
INSERT INTO tbl_event_tags(tag) values('Stem');
  
INSERT INTO tbl_banners(name, image, target, `order`)
  VALUES( 'First banner', 'https://cdn.dsmcdn.com/ty803/pimWidgetApi/mobile_20230327121022_mavimobil2.jpg',
    'https://cdn.dsmcdn.com/ty803/pimWidgetApi/mobile_20230327121022_mavimobil2.jpg', 1);


INSERT INTO tbl_events(name, description, start_time, end_time, theme, image, capacity, is_online, link) 
VALUES('Final presentation', 'Capstone project of the stem group', 
  '2023-04-12 17:00', '2023-04-12 19:00', 'Stem', 
  'https://i.ebayimg.com/images/g/gVMAAOSwhBNkEOdy/s-l1600.jpg', 25, false, 'https://www.ebay.com'
)