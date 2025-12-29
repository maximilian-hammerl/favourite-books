CREATE TABLE public.user_profile
(
    user_id    uuid PRIMARY KEY REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    first_name text        NOT NULL DEFAULT '',
    last_name  text        NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profile
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profile_authenticated
    ON public.user_profile FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

CREATE SCHEMA private;

CREATE FUNCTION private.insert_user_profile_after_insert_users()
    RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
AS
$$
BEGIN
    INSERT INTO public.user_profile (user_id)
    VALUES (new.id);
    RETURN NULL;
END;
$$;

CREATE TRIGGER insert_user_profile_after_insert_users
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
EXECUTE PROCEDURE private.insert_user_profile_after_insert_users();

---

CREATE TABLE public.user_reviewed_book
(
    user_id                   uuid           NOT NULL REFERENCES public.user_profile (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_id                   public.book_id NOT NULL REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (user_id, book_id),

    overall_rating            smallint       NOT NULL,
    emotions_rating           smallint       NOT NULL,
    spice_rating              smallint       NOT NULL,
    darkness_rating           smallint       NOT NULL,
    suspense_rating           smallint       NOT NULL,
    quality_of_writing_rating smallint       NOT NULL,
    plot_development_rating   smallint       NOT NULL,
    characters_rating         smallint       NOT NULL,
    ease_of_reading_rating    smallint       NOT NULL,
    story_immersion_rating    smallint       NOT NULL,
    ending_rating             smallint       NOT NULL,

    created_at                timestamptz    NOT NULL DEFAULT now(),
    updated_at                timestamptz    NOT NULL DEFAULT now()
);

ALTER TABLE public.user_reviewed_book
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_reviewed_book_authenticated
    ON public.user_reviewed_book FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
