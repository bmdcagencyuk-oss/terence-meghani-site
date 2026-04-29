import type { Review } from '@/lib/reviews';
import { displayTags } from '@/lib/reviews';

type Props = { review: Review };

export function ReviewCard({ review }: Props) {
  const tags = displayTags(review);
  const isStarOnly = review.body === null;
  const stars = '★'.repeat(review.rating);

  return (
    <article className={`review-card${isStarOnly ? ' is-star-only' : ''}`}>
      <header className="rc-head">
        <span className="rc-avatar" aria-hidden="true">{review.initials}</span>
        <div className="rc-who">
          <strong className="rc-name">{review.name}</strong>
        </div>
      </header>

      <div className="rc-stars" aria-label={`${review.rating} out of 5 stars`}>
        {stars}
      </div>

      {review.title && <p className="rc-title">{review.title}</p>}

      {isStarOnly ? (
        <p className="rc-placeholder">Recommended via {review.publisher}</p>
      ) : (
        <div className="rc-body">
          {review.body!.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <ul className="rc-tags" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag} className="rc-tag">{tag}</li>
          ))}
        </ul>
      )}

      <footer className="rc-meta">{review.publisher}</footer>
    </article>
  );
}
