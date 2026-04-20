---
title: Escape
description: 'Escape is a thief skill that'
tags:
  - Thief skills
  - Skills
---
**Escape** is a [thief](./thief.md) [skill](./skill.md) that
allows you to exit a fight without [fleeing](./flee.md) if you are
the [buffer](./buffer.md). Escape offers the following advantages
and disadvantages:

- You can choose in which direction to move if you manage to escape:
  when you flee, you run in a random direction.
- You can escape even if there are no available exits. "Escape" with no
  arguments will simply interrupt the fight.
- Escape will not give you a temporary nosneak modifier (always happens
  with flee)
- Escape will not give you a temporary panic modifier (often happens
  with flee)
- Escape has a higher delay than flee. It will also not automatically
  repeat on a failed attempt, so the player need to reissue the command.

The chance of successfully escaping depends on your dexterity, on the
number of your opponents, on the difference between your and your
opponent's level and on how well you [practiced](./practice.md)
this skill. Escaping automatically sets your [mood](./mood.md) to
wimpy.

If nobody is attacking you, you should [disengage](./disengage.md)
instead of escaping.

Examples:

` > escape`
` > escape north`

Knowledge of the escape skill also makes it easier for others to
[rescue](./rescue.md) and [protect](./protect.md) you.
 