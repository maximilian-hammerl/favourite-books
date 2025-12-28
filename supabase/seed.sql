DO
$$
    DECLARE
        c_instance_id CONSTANT uuid := '11111111-1111-1111-1111-111111111111';
        c_user_id     CONSTANT uuid := gen_random_uuid();
    BEGIN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                                raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES (c_instance_id, c_user_id, 'authenticated', 'authenticated', 'test@example.com',
                '$2a$10$N92K1njzCB2Jba5DGE8bYe93UZ00CGXU0Y9ZVma8yORa/iwgqam5K', now(), '{
            "provider": "email",
            "providers": [
              "email"
            ]
          }', '{
            "email_verified": true
          }', now(), now());
    END;
$$;
