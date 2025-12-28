DO
$$
    DECLARE
        c_instance_id   CONSTANT uuid := '11111111-1111-1111-1111-111111111111';
        c_user_id       CONSTANT uuid := gen_random_uuid();
        c_email_address CONSTANT text := 'test@example.com';
    BEGIN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                                raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES (c_instance_id, c_user_id, 'authenticated', 'authenticated', c_email_address,
                '$2a$10$N92K1njzCB2Jba5DGE8bYe93UZ00CGXU0Y9ZVma8yORa/iwgqam5K', now(),
                jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
                jsonb_build_object('email_verified', TRUE), now(), now());


        INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at,
                                     updated_at)
        VALUES (c_instance_id, c_user_id,
                jsonb_build_object('sub', c_user_id, 'email', c_email_address, 'email_verified', TRUE, 'phone_verified',
                                   TRUE), 'email', now(), now(), now());
    END;
$$;
