--
-- PostgreSQL database dump
--

-- Dumped from database version 13.19 (Debian 13.19-1.pgdg120+1)
-- Dumped by pg_dump version 13.19 (Debian 13.19-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content character varying,
    owner_id integer,
    tweet_id integer
);


ALTER TABLE public.comments OWNER TO "user";

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO "user";

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: retweets; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.retweets (
    id integer NOT NULL,
    user_id integer,
    tweet_id integer
);


ALTER TABLE public.retweets OWNER TO "user";

--
-- Name: retweets_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.retweets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.retweets_id_seq OWNER TO "user";

--
-- Name: retweets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.retweets_id_seq OWNED BY public.retweets.id;


--
-- Name: tweets; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.tweets (
    id integer NOT NULL,
    content character varying,
    owner_id integer,
    likes integer
);


ALTER TABLE public.tweets OWNER TO "user";

--
-- Name: tweets_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.tweets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tweets_id_seq OWNER TO "user";

--
-- Name: tweets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.tweets_id_seq OWNED BY public.tweets.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying,
    password character varying
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: retweets id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.retweets ALTER COLUMN id SET DEFAULT nextval('public.retweets_id_seq'::regclass);


--
-- Name: tweets id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tweets ALTER COLUMN id SET DEFAULT nextval('public.tweets_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.comments (id, content, owner_id, tweet_id) FROM stdin;
1	Este es mi primer comentario!	1	1
\.


--
-- Data for Name: retweets; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.retweets (id, user_id, tweet_id) FROM stdin;
\.


--
-- Data for Name: tweets; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.tweets (id, content, owner_id, likes) FROM stdin;
1	Mi primer tweet en FastAPI ­ƒÜÇ	1	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, name, email, password) FROM stdin;
1	Nuevo Nombre	usuario@email.com	$2b$12$NemJ.Mp7O3XnntNG4qmgReXllUZMbWyV2fXf5jQy66pHaOIcRLJiC
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, true);


--
-- Name: retweets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.retweets_id_seq', 1, false);


--
-- Name: tweets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.tweets_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: retweets retweets_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.retweets
    ADD CONSTRAINT retweets_pkey PRIMARY KEY (id);


--
-- Name: tweets tweets_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tweets
    ADD CONSTRAINT tweets_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_comments_content; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_comments_content ON public.comments USING btree (content);


--
-- Name: ix_comments_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_comments_id ON public.comments USING btree (id);


--
-- Name: ix_retweets_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_retweets_id ON public.retweets USING btree (id);


--
-- Name: ix_tweets_content; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_tweets_content ON public.tweets USING btree (content);


--
-- Name: ix_tweets_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_tweets_id ON public.tweets USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_name; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_users_name ON public.users USING btree (name);


--
-- Name: comments comments_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: comments comments_tweet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_tweet_id_fkey FOREIGN KEY (tweet_id) REFERENCES public.tweets(id);


--
-- Name: retweets retweets_tweet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.retweets
    ADD CONSTRAINT retweets_tweet_id_fkey FOREIGN KEY (tweet_id) REFERENCES public.tweets(id);


--
-- Name: retweets retweets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.retweets
    ADD CONSTRAINT retweets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tweets tweets_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tweets
    ADD CONSTRAINT tweets_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

