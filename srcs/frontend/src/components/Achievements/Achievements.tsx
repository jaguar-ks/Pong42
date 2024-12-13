"use client";
import React from 'react';
import Image from 'next/image';
import { useUserContext } from '@/context/UserContext';
import classes from './achievements.module.css';
import achieImage from '../../../assets/achie.svg';

interface Achievement {
  title: string;
  desc: string;
  imgUrl: string;
  isUnlocked: boolean;
}

export const Achievements = () => {
  const { userData } = useUserContext();

  const achievements: Achievement[] = [
    // Simple Achievements
    {
      title: 'Warrior',
      desc: 'Win 10 games',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 10
    },
    {
      title: 'Survivor',
      desc: 'Play 50 games',
      imgUrl: achieImage,
      isUnlocked: userData.wins + userData.loses >= 50
    },
    {
      title: 'First Step',
      desc: 'Play your first game',
      imgUrl: achieImage,
      isUnlocked: userData.wins + userData.loses >= 1
    },
    {
      title: 'Beginner',
      desc: 'Win your first game',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 1
    },
    {
      title: 'Friendly Player',
      desc: 'Add your first friend',
      imgUrl: achieImage,
      isUnlocked: userData.friendsCount >= 1
    },
    {
      title: 'Social Butterfly',
      desc: 'Chat with another player',
      imgUrl: achieImage,
      isUnlocked: userData.chatsCount >= 1
    },
    {
      title: 'Participation Badge',
      desc: 'Play 10 games in total',
      imgUrl: achieImage,
      isUnlocked: userData.wins + userData.loses >= 10
    },
  
    // Medium Achievements
    {
      title: 'Veteran',
      desc: 'Win 100 games',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 100
    },
    {
      title: 'Competitor',
      desc: 'Win 50 games',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 50
    },
    {
      title: 'Unyielding',
      desc: 'Lose 50 games and keep going',
      imgUrl: achieImage,
      isUnlocked: userData.loses >= 50
    },
    {
      title: 'Sharpshooter',
      desc: 'Achieve a rating of 1500',
      imgUrl: achieImage,
      isUnlocked: userData.rating >= 1500
    },
    {
      title: 'Marathoner',
      desc: 'Play for 10 hours in total',
      imgUrl: achieImage,
      isUnlocked: userData.playTime >= 10 * 60 * 60 // Assuming playtime is tracked in seconds
    },
    {
      title: 'Strategist',
      desc: 'Win 5 games with less than 1 minute on the clock',
      imgUrl: achieImage,
      isUnlocked: userData.lastMinuteWins >= 5 // Requires additional tracking
    },
    {
      title: 'Community Builder',
      desc: 'Invite 5 friends to the platform',
      imgUrl: achieImage,
      isUnlocked: userData.invitesSent >= 5
    },
  
    // Hard Achievements
    {
      title: 'Master',
      desc: 'Win 1000 games',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 1000
    },
    {
      title: 'Elite',
      desc: 'Achieve a rating of 2000',
      imgUrl: achieImage,
      isUnlocked: userData.rating >= 2000
    },
    {
      title: 'Top 1000',
      desc: 'Reach top 1000 in rankings',
      imgUrl: achieImage,
      isUnlocked: userData.rank <= 1000
    },
    {
      title: 'Champion',
      desc: 'Win 500 games',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 500
    },
    {
      title: 'Legend',
      desc: 'Win 2000 games',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 2000
    },
    {
      title: 'Unstoppable Streak',
      desc: 'Win 20 games in a row',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 20 // Requires tracking win streaks
    },
    {
      title: 'World-Class Player',
      desc: 'Achieve a rating of 2500',
      imgUrl: achieImage,
      isUnlocked: userData.rating >= 2500
    },
    {
      title: 'Perfectionist',
      desc: 'Win 10 games in a row',
      imgUrl: achieImage,
      isUnlocked: userData.wins >= 10 // Requires additional tracking
    },
    {
      title: 'Comeback King',
      desc: 'Win a game after being behind by 50% rating',
      imgUrl: achieImage,
      isUnlocked: false // Requires additional tracking
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

