CREATE TABLE alerts(
    id SERIAL PRIMARY KEY, 
    type VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(10) DEFAULT 'Info' CHECK(severity IN('Info', 'Warning', 'Critical')),
    is_read BOOLEAN DEFAULT FALSE, 
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);