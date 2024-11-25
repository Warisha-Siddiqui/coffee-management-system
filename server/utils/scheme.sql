-- Table: ADMIN
CREATE TABLE ADMIN (
    admin_id SERIAL PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Table: EMPLOYEE
CREATE TABLE EMPLOYEE (
    employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(50) NOT NULL,
    contact VARCHAR(15) UNIQUE,
    salary NUMERIC(10, 2) CHECK (salary > 0),
    hire_date DATE NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    attendance CHAR(1) CHECK (attendance IN ('P', 'A')),
    admin_id INTEGER REFERENCES ADMIN(admin_id) ON DELETE SET NULL
);

-- Table: CUSTOMER
CREATE TABLE CUSTOMER (
    customer_id SERIAL PRIMARY KEY,
    c_name VARCHAR(50) NOT NULL,
    loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
    email VARCHAR(100) UNIQUE NOT NULL,
    contact VARCHAR(15) UNIQUE NOT NULL
);

-- Table: PRODUCT
CREATE TABLE PRODUCT (
    p_id SERIAL PRIMARY KEY,
    p_name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    
);

-- Table: INVENTORY
CREATE TABLE INVENTORY (
    inventory_id SERIAL PRIMARY KEY,
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    last_restocked DATE,
    product_id INTEGER UNIQUE NOT NULL REFERENCES PRODUCT(p_id) ON DELETE CASCADE
);

-- Table: ORDERS
CREATE TABLE ORDERS (
    order_id SERIAL PRIMARY KEY,
    order_date DATE DEFAULT CURRENT_DATE,
    status CHAR(1) CHECK (status IN ('P', 'C')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Cash', 'Card', 'Online')),
    employee_id INTEGER REFERENCES EMPLOYEE(employee_id) ON DELETE SET NULL,
    customer_id INTEGER REFERENCES CUSTOMER(customer_id) ON DELETE CASCADE
);

-- Table: ORDER_DETAILS
CREATE TABLE ORDER_DETAILS (
    orderdetail_id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    order_id INTEGER REFERENCES ORDERS(order_id) ON DELETE CASCADE
);


-- Table: BILLING
CREATE TABLE BILLING (
    billing_id SERIAL PRIMARY KEY,
    total_bill NUMERIC(10, 2) NOT NULL CHECK (total_bill >= 0),
    discount NUMERIC(10, 2) CHECK (discount >= 0),
    invoice_date DATE DEFAULT CURRENT_DATE,
    order_id INTEGER UNIQUE NOT NULL REFERENCES ORDERS(order_id) ON DELETE CASCADE
);
