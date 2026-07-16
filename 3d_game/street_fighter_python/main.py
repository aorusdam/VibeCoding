import random
import tkinter as tk

WIDTH = 900
HEIGHT = 480
FPS = 60


class Fighter:
    def __init__(self, x, y, color, name, is_player=False):
        self.x = x
        self.y = y
        self.color = color
        self.name = name
        self.is_player = is_player
        self.hp = 100
        self.max_hp = 100
        self.facing = 1 if is_player else -1
        self.attack_timer = 0
        self.attack_cooldown = 0
        self.attack_kind = None
        self.attack_hit = False
        self.flash_timer = 0
        self.vx = 0
        self.stunned = 0

    def start_attack(self, kind):
        if self.attack_cooldown > 0 or self.attack_timer > 0:
            return False
        self.attack_kind = kind
        self.attack_timer = 12 if kind == "light" else 18
        self.attack_cooldown = 18 if kind == "light" else 30
        self.attack_hit = False
        return True

    def apply_damage(self, amount):
        self.hp = max(0, self.hp - amount)
        self.flash_timer = 10
        self.stunned = 6

    def update(self, player, enemy):
        if self.stunned > 0:
            self.stunned -= 1

        if self.attack_timer > 0:
            self.attack_timer -= 1
            if self.attack_timer == 6 and not self.attack_hit:
                self.attack_hit = True
                if self.is_player:
                    target = enemy
                else:
                    target = player
                if target and self.is_in_range(target):
                    damage = 12 if self.attack_kind == "light" else 20
                    target.apply_damage(damage)
            elif self.attack_timer <= 0:
                self.attack_kind = None

        if self.attack_cooldown > 0:
            self.attack_cooldown -= 1

        if self.flash_timer > 0:
            self.flash_timer -= 1

    def is_in_range(self, target):
        attack_offset = 70 if self.attack_kind == "light" else 95
        hitbox_x = self.x + attack_offset * self.facing
        return abs(hitbox_x - target.x) < 70 and abs(self.y - target.y) < 55

    def draw(self, canvas):
        body_y = self.y + 20
        head_y = body_y - 80
        leg_y = body_y + 60

        if self.flash_timer > 0:
            outline = "#fef3c7"
        else:
            outline = "#111827"

        canvas.create_rectangle(self.x - 24, body_y - 28, self.x + 24, body_y + 40, fill=self.color, outline=outline, width=4)
        canvas.create_oval(self.x - 26, head_y - 28, self.x + 26, head_y + 20, fill=self.color, outline=outline, width=4)
        canvas.create_rectangle(self.x - 16, body_y + 14, self.x - 40, body_y + 56, fill=self.color, outline=outline, width=3)
        canvas.create_rectangle(self.x + 16, body_y + 14, self.x + 40, body_y + 56, fill=self.color, outline=outline, width=3)
        canvas.create_rectangle(self.x - 12, leg_y - 6, self.x - 4, leg_y + 48, fill=self.color, outline=outline, width=3)
        canvas.create_rectangle(self.x + 4, leg_y - 6, self.x + 12, leg_y + 48, fill=self.color, outline=outline, width=3)

        if self.attack_timer > 0:
            hitbox_x = self.x + (70 if self.attack_kind == "light" else 95) * self.facing
            canvas.create_rectangle(hitbox_x - 20, self.y - 10, hitbox_x + 20, self.y + 50, outline="#fb7185", width=4)


class StreetFighterGame:
    def __init__(self, root):
        self.root = root
        self.canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#020617", highlightthickness=0)
        self.canvas.pack()

        self.player = Fighter(220, 300, "#38bdf8", "Player", is_player=True)
        self.enemy = Fighter(680, 300, "#fb7185", "Rival", is_player=False)
        self.running = True
        self.message = "Use A/D to move, K for light, L for heavy"
        self.keys = {"a": False, "d": False, "k": False, "l": False}

        self.root.bind("<KeyPress>", self.on_key_press)
        self.root.bind("<KeyRelease>", self.on_key_release)
        self.root.bind("<space>", lambda event: self.reset())
        self.root.after(16, self.tick)

    def reset(self):
        self.player = Fighter(220, 300, "#38bdf8", "Player", is_player=True)
        self.enemy = Fighter(680, 300, "#fb7185", "Rival", is_player=False)
        self.message = "Round reset. Stay sharp!"
        self.running = True

    def on_key_press(self, event):
        key = event.keysym.lower()
        if key in self.keys:
            self.keys[key] = True
        if key == "k":
            self.player.start_attack("light")
        elif key == "l":
            self.player.start_attack("heavy")

    def on_key_release(self, event):
        key = event.keysym.lower()
        if key in self.keys:
            self.keys[key] = False

    def update_player(self):
        if self.player.stunned > 0:
            return
        direction = 0
        if self.keys["a"]:
            direction -= 1
        if self.keys["d"]:
            direction += 1
        self.player.x = max(80, min(420, self.player.x + direction * 7))
        self.player.facing = 1

    def update_enemy_ai(self):
        if self.enemy.stunned > 0:
            return
        distance = self.player.x - self.enemy.x
        if abs(distance) > 140:
            self.enemy.x += 4 if distance > 0 else -4
            self.enemy.facing = 1 if distance > 0 else -1
        else:
            if random.random() < 0.02:
                self.enemy.start_attack("light")
            elif random.random() < 0.006:
                self.enemy.start_attack("heavy")
            self.enemy.facing = 1 if distance > 0 else -1

    def tick(self):
        if self.running:
            self.update_player()
            self.update_enemy_ai()
            self.player.update(self.player, self.enemy)
            self.enemy.update(self.player, self.enemy)

            if self.player.hp <= 0:
                self.running = False
                self.message = "You lost. Press SPACE to restart."
            elif self.enemy.hp <= 0:
                self.running = False
                self.message = "You won! Press SPACE to restart."

            self.draw()
        self.root.after(16, self.tick)

    def draw(self):
        self.canvas.delete("all")

        self.canvas.create_rectangle(0, 0, WIDTH, HEIGHT, fill="#020617", outline="")
        self.canvas.create_rectangle(0, 360, WIDTH, HEIGHT, fill="#0f172a", outline="")
        self.canvas.create_rectangle(40, 40, WIDTH - 40, 330, outline="#38bdf8", width=4)

        self.canvas.create_text(140, 28, text=self.player.name, fill="#e2e8f0", font=("Arial", 16, "bold"))
        self.canvas.create_text(WIDTH - 140, 28, text=self.enemy.name, fill="#e2e8f0", font=("Arial", 16, "bold"))
        self.canvas.create_rectangle(80, 60, 280, 84, outline="#94a3b8", width=2)
        self.canvas.create_rectangle(80, 60, 80 + self.player.hp * 2, 84, fill="#22c55e", outline="")
        self.canvas.create_rectangle(WIDTH - 280, 60, WIDTH - 80, 84, outline="#94a3b8", width=2)
        self.canvas.create_rectangle(WIDTH - 280, 60, WIDTH - 280 + self.enemy.hp * 2, 84, fill="#f43f5e", outline="")

        self.player.draw(self.canvas)
        self.enemy.draw(self.canvas)

        self.canvas.create_text(WIDTH // 2, 410, text=self.message, fill="#f8fafc", font=("Arial", 16, "bold"))
        self.canvas.create_text(WIDTH // 2, 440, text="Controls: A/D move | K light attack | L heavy attack | SPACE restart", fill="#cbd5e1", font=("Arial", 12))


def main():
    root = tk.Tk()
    root.title("Street Fighter Python Demo")
    root.resizable(False, False)
    game = StreetFighterGame(root)
    root.mainloop()


if __name__ == "__main__":
    main()
