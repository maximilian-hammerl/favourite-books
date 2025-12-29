CREATE DOMAIN public.book_id AS uuid;

CREATE TABLE public.book
(
    id           public.book_id PRIMARY KEY DEFAULT gen_random_uuid(),
    title        text        NOT NULL,
    subtitle     text        NOT NULL, -- Optional
    blurb        text        NOT NULL, -- Optional
    number_pages integer,
    -- Future: Cover, maps, ...
    -- Languages (release date by language?)
    created_at   timestamptz NOT NULL       DEFAULT now(),
    updated_at   timestamptz NOT NULL       DEFAULT now()
);

ALTER TABLE public.book
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_authenticated
    ON public.book FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
