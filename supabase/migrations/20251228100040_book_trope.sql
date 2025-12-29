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

---

INSERT INTO public.book_trope (title)
VALUES ('Chosen One'),
       ('Quest'),
       ('Love Triangle'),
       ('Mentor'),
       ('Academy'),
       ('School'),
       ('Reluctant Ruler'),
       ('Reluctant Hero'),
       ('Secret Society'),
       ('Hidden World'),
       ('Prophecy'),
       ('Ultimate evil'),
       ('Unreliable Narrator'),
       ('Newfound Powers'),
       ('Coming of Age'),
       ('Time Travel'),
       ('Alternate Universes'),
       ('meet-cute'),
       ('meet-cringe'),
       ('Love at first sight'),
       ('Enemies to Lovers'),
       ('Lovers to enemies'),
       ('Forced Proximity'),
       ('Imbalanced Dynamics'),
       ('Forbidden Love'),
       ('Fake Relationship'),
       ('Second-Chance love'),
       ('Forced Marriage'),
       ('Detective'),
       ('Amateur'),
       ('Bloodstained Family'),
       ('Ticking Clock'),
       ('Hidden affair'),
       ('Treasure hunt'),
       ('Puzzles and riddles'),
       ('Double agent'),
       ('Everyman-turned-hero'),
       ('High-Stakes'),
       ('Monsters'),
       ('Bargains'),
       ('Creepy old house'),
       ('Inheritance with strings'),
       ('Stranded'),
       ('Found Family'),
       ('Celebrity'),
       ('Underdog'),
       ('Self-Sacrifice'),
       ('Best Friends'),
       ('Pregnancy'),
       ('Military'),
       ('Revenge'),
       ('Office'),
       ('Sport'),
       ('Millionaire'),
       ('Regency'),
       ('Amnesia'),
       ('Blackmail'),
       ('War'),
       ('Trauma'),
       ('Drama'),
       ('Fated Mates'),
       ('Grumpy x Sunshine'),
       ('Aliens'),
       ('Cyberpunk'),
       ('Stalker');
