CREATE DOMAIN public.book_trope_id AS uuid;

CREATE TABLE public.book_trope
(
    id         public.book_trope_id PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL             DEFAULT now(),
    updated_at timestamptz NOT NULL             DEFAULT now()
);

ALTER TABLE public.book_trope
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_trope_authenticated
    ON public.book_trope FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

CREATE TABLE public.book_has_book_trope
(
    book_id       public.book_id       NOT NULL REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_trope_id public.book_trope_id NOT NULL REFERENCES public.book_trope (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (book_id, book_trope_id),

    created_at    timestamptz          NOT NULL DEFAULT now(),
    updated_at    timestamptz          NOT NULL DEFAULT now()
);

ALTER TABLE public.book_has_book_trope
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_has_book_trope_authenticated
    ON public.book_has_book_trope FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
