CREATE DATABASE langlearn;

CREATE TABLE domains (
    id SERIAL PRIMARY KEY,  
    name VARCHAR(100) UNIQUE NOT NULL  
);

CREATE TABLE users (
id SERIAL PRIMARY KEY,  
name VARCHAR(100) NOT NULL, 
email VARCHAR(100) UNIQUE NOT NULL,  
password VARCHAR(255) NOT NULL, 
registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
token TEXT,
UNIQUE(email)  
);

CREATE TABLE lessons (
id SERIAL PRIMARY KEY,  
title VARCHAR(255) NOT NULL,  
description TEXT, 
domain_id INT REFERENCES domains(id) ON DELETE CASCADE,  
completed BOOLEAN DEFAULT FALSE  
);

CREATE TABLE tests (
id SERIAL PRIMARY KEY,  
title VARCHAR(255) NOT NULL, 
description TEXT, 
lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,  
domain_id INT REFERENCES domains(id) ON DELETE CASCADE,  
completed BOOLEAN DEFAULT FALSE
);


CREATE TABLE words (
id SERIAL PRIMARY KEY,  
word VARCHAR(100) NOT NULL,  
lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,  
domain_id INT REFERENCES domains(id) ON DELETE CASCADE  
);


CREATE TABLE expressions (
id SERIAL PRIMARY KEY,  
expression TEXT NOT NULL,  
lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,  
domain_id INT REFERENCES domains(id) ON DELETE CASCADE  
);

CREATE TABLE reports (
user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,  
lessons_completed INT DEFAULT 0,  
tests_completed INT DEFAULT 0,  
avg_lesson_time FLOAT DEFAULT 0,  
avg_test_time FLOAT DEFAULT 0,  
mistakes_per_test FLOAT DEFAULT 0,  
progress_percent FLOAT DEFAULT 0,  
total_time FLOAT DEFAULT 0  
);









