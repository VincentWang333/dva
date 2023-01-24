CREATE VIEW good_collaboration as
select a_id, b_id, count(*) as movie_count, avg(score)from (
	select A.movie_id, A.cast_id as a_id, B.cast_id as b_id 
	from movie_cast A, movie_cast B 
	where A.cast_id <> B.cast_id
	and A.movie_id = B.movie_id
	and A.cast_id < B.cast_id
) INNER JOIN movies on movie_id = movies.id 
WHERE score >= 40
GROUP by a_id, b_id
HAVING movie_count >= 3