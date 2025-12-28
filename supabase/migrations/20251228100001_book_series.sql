CREATE DOMAIN public.book_series_id AS uuid;

CREATE TABLE public.book_series
(
    id         public.book_series_id PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text        NOT NULL,
    created_at timestamptz NOT NULL              DEFAULT now(),
    updated_at timestamptz NOT NULL              DEFAULT now()
);

ALTER TABLE public.book_series
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_series_authenticated
    ON public.book_series FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

CREATE TABLE public.book_is_part_of_book_series
(
    book_id          public.book_id REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_series_id   public.book_series_id REFERENCES public.book_series (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (book_id, book_series_id),

    number_in_series smallint    NOT NULL,
    UNIQUE (book_series_id, number_in_series),

    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.book_is_part_of_book_series
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_is_part_of_book_series_authenticated
    ON public.book_is_part_of_book_series FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
