# Street Fighter Python Prototype Architecture

## Goal
Create a reviewable Python prototype of a Street Fighter-style fighting game with:
- player movement and attacks
- an AI-controlled enemy that closes distance and attacks
- a simple HUD and match flow

## Proposed structure

### 1. Core game loop
- A Tkinter-based loop updates the world at a fixed cadence.
- The loop handles input, AI decisions, attack hit detection, and rendering.

### 2. Fighter model
Each fighter owns:
- position and facing direction
- health and stun state
- attack cooldowns and animation timers
- combat hitbox data

### 3. Input and AI
- Player input uses keyboard controls.
- Enemy AI uses simple rules:
  - approach the player when far away
  - attack when in range
  - back off slightly when health is low

### 4. Rendering
- The game draws two fighters on a canvas.
- Attack frames are shown with a visible hitbox for clarity.
- Health bars and status text appear in the HUD.

## Review checklist
- [x] The prototype demonstrates attacks and enemy AI
- [ ] Add sound effects and richer animations
- [ ] Add a proper round system and win/lose states
- [ ] Add sprite art or more advanced movement

## Suggested next steps
1. Keep the current prototype as a playable demo.
2. Add more polished animations and a round timer.
3. Expand into a full arcade-style experience with special moves and combos.
