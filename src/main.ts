import { Breakout } from './game/Breakout';
import { GameUI } from './ui/GameUI';
import './style.css';

async function main() {
   const ui = new GameUI();
   const breakout = await Breakout.FromFile('example/game.json', ui.gameContainer);

   let lastScore = 0;

   // Set up game events to tie the UI and the game together
   breakout.addEventListener('load-game', e => {
       ui.updateTitle(e.currentLevel);
       ui.updateBallCount(e.balls);
       ui.setMessage(e.currentLevel);
       ui.updatePoints(e.points);
   });
   breakout.addEventListener('level-won', (e) => {
       ui.dialog.show(`${e.currentLevel}\nCompleted\n\n${e.points - lastScore} Points Gained`, () => {
           ui.dialog.toggle();
           breakout.nextLevel();
           breakout.unpause();
       });
       console.log(lastScore, e.points);
       lastScore = e.points;
       console.log(lastScore, e.points);
   });
   breakout.addEventListener('ball-count', (e) => {
       ui.updateBallCount(e.balls);
   });
   breakout.addEventListener('update-points', (e) => {
       ui.updatePoints(e.points);
   });
   breakout.addEventListener('level-change', (e) => {
       ui.updateTitle(e.currentLevel);
       ui.setMessage(e.currentLevel);
   });
   breakout.addEventListener('game-reset', e => {
       ui.updateTitle(e.currentLevel);
       ui.updateBallCount(e.balls);
       ui.setMessage(e.currentLevel);
       ui.updatePoints(e.points);
   });
   breakout.addEventListener('game-won', (e) => {
       console.log(e.currentLevel);
       ui.updateTitle('You Win!!!')
       ui.dialog.show(`You Win!!!\n\n${e.points} Points Total!`, () => {
           ui.dialog.toggle();
       }, 'Play Again!');
   });
   breakout.addEventListener('game-lost', () => {
       ui.dialog.show(`You Lost :(`, () => {
           ui.dialog.toggle();
           breakout.reset();
       }, 'Try Again.');
   });

   await breakout.load();
   breakout.start();
}
main();
