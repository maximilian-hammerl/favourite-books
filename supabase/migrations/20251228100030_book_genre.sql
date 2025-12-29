CREATE DOMAIN public.book_genre_id AS uuid;

CREATE TABLE public.book_genre
(
    id         public.book_genre_id PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL             DEFAULT now(),
    updated_at timestamptz NOT NULL             DEFAULT now()
);

ALTER TABLE public.book_genre
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_genre_authenticated
    ON public.book_genre FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

CREATE TABLE public.book_has_book_genre
(
    book_id       public.book_id PRIMARY KEY REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_genre_id public.book_genre_id NOT NULL REFERENCES public.book_genre (id) ON UPDATE CASCADE ON DELETE CASCADE,

    created_at    timestamptz          NOT NULL DEFAULT now(),
    updated_at    timestamptz          NOT NULL DEFAULT now()
);

ALTER TABLE public.book_has_book_genre
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_has_book_genre_authenticated
    ON public.book_has_book_genre FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

INSERT INTO public.book_genre (title)
VALUES ('Action'),
       ('Adventure'),
       ('Comedy'),
       ('Crime'),
       ('Mystery'),
       ('Fantasy'),
       ('Horror'),
       ('Science Fiction'),
       ('Science Fantasy'),
       ('Romance');
