DO
$$
    DECLARE
        c_instance_id CONSTANT uuid := '11111111-1111-1111-1111-111111111111';
        c_user_id     CONSTANT uuid := gen_random_uuid();
    BEGIN
        INSERT INTO auth.users
            (instance_id, id)
        VALUES (c_instance_id, c_user_id);
    END;
$$;
