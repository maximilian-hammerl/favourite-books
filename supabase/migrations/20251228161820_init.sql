CREATE TABLE public.author
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    first_name text        NOT NULL,
    last_name  text        NOT NULL,
    created_by uuid        REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.author
    ENABLE ROW LEVEL SECURITY;

---

CREATE TABLE public.book
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    title      text        NOT NULL,
    created_by uuid        REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.book
    ENABLE ROW LEVEL SECURITY;

---

CREATE TABLE public.author_created_book
(
    author_id  uuid REFERENCES public.author (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_id    uuid REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.author_created_book
    ENABLE ROW LEVEL SECURITY;
