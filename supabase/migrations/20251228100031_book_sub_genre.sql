CREATE DOMAIN public.book_subgenre_id AS uuid;

CREATE TABLE public.book_subgenre
(
    id         public.book_subgenre_id PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL                 DEFAULT now(),
    updated_at timestamptz NOT NULL                 DEFAULT now()
);

ALTER TABLE public.book_subgenre
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_subgenre_authenticated
    ON public.book_subgenre FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

CREATE TABLE public.book_has_book_subgenre
(
    book_id           public.book_id           NOT NULL REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_subgenre_id public.book_subgenre_id NOT NULL REFERENCES public.book_subgenre (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (book_id, book_subgenre_id),

    created_at        timestamptz              NOT NULL DEFAULT now(),
    updated_at        timestamptz              NOT NULL DEFAULT now()
);

ALTER TABLE public.book_has_book_subgenre
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_has_book_subgenre_authenticated
    ON public.book_has_book_subgenre FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

---

INSERT INTO public.book_subgenre (title)
VALUES ('Action'),
       ('Adventure'),
       ('Comedy'),
       ('Crime'),
       ('Mystery'),
       ('Fantasy'),
       ('Horror'),
       ('Science Fiction'),
       ('Science Fantasy'),
       ('Romance'),
       ('New-Adult'),
       ('Young-Adult'),
       ('Classic'),
       ('Epic'),
       ('Historical'),
       ('Realistic'),
       ('Thriller'),
       ('Suspense'),
       ('Erotic'),
       ('Political'),
       ('Psychological'),
       ('Romantasy'),
       ('Urban'),
       ('Western'),
       ('Cozy '),
       ('Locked-Room'),
       ('Contemporary'),
       ('Dark'),
       ('Fairytale'),
       ('Gothic'),
       ('Hard'),
       ('High'),
       ('Low'),
       ('Mythic'),
       ('Paranormal'),
       ('Apocalyptic'),
       ('Utopia'),
       ('Dystopia'),
       ('Nautical'),
       ('Subterranean'),
       ('Planetary'),
       ('Heroic'),
       ('Supernatural');
