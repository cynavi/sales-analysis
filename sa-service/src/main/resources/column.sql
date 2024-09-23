insert into sale_column (name, label, type)
select 'unit_price' as name, 'Unit Price' as label, 'number' as type union all
select 'customer_id' as name, 'Customer Id' as label, 'number' as type union all
select 'invoice_date' as name, 'Invoice Date' as label, 'date' as type union all
select 'country_code' as name, 'Country Code' as label, 'text' as type union all
select 'description' as name, 'Description' as label, 'text' as type union all
select 'stock_code' as name, 'Stock Code' as label, 'text' as type union all
select 'invoice_no' as name, 'Inovoice No' as label, 'number' as type union all
select 'quantity' as name, 'Quantity' as label, 'number' as type;

