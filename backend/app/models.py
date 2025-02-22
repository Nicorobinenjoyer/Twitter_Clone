from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    bio = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)

    tweets = relationship("Tweet", back_populates="owner")

class Tweet(Base):
    __tablename__ = "tweets"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())

    owner = relationship("User", back_populates="tweets")
    comments = relationship("Comment", back_populates="tweet", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="tweet", cascade="all, delete-orphan")  


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    tweet_id = Column(Integer, ForeignKey("tweets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

    tweet = relationship("Tweet", back_populates="comments")
    user = relationship("User")

class Retweet(Base):
    __tablename__ = "retweets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tweet_id = Column(Integer, ForeignKey("tweets.id"))
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", backref="retweets")
    tweet = relationship("Tweet", backref="retweets")

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    tweet_id = Column(Integer, ForeignKey("tweets.id", ondelete="CASCADE"))

    user = relationship("User", backref="likes")
    tweet = relationship("Tweet", back_populates="likes")