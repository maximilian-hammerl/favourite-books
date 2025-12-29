CREATE DOMAIN public.book_sub_genre_id AS uuid;

CREATE TABLE public.book_sub_genre
(
    id         public.book_sub_genre_id PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL             DEFAULT now(),
    updated_at timestamptz NOT NULL             DEFAULT now()
);

ALTER TABLE public.book_sub_genre
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_sub_genre_authenticated
    ON public.book_sub_genre FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

CREATE TABLE public.book_has_book_sub_genre
(
    book_id       public.book_id       NOT NULL REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_sub_genre_id public.book_sub_genre_id NOT NULL REFERENCES public.book_sub_genre (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (book_id, book_sub_genre_id),

    created_at    timestamptz          NOT NULL DEFAULT now(),
    updated_at    timestamptz          NOT NULL DEFAULT now()
);

ALTER TABLE public.book_has_book_sub_genre
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_has_book_sub_genre_authenticated
    ON public.book_has_book_sub_genre FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
