CREATE DOMAIN public.author_id AS uuid;

CREATE TABLE public.author
(
    id         public.author_id PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text        NOT NULL,
    last_name  text        NOT NULL,
    created_at timestamptz NOT NULL         DEFAULT now(),
    updated_at timestamptz NOT NULL         DEFAULT now()
);

ALTER TABLE public.author
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY author_authenticated
    ON public.author FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

CREATE TABLE public.author_created_book
(
    author_id  public.author_id NOT NULL REFERENCES public.author (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_id    public.book_id   NOT NULL REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (author_id, book_id),
    created_at timestamptz      NOT NULL DEFAULT now(),
    updated_at timestamptz      NOT NULL DEFAULT now()
);

ALTER TABLE public.author_created_book
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY author_created_book_authenticated
    ON public.author_created_book FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
