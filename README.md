# ONE ROOM

This is ~~a kindof-submission to~~ **inspired by** [Ludum Dare 37](https://ldjam.com), ~~except that I have no time
this weekend so I probably won't submit it~~ **and I am trying to complete it during a 2-week Chrsitmas vacation**.

The theme is *ONE ROOM*, and I figured I could get something done if I started from something I had
(which is chill with the [jam rules](http://ludumdare.com/compo/rules/)), so this is a fork of
[my es6-crpg code](https://github.com/dorthu/es6-crpg).

#### How to Play

This is currently hosted on [my personal site](https://oneroom.dorthu.com).
I might host this on [itch.io](https://itch.io) if I finish it.

The rest of this document is unedited from the upstream repo.

#### Controls

These are subject to change, and this might be out of date.

| key | action |
|-----|--------|
| arrows | move |
| L | look |
| U | use object in world |
| 1-0 | select items in inventory |
| E | use currently selected item in inventory |
| P | push (attack) |
| space | shoot (attack) |

#### Editor

The code also runs as a level editor - just add [?editor=1](http://rpg-test.dorthu.com?editor=1)
to the URL to the page to run it.

| key | action |
|-----|--------|
| E | Editor select menu (type to find resources, enter to select them) |
| G | Get contents of grid space in front of you |
| D | delete tile |
| space | Place current tile |
| /(\d+)/ space | Place tile for $1 spaces |
| F space | Flood fill tiles |
| W space | Wall fill (add tiles in all empty spaces adjacent to those that would be hit with a flood fill) |
| /R(\d+)x(\d+)/ space | Add a $1 x $2 room of tiles |
| escape | Clear command buffer |
| S | Serialize (dumps json version of level to DOM) |
| Q | Toggle mat2 |
| L | disable gridlines |


### How to Play (developer mode)

```bash
git clone $THIS_REPO
cd es6-crpg
npm install
webpack-dev-server
```

This should get the game running at localhost:8080
