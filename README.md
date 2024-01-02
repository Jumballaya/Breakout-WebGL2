# Breakout

[Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game)) is a game originally designed by Steve Wozniak where the player controls a paddle to hit a ball to break the level's bricks.

[Play this game here](https://github.com/Jumballaya/Breakout-WebGL2)

## Game Basics
The game has 3 major components: the paddle, ball and bricks.

The paddle moves from side to side and it used to bounce the ball, similar to Pong, but the movement is horizontal instead of vertical.
The ball bounces around the level and when it collides with a breakable brick, the brick will be destroyed.
There are 2 types of bricks: breakable and unbreakable. The unbreakable bricks deflect the ball without being destroyed and the breakable bricks are destroyed on contact with the ball.

The game is made up of levels filled with bricks and when the level has ran out of breakable bricks a message with display letting you know you have completed that level.

Powerups occasionally spawn after destroying a brick

#### Powerups
Powerups alter the game in a few different ways:
 - **Ball Speed** This will increase the base velocity of the ball, as well as give a slight boost to the paddle speed to help deal with the new ball speed.
 - **Paddle Size** This will increase the paddle size a little bit.
 - **Ghost Mode** The ball will no longer be deflected by regular bricks, allowing you to destroy a bunch of bricks before its timer runs out. While in Ghost Mode, the ball's sparkle trail is rainbow colored instead of white.
 - **Sticky** The ball sticks to the center of the paddle everytime it lands.
 - **Pixelated** This one is a negative that will pixelate the game, making it harder to see.


## Code

### Engine
The engine classes are the low level tools for rendering sprites, handles particles, physics and loading assets

### Game
The game classes build on the engine to create the main Breakout class that runs the game.

### UI
The in-game UI, like the dialog boxes, the current level, score and ball count.
