from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import database, models, schemas
from sqlalchemy.orm import aliased
from fastapi import HTTPException
from sqlalchemy import func
from typing import List

router = APIRouter(prefix="/tweets", tags=["tweets"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TweetResponse)
def create_tweet(tweet: schemas.TweetCreate, db: Session = Depends(get_db)):
    db_tweet = models.Tweet(content=tweet.content, owner_id=tweet.owner_id)
    db.add(db_tweet)
    db.commit()
    db.refresh(db_tweet)
    return db_tweet

@router.get("/")
def get_all_tweets(db: Session = Depends(get_db)):
    return db.query(models.Tweet).all()

@router.get("/feed")
def get_feed(db: Session = Depends(get_db), limit: int = Query(10, alias="limit")):
    UserRetweeter = aliased(models.User)  
    UserAuthor = aliased(models.User)  

    tweets = (
        db.query(
            models.Tweet.id,
            models.Tweet.content,
            models.Tweet.owner_id,
            models.Tweet.created_at,
            models.User.name.label("user_name"),
            func.array_agg(models.Like.user_id).label("likes")
        )
        .join(models.User, models.Tweet.owner_id == models.User.id)
        .outerjoin(models.Like, models.Like.tweet_id == models.Tweet.id)
        .group_by(models.Tweet.id, models.User.name)
        .order_by(models.Tweet.created_at.desc())
        .limit(limit)
        .all()
    )

    retweets = (
        db.query(
            models.Retweet.id.label("retweet_id"),
            models.Retweet.user_id,
            models.Retweet.created_at,  
            models.Tweet.id.label("original_tweet_id"),
            models.Tweet.content.label("original_content"),
            models.Tweet.owner_id.label("original_owner_id"),
            models.Tweet.created_at.label("original_created_at"),
            UserRetweeter.name.label("retweeter_name"),
            UserAuthor.name.label("original_author"),
        )
        .join(models.Tweet, models.Retweet.tweet_id == models.Tweet.id)
        .join(UserRetweeter, models.Retweet.user_id == UserRetweeter.id)  
        .join(UserAuthor, models.Tweet.owner_id == UserAuthor.id)  
        .order_by(models.Retweet.created_at.desc())  
        .limit(limit)
        .all()
    )

    
    feed = [
        {
            "type": "tweet",
            "created_at": tweet.created_at,
            "data": {
                "id": tweet.id,
                "content": tweet.content,
                "owner_id": tweet.owner_id,
                "user_name": tweet.user_name,
                "created_at": tweet.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "likes": tweet.likes if tweet.likes[0] is not None else []
            },
        }
        for tweet in tweets
    ]

    
    for retweet in retweets:
        feed.append(
            {
                "type": "retweet",
                "created_at": retweet.created_at,  
                "retweet_id": retweet.retweet_id,
                "user_id": retweet.user_id,
                "user_name": retweet.retweeter_name,
                "original_tweet": {
                    "id": retweet.original_tweet_id,
                    "content": retweet.original_content,
                    "owner_id": retweet.original_owner_id,
                    "user_name": retweet.original_author,
                    "created_at": retweet.original_created_at.strftime("%Y-%m-%d %H:%M:%S"),
                },
            }
        )

    
    feed = sorted(feed, key=lambda x: x["created_at"], reverse=True)

    return feed
@router.get("/{user_id}")
def get_tweets_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Tweet).filter(models.Tweet.owner_id == user_id).all()

@router.put("/{tweet_id}")
def update_tweet(tweet_id: int, user_id: int, content: str, db: Session = Depends(get_db)):
    tweet = db.query(models.Tweet).filter(models.Tweet.id == tweet_id, models.Tweet.owner_id == user_id).first()
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found or unauthorized")
    tweet.content = content
    db.commit()
    db.refresh(tweet)
    return {"message": "Tweet updated successfully", "tweet": tweet}

@router.delete("/{tweet_id}")
def delete_tweet(tweet_id: int, user_id: int, db: Session = Depends(get_db)):
    tweet = db.query(models.Tweet).filter(models.Tweet.id == tweet_id, models.Tweet.owner_id == user_id).first()
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found or unauthorized")
    db.delete(tweet)
    db.commit()
    return {"message": "Tweet deleted successfully"}

@router.get("/{tweet_id}/retweets")
def get_retweets(tweet_id: int, db: Session = Depends(get_db)):
    retweets = db.query(models.Retweet).filter(models.Retweet.tweet_id == tweet_id).all()
    if not retweets:
        raise HTTPException(status_code=404, detail="No retweets found for this tweet")
    return retweets

@router.post("/{tweet_id}/like")
def like_tweet(tweet_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    tweet = db.query(models.Tweet).filter(models.Tweet.id == tweet_id).first()
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet no encontrado")

    existing_like = db.query(models.Like).filter(
        models.Like.tweet_id == tweet_id,
        models.Like.user_id == user_id
    ).first()

    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"message": "Like eliminado", "likes": [like.user_id for like in tweet.likes]}  
    else:
        new_like = models.Like(user_id=user_id, tweet_id=tweet_id)
        db.add(new_like)
        db.commit()
        db.refresh(tweet)
        return {"message": "Like agregado", "likes": [like.user_id for like in tweet.likes]}  

@router.post("/{tweet_id}/comment")
def comment_tweet(tweet_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    tweet = db.query(models.Tweet).filter(models.Tweet.id == tweet_id).first()
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    db_comment = models.Comment(content=comment.content, owner_id=comment.owner_id, tweet_id=tweet_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/{tweet_id}/comments")
def get_comments(tweet_id: int, db: Session = Depends(get_db)):
    return db.query(models.Comment).filter(models.Comment.tweet_id == tweet_id).all()

@router.post("/{tweet_id}/retweet")
def retweet(tweet_id: int, user_id: int, db: Session = Depends(get_db)):
    original_tweet = db.query(models.Tweet).filter(models.Tweet.id == tweet_id).first()
    if not original_tweet:
        raise HTTPException(status_code=404, detail="Original tweet not found")
    existing_retweet = db.query(models.Retweet).filter(models.Retweet.user_id == user_id, models.Retweet.tweet_id == tweet_id).first()
    if existing_retweet:
        raise HTTPException(status_code=400, detail="User already retweeted this tweet")
    db_retweet = models.Retweet(user_id=user_id, tweet_id=tweet_id)
    db.add(db_retweet)
    db.commit()
    return {"message": "Tweet retweeted successfully"}

@router.delete("/{tweet_id}/retweet")
def delete_retweet(tweet_id: int, user_id: int, db: Session = Depends(get_db)):
    retweet = db.query(models.Retweet).filter(models.Retweet.user_id == user_id, models.Retweet.tweet_id == tweet_id).first()
    if not retweet:
        raise HTTPException(status_code=404, detail="Retweet not found")
    db.delete(retweet)
    db.commit()
    return {"message": "Retweet deleted successfully"}
