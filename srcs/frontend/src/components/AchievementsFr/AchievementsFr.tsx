"use client";
import React from 'react';
import Image from 'next/image';
import classes from './achievementsFr.module.css';
import achieImage from '../../../assets/achie.svg';

interface AchievementsFrProps {
  wins: number;
  loses: number;
  rating: number;
}

interface Achievement {
  title: string;
  desc: string;
  imgUrl: string;
  isUnlocked: boolean;
}


export const AchievementsFr: React.FC<AchievementsFrProps> = ({ wins, loses, rating }) => {
  const achievements: Achievement[] = [
    {
      title: 'Warrior',
      desc: 'Win 10 games',
      imgUrl: achieImage,
      isUnlocked: wins >= 10,
    },
    {
      title: 'Survivor',
      desc: 'Play 50 games',
      imgUrl: achieImage,
      isUnlocked: wins + loses >= 50,
    },
    {
      title: 'First Step',
      desc: 'Play your first game',
      imgUrl: achieImage,
      isUnlocked: wins + loses >= 1,
    },
    {
      title: 'Beginner',
      desc: 'Win your first game',
      imgUrl: achieImage,
      isUnlocked: wins >= 1,
    },
    {
      title: 'Participation Badge',
      desc: 'Play 10 games in total',
      imgUrl: achieImage,
      isUnlocked: wins + loses >= 10,
    },
    {
      title: 'Veteran',
      desc: 'Win 100 games',
      imgUrl: achieImage,
      isUnlocked: wins >= 100,
    },
    {
      title: 'Competitor',
      desc: 'Win 50 games',
      imgUrl: achieImage,
      isUnlocked: wins >= 50,
    },
    {
      title: 'Unyielding',
      desc: 'Lose 50 games and keep going',
      imgUrl: achieImage,
      isUnlocked: loses >= 50,
    },
    {
      title: 'Sharpshooter',
      desc: 'Achieve a rating of 1500',
      imgUrl: achieImage,
      isUnlocked: rating >= 1500,
    },
    {
      title: 'Master',
      desc: 'Win 1000 games',
      imgUrl: achieImage,
      isUnlocked: wins >= 1000,
    },
    {
      title: 'Elite',
      desc: 'Achieve a rating of 2000',
      imgUrl: achieImage,
      isUnlocked: rating >= 2000,
    },
    {
      title: 'Top 1000',
      desc: 'Reach top 1000 in rankings',
      imgUrl: achieImage,
      isUnlocked: true,
    },
    {
      title: 'Champion',
      desc: 'Win 500 games',
      imgUrl: achieImage,
      isUnlocked: wins >= 500,
    },
    {
      title: 'Legend',
      desc: 'Win 2000 games',
      imgUrl: achieImage,
      isUnlocked: wins >= 2000,
    },
    {
      title: 'Unstoppable Streak',
      desc: 'Win 20 games in a row',
      imgUrl: achieImage,
      isUnlocked: wins >= 20,
    },
    {
      title: 'World-Class Player',
      desc: 'Achieve a rating of 2500',
      imgUrl: achieImage,
      isUnlocked: rating >= 2500,
    },
    {
      title: 'Perfectionist',
      desc: 'Win 10 games in a row',
      imgUrl: achieImage,
      isUnlocked: wins >= 10,
    }
  ];

  return (
    <div className={classes.achievements}>
      <h1 className={classes.title}>Achievements</h1>
      <div className={classes.achievementsContainer}>
        {achievements.map((item, index) => (
          <div 
            className={`${classes.achievementItem} ${item.isUnlocked ? classes.unlocked : classes.locked}`} 
            key={index}
          >
            <Image 
              src={item.imgUrl} 
              alt={item.title} 
              width={70} 
              height={70} 
              className={`${classes.image} ${item.isUnlocked ? '' : classes.lockedImage}`} 
            />
            <div className={classes.details}>
              <h3 className={classes.name}>{item.title}</h3>
              <p className={classes.description}>{item.desc}</p>
              {!item.isUnlocked && <p className={classes.lockedText}>Locked</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
