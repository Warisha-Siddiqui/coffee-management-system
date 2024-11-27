CREATE OR REPLACE FUNCTION order_completion_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM ORDER_DETAILS WHERE order_id = NEW.order_id;
    
    DELETE FROM BILLING WHERE order_id = NEW.order_id;
    
    DELETE FROM ORDERS WHERE order_id = NEW.order_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_completion_trigger
AFTER UPDATE OF status ON ORDERS
FOR EACH ROW
WHEN (NEW.status = 'C' AND OLD.status <> 'C')
EXECUTE FUNCTION order_completion_trigger_function();